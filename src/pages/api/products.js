// pages/api/products.js
import { db } from '../../lib/firebaseConfig';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import Fuse from 'fuse.js';

export default async function handler(req, res) {
  try {
    const { page = 1, limit = 10, lastVisibleId = null, search = '', category = '', sortBy = 'name', order = 'asc' } = req.query;

    const productCollection = collection(db, 'products');
    let q;

    if (lastVisibleId) {
      const lastDocSnapshot = await getDocs(query(productCollection, orderBy('name'), limit(1), startAfter(lastVisibleId)));
      q = query(productCollection, orderBy('name'), startAfter(lastDocSnapshot.docs[0]), limit(parseInt(limit)));
    } else {
      q = query(productCollection, orderBy('name'), limit(parseInt(limit)));
    }

    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Filtering by category
    const filteredProducts = category ? products.filter(product => product.category === category) : products;

    // Searching using Fuse.js
    const fuse = new Fuse(filteredProducts, {
      keys: ['title'],
      threshold: 0.3, // Adjust based on your needs
    });
    const searchResults = search ? fuse.search(search).map(result => result.item) : filteredProducts;

    // Sorting
    const sortedProducts = searchResults.sort((a, b) => {
      const priceA = a.price;
      const priceB = b.price;
      return order === 'asc' ? priceA - priceB : priceB - priceA;
    });

    // Get paginated results
    const paginatedProducts = sortedProducts.slice((page - 1) * limit, page * limit);

    // Get the last document for pagination
    const lastVisible = paginatedProducts[paginatedProducts.length - 1];

    res.status(200).json({
      products: paginatedProducts,
      lastVisibleId: lastVisible ? lastVisible.id : null,
      nextPage: lastVisible ? parseInt(page) + 1 : null,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
