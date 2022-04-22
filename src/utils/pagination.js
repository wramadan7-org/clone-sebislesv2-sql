/**
 *
 * @param {Object} items
 * @param {Number} currentPage
 * @param {Number} limitItems
 * @returns
 */
const paginator = (items, currentPage, limitItems) => {
  const limitMax = 50;
  const page = parseInt(currentPage) || 1;
  let limit = parseInt(limitItems) || 10;
  if (limit > limitMax) limit = limitMax; // force maximum limit
  const offset = (page - 1) * limit;

  const paginatedItems = items.slice(offset).slice(0, limitItems);
  const totalPages = Math.ceil(items.length / limit);

  return {
    totalData: items.length,
    currentPage: page,
    totalPages,
    limitPage: limit,
    prevPage: page - 1 ? page - 1 : null,
    nextPage: totalPages > page ? page + 1 : null,
    data: paginatedItems,
  };
};

/**
 * Create pagination setting, used by getPagingData fn
 * @param {number} page
 * @param {number} perPage
 * @returns {Object}
 */
const getPagination = (page, perPage) => {
  const limitMax = 50;
  let limit;
  limit = perPage && perPage > 0 ? +perPage : 10;
  if (limit > limitMax) limit = limitMax; // force maximum limit
  const offset = page && page > 0 ? (+page - 1) * limit : 0;

  return { limit, offset };
};

/**
 * Create pagination object
 * @param {Object} data
 * @param {number} page
 * @param {number} perPage
 * @returns {Object}
 */
const getPagingData = (data, page, perPage) => {
  const { count: totalItems, rows: items } = data;
  const totalPages = Math.ceil(totalItems / +perPage);
  const currentPage = page && page > 0 ? +page : 1;
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = page && currentPage < totalPages ? currentPage + 1 : null;

  return {
    perPage,
    currentPage,
    previousPage,
    nextPage,
    totalPages,
    totalItems,
    items,
  };
};

const definePage = (paginationPage, paginationSize) => {
  const pageAsNumber = Number.parseInt(paginationPage);
  const sizeAsNumber = Number.parseInt(paginationSize);

  let page = 1;
  if (!Number.isNaN(pageAsNumber) && pageAsNumber >= 1) {
    page = pageAsNumber;
  }
  let size = 5;
  if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber > 5) {
    size = sizeAsNumber;
  }
  const offset = (page - 1) * size;
  return { page, size, offset };
};

const arrayPaginator = (items, page, perPage) => {
  let offset = (page - 1) * perPage;

  let paginatedItems = items.slice(offset).slice(0, perPage);
  let totalPages = Math.ceil(items.length / perPage);
  return {
    perPage,
    currentPage: page,
    previousPage: page - 1 ? page - 1 : null,
    nextPage: totalPages > page ? page + 1 : null,
    totalPages,
    totalItems: items.length,
    items: paginatedItems,
  };
};

module.exports = {
  paginator,
  getPagination,
  getPagingData,
  definePage,
  arrayPaginator,
};
