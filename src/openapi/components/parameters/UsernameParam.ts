const UsernameParam = {
  name: 'username',
  description: 'Case insensitive username of a user',
  required: true,
  in: 'path',
  schema: {
    type: 'string',
  },
};

export default UsernameParam;
