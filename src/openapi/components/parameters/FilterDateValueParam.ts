const FilterDateValueParam = {
  name: 'filterDateValue',
  in: 'query',
  schema: {
    type: 'string',
    format: 'date-time',
  },
};

export default FilterDateValueParam;
