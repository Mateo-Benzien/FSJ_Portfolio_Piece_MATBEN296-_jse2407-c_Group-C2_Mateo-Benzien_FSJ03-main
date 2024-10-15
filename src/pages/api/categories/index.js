import { db } from '../../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  try {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
}
