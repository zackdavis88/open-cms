const FilterStringColumnParam = {
  name: 'filterStringColumn',
  in: 'query',
  schema: {
    type: 'array',
    items: {
      type: 'string',
    },
  },
  style: 'form',
  explode: true,
};

export default FilterStringColumnParam;
