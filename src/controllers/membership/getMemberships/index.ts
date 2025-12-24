import { Request, Response } from 'express';
import getMembershipsValidation from './getMembershipsValidation';
import { Project } from 'src/models';
import { MembershipData, PublicPaginationData } from 'src/types';
import { getMembershipData, getPublicUserData } from 'src/controllers/utils';

type GetMembershipResponseBody = {
  project: { id: Project['id']; name: Project['name'] };
  memberships: Omit<MembershipData, 'project'>[];
} & PublicPaginationData;

const getMembershipsFlow = async (req: Request, res: Response) => {
  try {
    const { project } = req;
    const { order, dbQuery, ...paginationData } = await getMembershipsValidation({
      query: req.query,
      project,
    });

    const { pageOffset, ...publicPaginationData } = paginationData;

    const memberships = await project.getMemberships({
      where: dbQuery.where,
      limit: publicPaginationData.itemsPerPage,
      offset: pageOffset,
      order,
      include: dbQuery.include,
    });

    const responseBody: GetMembershipResponseBody = {
      project: {
        id: project.id,
        name: project.name,
      },
      memberships: memberships.map((membership) => ({
        ...getMembershipData(Object.assign(membership, { project })),
        project: undefined,
        updatedOn: membership.updatedOn || null,
        updatedBy:
          membership.updatedById &&
          membership.updatedBy &&
          getPublicUserData(membership.updatedBy),
      })),
      ...publicPaginationData,
    };

    return res.success('membership list has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getMembershipsFlow;
