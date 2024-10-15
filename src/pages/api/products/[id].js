// src/pages/api/products/[id].js

import { db } from '../../../firebase'; // Ensure to import your Firebase configuration
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API endpoint to retrieve an individual product by ID.
 *
 * @param {NextApiRequest} req - Incoming request object.
 * @param {NextApiResponse} res - Outgoing response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    // Retrieve the product document from Firestore
    const productDoc = await db.collection('products').doc(id).get();

    // Check if the product document exists
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Extract the product data and return it as JSON
    const product = { id: productDoc.id, ...productDoc.data() };
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
}