import { Request, Response } from 'express';
import removeMembershipValidation from './removeMembershipValidation';
import { MembershipData, UserData } from 'src/types';
import { getMembershipData, getPublicUserData } from 'src/controllers/utils';

interface RemoveMembershipRequestBody {
  confirm?: unknown;
}

type RemoveMembershipResponseBody = {
  membership: MembershipData & { updatedOn: Date | null; updatedBy: UserData | null };
};

const removeMembershipFlow = async (
  req: Request<never, never, RemoveMembershipRequestBody>,
  res: Response,
) => {
  try {
    const { membership, project } = req;
    removeMembershipValidation({ user: membership.user, confirm: req.body?.confirm });

    await membership.destroy();

    const responseBody: RemoveMembershipResponseBody = {
      membership: {
        ...getMembershipData(Object.assign(membership, { project })),
        updatedOn: membership.updatedOn || null,
        updatedBy:
          (membership.updatedById &&
            membership.updatedBy &&
            getPublicUserData(membership.updatedBy)) ||
          null,
      },
    };
    return res.success('membership has been successfully removed', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default removeMembershipFlow;
