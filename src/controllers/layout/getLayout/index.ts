import { Request, Response, NextFunction } from 'express';
import { LayoutData } from 'src/types';
import { getLayoutData, getPublicUserData } from 'src/controllers/utils';
import getLayoutValidation from './getLayoutValidation';
import { NotFoundError } from 'src/server/utils/errors';
import { User, LayoutComponent, Component } from 'src/models';

export const getLayoutMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { project } = req;
    getLayoutValidation(req.params.layoutId);
    const layout = await project.getLayout({
      where: { id: req.params.layoutId, isActive: true },
      include: [
        { model: User.scope('publicAttributes'), as: 'createdBy' },
        { model: User.scope('publicAttributes'), as: 'updatedBy' },
        {
          model: LayoutComponent,
          as: 'layoutComponents',
          include: [{ model: Component, as: 'component' }],
        },
      ],
      order: [['layoutComponents', 'order', 'ASC']],
    });

    if (!layout) {
      throw new NotFoundError('requested layout not found');
    }

    req.layout = layout;
    next();
  } catch (error) {
    return res.sendError(error);
  }
};

type GetLayoutResponseBody = {
  layout: LayoutData;
};

const getLayoutFlow = async (req: Request, res: Response) => {
  try {
    const { project, layout } = req;
    const responseBody: GetLayoutResponseBody = {
      layout: {
        ...getLayoutData(Object.assign(layout, { project })),
        updatedOn: layout.updatedOn || null,
        updatedBy:
          (layout.updatedById &&
            layout.updatedBy &&
            getPublicUserData(layout.updatedBy)) ||
          null,
      },
    };
    return res.success('layout has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getLayoutFlow;
