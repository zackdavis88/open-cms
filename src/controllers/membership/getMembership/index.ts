import { Request, Response, NextFunction } from 'express';
import { getMembershipData, getPublicUserData } from 'src/controllers/utils';
import { MembershipData, UserData } from 'src/types';
import getMembershipValidation from './getMembershipValidation';
import { User } from 'src/models';
import { NotFoundError } from 'src/server/utils/errors';

export const getMembershipMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { project } = req;
    getMembershipValidation(req.params.membershipId);
    const membership = await project.getMembership({
      where: { id: req.params.membershipId },
      include: [
        { model: User, as: 'user' },
        { model: User, as: 'createdBy' },
        { model: User, as: 'updatedBy' },
      ],
    });

    if (!membership) {
      throw new NotFoundError('requested membership not found');
    }

    req.membership = membership;
    next();
  } catch (error) {
    return res.sendError(error);
  }
};

type GetMembershipResponseBody = {
  membership: MembershipData & { updatedOn: Date | null; updatedBy: UserData | null };
};
const getMembershipFlow = (req: Request, res: Response) => {
  try {
    const { membership, project } = req;
    const responseBody: GetMembershipResponseBody = {
      membership: {
        ...getMembershipData(Object.assign(membership, { project })),
        updatedOn: membership.updatedOn || null,
        updatedBy:
          membership.updatedById &&
          membership.updatedBy &&
          getPublicUserData(membership.updatedBy),
      },
    };
    return res.success('membership has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getMembershipFlow;
