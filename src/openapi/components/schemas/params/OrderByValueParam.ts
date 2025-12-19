const OrderByValueParam = {
  name: 'orderBy',
  in: 'query',
  schema: {
    type: 'string',
    enum: ['asc', 'desc'],
    default: 'desc',
  },
  description: 'Direction to order results by',
};

export default OrderByValueParam;
