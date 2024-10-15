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

    // Search functionality using Fuse.js
    let products;
    if (search) {
      const fuse = new Fuse(totalProducts, { keys: ['title'], includeScore: true });
      const results = fuse.search(search);
      products = results.map(result => result.item);
    } else {
      products = totalProducts;
    }

    // Sort products by price
    const sortedProducts = sort === 'desc' 
      ? products.sort((a, b) => b.price - a.price) 
      : products.sort((a, b) => a.price - b.price);

    // Handle pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

    // Return response
    return res.status(200).json({
      products: paginatedProducts,
      total: sortedProducts.length,
      page,
      limit
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching products', error });
  }
}