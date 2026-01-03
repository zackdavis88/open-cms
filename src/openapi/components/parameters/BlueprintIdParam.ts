const BlueprintIdParam = {
  name: 'blueprintId',
  in: 'path',
  description: 'Unique id of the blueprint',
  required: true,
  schema: {
    type: 'string',
    format: 'uuid',
  },
};

export default BlueprintIdParam;
