const MinimalImageData = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Unique id of the image',
    },
    originalFileName: {
      type: 'string',
      description: 'Original file name',
      examples: ['MyFancyFileName'],
    },
    extension: {
      type: 'string',
      description: 'File extension',
      pattern: '^\\.(jpeg|jpg|png|webp|gif)$',
      examples: ['.gif'],
    },
    createdOn: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp of when the layout was created',
    },
    createdBy: {
      description: 'User details of the image creator',
      $ref: '#/components/schemas/PublicUserData',
    },
  },
  required: ['id', 'originalFileName', 'extension', 'createdOn', 'createdBy'],
};

export default MinimalImageData;
