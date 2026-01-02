const FilterIdValueParam = {
  name: 'filterIdValue',
  in: 'query',
  schema: {
    type: 'string',
    format: 'uuid',
  },
};

export default FilterIdValueParam;
