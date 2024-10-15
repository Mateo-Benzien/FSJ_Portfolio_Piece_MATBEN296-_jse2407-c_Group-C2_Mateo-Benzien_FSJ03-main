import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import required Firestore functions

export default async function handler(req, res) {
  const { page = 1, limit = 10, search = '', category = '', sort = 'asc' } = req.query;

  try {
    let q = query(collection(db, 'products')); // Use query and collection

    // Filter by category if provided
    if (category) {
      q = query(q, where('category', '==', category));
    }

    // Get total products count for pagination
    const totalSnapshot = await getDocs(q); // Use getDocs to retrieve documents
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
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Error fetching products', error: error.message || 'Unknown error' });
  }
}
