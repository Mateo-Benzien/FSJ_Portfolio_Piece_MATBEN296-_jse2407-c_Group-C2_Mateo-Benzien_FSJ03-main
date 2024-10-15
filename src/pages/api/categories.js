import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore'; // Import required Firestore functions

export default async function handler(req, res) {
  try {
    const snapshot = await getDocs(collection(db, 'categories')); // Use getDocs and collection
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
}
