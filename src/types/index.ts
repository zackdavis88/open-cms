export interface UserData {
  username: string;
  displayName: string;
  createdOn: Date;
  updatedOn?: Date | null;
  deletedOn?: Date | null;
}

export { type AllPaginationData } from 'src/controllers/utils/validatePagination';
export { type PublicPaginationData } from 'src/controllers/utils/validatePagination';
