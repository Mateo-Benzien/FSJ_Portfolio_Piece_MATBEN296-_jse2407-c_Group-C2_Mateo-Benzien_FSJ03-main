// pages/api/products.js
import { db } from '../../firebase'; // Ensure to import your Firebase configuration
import Fuse from 'fuse.js';

export default async function handler(req, res) {
  const { page = 1, limit = 10, search = '', category = '', sort = 'asc' } = req.query;

  try {
    let query = db.collection('products');

    // Filter by category if provided
    if (category) {
      query = query.where('category', '==', category);
    }

    // Get total products count for pagination
    const totalSnapshot = await query.get();
    const totalProducts = totalSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Fetch products with pagination
    const snapshot = await query.limit(limit).offset((page - 1) * limit).get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Search functionality using Fuse.js
    if (search) {
      const fuse = new Fuse(products, { keys: ['title'], includeScore: true });
      const results = fuse.search(search);
      return res.status(200).json({
        products: results.map(result => result.item),
        total: results.length // total for filtered results
      });
    }

    // Sort products by price
    const sortedProducts = sort === 'desc' 
      ? products.sort((a, b) => b.price - a.price) 
      : products.sort((a, b) => a.price - b.price);

    // Handle pagination and return response
    return res.status(200).json({
      products: sortedProducts,
      total: totalProducts.length // total count for all products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
}
