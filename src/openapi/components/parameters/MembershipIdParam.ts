const MembershipIdParam = {
  name: 'membershipId',
  in: 'path',
  description: 'Unique id of the membership',
  required: true,
  schema: {
    type: 'string',
    format: 'uuid',
  },
};

export default MembershipIdParam;
