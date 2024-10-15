import { db } from '../../../lib/firebase';
import { collection, getDocs, query, limit, startAfter } from 'firebase/firestore';
import { paginate } from '../../../utils/paginate';
import { searchProducts, filterProductsByCategory, sortProductsByPrice } from '../../../lib/searchFilter';

export default async function handler(req, res) {
  const { page = 1, limit = 10, search, category, sort } = req.query;

  try {
    const productsRef = collection(db, 'products');
    const productsQuery = query(
      productsRef,
      limit(Number(limit)),
      startAfter((Number(page) - 1) * Number(limit))
    );

    const productsSnapshot = await getDocs(productsQuery);
    let products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Apply search
    products = searchProducts(products, search);
    
    // Apply filtering by category
    products = filterProductsByCategory(products, category);
    
    // Apply sorting by price
    products = sortProductsByPrice(products, sort);
    
    // Handle pagination
    const paginatedProducts = paginate(products, page, limit);
    
    res.status(200).json(paginatedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
}
