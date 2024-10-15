export const paginate = (items, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return items.slice(startIndex, endIndex);
  };
  