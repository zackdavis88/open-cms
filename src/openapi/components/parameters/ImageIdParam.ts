const ImageIdParam = {
  name: 'imageId',
  in: 'path',
  description: 'Unique id of the image',
  required: true,
  schema: {
    type: 'string',
    format: 'uuid',
  },
};

export default ImageIdParam;
