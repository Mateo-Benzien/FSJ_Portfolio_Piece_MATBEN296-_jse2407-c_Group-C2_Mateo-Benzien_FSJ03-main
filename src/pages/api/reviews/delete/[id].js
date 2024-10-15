import { db } from '../../../../lib/firebaseConfig'; // Import your Firebase config
import { verifyIdToken } from '../../../../middleware/auth';

const deleteReview = async (req, res) => {
  const { id } = req.query;

  // Ensure the request is authenticated
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const reviewRef = db.collection('products').doc(req.body.productId).collection('reviews').doc(id);
    await reviewRef.delete();
    
    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default verifyIdToken(deleteReview);
