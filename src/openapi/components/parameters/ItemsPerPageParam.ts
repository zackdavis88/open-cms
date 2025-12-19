const ItemsPerPageParam = {
  name: 'itemsPerPage',
  in: 'query',
  schema: {
    type: 'integer',
  },
  description: 'Number of results per page',
};

export default ItemsPerPageParam;
