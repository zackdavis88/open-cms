const ImageData = {
  allOf: [
    { $ref: '#/components/schemas/MinimalImageData' },
    {
      type: 'object',
      properties: {
        url: {
          type: ['string'],
          description: 'Static url of the image',
          examples: [
            'https://www.open-cms.com/static/4d34fb00-aa47-4902-b50a-612494ba3808/12fffb00-aa47-0000-b50a-612494ba3808.gif',
          ],
        },
      },
    },
  ],
  required: ['url'],
};

export default ImageData;
