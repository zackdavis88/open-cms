export interface UserData {
  username: string;
  displayName: string;
  createdOn: Date;
  updatedOn?: Date | null;
  deletedOn?: Date | null;
}

export { type PaginationData } from 'src/controllers/utils/validatePagination';
export { type OrderData } from 'src/controllers/utils/validateOrder';
