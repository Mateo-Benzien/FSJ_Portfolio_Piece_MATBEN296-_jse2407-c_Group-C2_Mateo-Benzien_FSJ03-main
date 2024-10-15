// pages/api/categories.js
import { db } from '../../firebase'; // Ensure to import your Firebase configuration

export default async function handler(req, res) {
  try {
    const snapshot = await db.collection('categories').get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
}
