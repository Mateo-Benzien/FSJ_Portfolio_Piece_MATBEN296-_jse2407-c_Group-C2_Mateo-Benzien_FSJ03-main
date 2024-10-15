// src/pages/api/products/[id].js
import { db } from '../../../lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { id } = req.query;

  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
}
