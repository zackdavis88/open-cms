const FilterDateOpParam = {
  name: 'filterDateOp',
  in: 'query',
  schema: {
    type: 'string',
    enum: ['eq', 'gt', 'lt', 'gte', 'lte'],
  },
};

export default FilterDateOpParam;
