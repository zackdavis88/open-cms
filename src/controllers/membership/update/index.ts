import { Request, Response } from 'express';
import { getMembershipData, getPublicUserData } from 'src/controllers/utils';
import { MembershipData, UserData } from 'src/types';
import updateMembershipValidation from './updateMembershipValidation';

interface UpdateMembershipRequestBody {
  isAdmin?: unknown;
  isWriter?: unknown;
}

type UpdateMembershipResponseBody = {
  membership: MembershipData & { updatedOn: Date | null; updatedBy: UserData | null };
};
const updateMembershipFlow = async (
  req: Request<never, never, UpdateMembershipRequestBody>,
  res: Response,
) => {
  try {
    const { membership, user: authUser, project } = req;
    const { isAdmin, isWriter } = updateMembershipValidation({
      isAdminInput: req.body.isAdmin,
      isWriterInput: req.body.isWriter,
    });

    if (typeof isAdmin === 'boolean') {
      membership.isAdmin = isAdmin;
    }

    if (typeof isWriter === 'boolean') {
      membership.isWriter = isWriter;
    }

    membership.updatedOn = new Date();
    membership.updatedBy = authUser;
    membership.updatedById = authUser.id;
    await membership.save();

    const responseBody: UpdateMembershipResponseBody = {
      membership: {
        ...getMembershipData(Object.assign(membership, { project })),
        updatedOn: membership.updatedOn,
        updatedBy: getPublicUserData(membership.updatedBy),
      },
    };
    return res.success('membership has been successfully updated', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default updateMembershipFlow;
