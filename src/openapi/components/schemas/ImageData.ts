const ImageData = {
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
      examples: ['.gif'],
    },
    url: {
      type: 'string',
      description: 'Static url of the image',
      examples: [
        'https://www.open-cms.com/static/4d34fb00-aa47-4902-b50a-612494ba3808/12fffb00-aa47-0000-b50a-612494ba3808.png',
      ],
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
  required: ['id', 'originalFileName', 'extension', 'url', 'createdOn', 'createdBy'],
};

export default ImageData;
