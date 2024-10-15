import { db } from '../../../../lib/firebaseConfig'; // Import your Firebase config
import verifyIdToken from '../../../../middleware/auth'; // Ensure this import is correct

const reviewsHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'POST': // Add a review
      // Ensure the request is authenticated
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      // Validate input data
      const { rating, comment, productId } = req.body;
      if (!rating || !comment || !productId) {
        return res.status(400).json({ error: 'Invalid input data' });
      }
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid rating' });
      }
      if (typeof comment !== 'string' || comment.length < 1) {
        return res.status(400).json({ error: 'Invalid comment' });
      }

      try {
        const user = req.user; // Get user from middleware
        const newReview = {
          rating,
          comment,
          date: new Date().toISOString(),
          reviewerEmail: user.email,
          reviewerName: user.displayName || 'Anonymous', // Adjust based on your auth user object
        };

        // Add review to Firestore
        await db.collection('products').doc(productId).collection('reviews').add(newReview);

        // Return success response
        return res.status(201).json({ success: true, message: 'Review added successfully' });
      } catch (error) {
        // Log the error for debugging purposes
        console.error('Error adding review:', error);

        // Return error response
        return res.status(500).json({ success: false, error: 'Failed to add review' });
      }

    case 'DELETE': // Delete a review
      const { id } = req.query;
      const { productId: deleteProductId } = req.body;

      // Ensure the request is authenticated
      if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      try {
        const reviewRef = db.collection('products').doc(deleteProductId).collection('reviews').doc(id);
        await reviewRef.delete();

        // Respond with a success message
        return res.status(200).json({ success: true, message: 'Review deleted successfully' });
      } catch (error) {
        console.error('Error deleting review:', error);
        // Respond with an error message
        return res.status(500).json({ success: false, error: 'Failed to delete review' });
      }

    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default verifyIdToken(reviewsHandler);
