const LayoutIdParam = {
  name: 'layoutId',
  in: 'path',
  description: 'Unique id of the layout',
  required: true,
  schema: {
    type: 'string',
    format: 'uuid',
  },
};

export default LayoutIdParam;
