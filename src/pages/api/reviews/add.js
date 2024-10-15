import { db } from '../../../lib/firebaseConfig'; // Import your Firebase config
import { verifyIdToken } from '../../../middleware/auth';

const addReview = async (req, res) => {
  const { rating, comment, productId } = req.body;

  // Ensure the request is authenticated
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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

    return res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default verifyIdToken(addReview);
