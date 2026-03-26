import { Request, Response } from 'express';
import getImagesValidation from './getImagesValidation';
import { Project } from 'src/models';
import { ImageData, PublicPaginationData } from 'src/types';
import { getImageData } from 'src/controllers/utils';
import { getImageUrl } from 'src/controllers/image/utils';

type GetImagesResponseBody = {
  project: { id: Project['id']; name: Project['name'] };
  images: Omit<ImageData, 'project'>[];
} & PublicPaginationData;

const getImagesFlow = async (req: Request, res: Response) => {
  try {
    const { project, host, protocol } = req;
    const { order, dbQuery, ...paginationData } = await getImagesValidation({
      query: req.query,
      project,
    });

    const { pageOffset, ...publicPaginationData } = paginationData;

    const images = await project.getImages({
      where: dbQuery.where,
      limit: publicPaginationData.itemsPerPage,
      offset: pageOffset,
      order,
      include: dbQuery.include,
    });

    const responseBody: GetImagesResponseBody = {
      project: {
        id: project.id,
        name: project.name,
      },
      images: images.map((image) => ({
        ...getImageData(
          Object.assign(image, {
            project,
            url: getImageUrl({ host, image, project, protocol }),
          }),
        ),
        project: undefined,
      })),
      ...publicPaginationData,
    };

    return res.success('image list has been successfully retrieved', responseBody);
  } catch (error) {
    return res.sendError(error);
  }
};

export default getImagesFlow;
