import { Request, Response } from 'express';
import createMembershipValidation from './createMembershipValidation';
import { MembershipData } from 'src/types';
import { getMembershipData } from 'src/controllers/utils';

interface CreateMembershipRequestParams {
  username: string;
  projectId: string;
}

interface CreateMembershipRequestBody {
  isAdmin?: unknown;
  isWriter?: unknown;
}

type CreateMembershipResponseBody = {
  membership: MembershipData;
};

const CreateMembershipFlow = async (
  req: Request<
    CreateMembershipRequestParams,
    never,
    CreateMembershipRequestBody | undefined
  >,
  res: Response,
) => {
  try {
    const { project, user: authUser } = req;
    const { user, isAdmin, isWriter } = await createMembershipValidation({
      usernameInput: req.params.username,
      isAdminInput: req.body?.isAdmin,
      isWriterInput: req.body?.isWriter,
      project,
    });

    const membership = await project.createMembership({
      userId: user.id,
      isAdmin,
      isWriter,
      createdById: authUser.id,
    });
    membership.project = project;
    membership.user = user;
    membership.createdBy = authUser;

    const responseBody: CreateMembershipResponseBody = {
      membership: getMembershipData(membership),
    };

    return res.success('membership has been successfully created', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default CreateMembershipFlow;
