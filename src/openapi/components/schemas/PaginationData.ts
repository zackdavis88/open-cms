const PaginationData = {
  type: 'object',
  properties: {
    page: {
      type: 'integer',
      description: 'the current page of the results',
      examples: [1],
    },
    totalPages: {
      type: 'integer',
      description: 'the total number of pages',
      examples: [7],
    },
    itemsPerPage: {
      type: 'integer',
      description: 'the total number of items per page',
      examples: [10],
    },
    totalItems: {
      type: 'integer',
      description: 'the total number of results',
      examples: [70],
    },
  },
  required: ['page', 'totalPages', 'itemsPerPage', 'totalItems'],
};

export default PaginationData;
