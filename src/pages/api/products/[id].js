// pages/api/products/[id].js
import { db } from '../../../firebase'; // Ensure to import your Firebase configuration

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const productDoc = await db.collection('products').doc(id).get();
    
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = { id: productDoc.id, ...productDoc.data() };
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
}
