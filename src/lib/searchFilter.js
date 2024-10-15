import Fuse from 'fuse.js';

export const searchProducts = (products, query) => {
  if (!query) return products;

  const fuse = new Fuse(products, { keys: ['title'], threshold: 0.3 });
  return fuse.search(query).map(result => result.item);
};

export const filterProductsByCategory = (products, category) => {
  if (!category) return products;
  return products.filter(product => product.category === category);
};

export const sortProductsByPrice = (products, sortOrder) => {
  return products.sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0;
  });
};
