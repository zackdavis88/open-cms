export interface UserData {
  username: string;
  displayName: string;
  createdOn: Date;
  updatedOn?: Date | null;
  deletedOn?: Date | null;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string | null;
  createdOn: Date;
  createdBy: UserData | null;
  updatedOn?: Date | null;
  updatedBy?: UserData | null;
  deletedOn?: Date | null;
  deletedBy?: UserData | null;
}

export interface MembershipData {
  id: string;
  user: UserData;
  project: Pick<ProjectData, 'id' | 'name'>;
  createdOn: Date;
  createdBy: UserData | null;
  updatedOn?: Date | null;
  updatedBy?: UserData | null;
  isAdmin: boolean;
  isWriter: boolean;
}

export { type AllPaginationData } from 'src/controllers/utils/validatePagination';
export { type PublicPaginationData } from 'src/controllers/utils/validatePagination';
