import { db } from '../../../../lib/firebaseConfig'; // Import your Firebase config
import { verifyIdToken } from '../../../../middleware/auth';

const editReview = async (req, res) => {
  const { id } = req.query;
  const { rating, comment } = req.body;

  // Ensure the request is authenticated
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const user = req.user; // Get user from middleware
    const reviewRef = db.collection('products').doc(req.body.productId).collection('reviews').doc(id);

    const review = await reviewRef.get();
    if (!review.exists) return res.status(404).json({ error: 'Review not found' });

    await reviewRef.update({ rating, comment, date: new Date().toISOString() });
    
    return res.status(200).json({ message: 'Review updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default verifyIdToken(editReview);
