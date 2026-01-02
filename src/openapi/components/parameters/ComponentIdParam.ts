const ComponentIdParam = {
  name: 'componentId',
  in: 'path',
  description: 'Unique id of the component',
  required: true,
  schema: {
    type: 'string',
    format: 'uuid',
  },
};

export default ComponentIdParam;
