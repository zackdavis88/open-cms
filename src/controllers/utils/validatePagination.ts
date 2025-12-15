import { Request } from 'express';

let DEFAULT_ITEMS_PER_PAGE = 10;
if (!isNaN(Number(process.env.DEFAULT_ITEMS_PER_PAGE))) {
  DEFAULT_ITEMS_PER_PAGE = Number(process.env.DEFAULT_ITEMS_PER_PAGE);
}

type ValidatePagination = (
  queryString: Request['query'],
  count: number,
) => {
  page: number;
  totalPages: number;
  itemsPerPage: number;
  pageOffset: number;
  totalItems: number;
};

const validatePagination: ValidatePagination = (queryString, count) => {
  let itemsPerPage = DEFAULT_ITEMS_PER_PAGE || 10;
  const itemsPerPageInput = Number(queryString.itemsPerPage);
  if (
    itemsPerPageInput &&
    !isNaN(itemsPerPageInput) &&
    Number.isInteger(itemsPerPageInput) &&
    itemsPerPageInput > 0
  ) {
    itemsPerPage = itemsPerPageInput;
  }

  const totalPages = Math.ceil(count / itemsPerPage);

  let page = Number(queryString.page);
  if (isNaN(page) || !Number.isInteger(Number(page)) || page <= 0) {
    page = 1;
  } else if (page > totalPages) {
    // If the page is greater than the limit. set it to the limit.
    page = totalPages ? totalPages : 1;
  }

  const pageOffset = (page - 1) * itemsPerPage;

  return {
    page,
    totalItems: count,
    totalPages,
    itemsPerPage,
    pageOffset,
  };
};

export type PaginationData = ReturnType<typeof validatePagination>;
export default validatePagination;
