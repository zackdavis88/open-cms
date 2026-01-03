import { BlueprintVersion, type BlueprintField } from 'src/models/blueprint/blueprint';

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

export interface BlueprintData {
  id: string;
  project: Pick<ProjectData, 'id' | 'name'>;
  name: string;
  fields: BlueprintField[];
  createdOn: Date;
  createdBy: UserData | null;
  updatedOn?: Date | null;
  updatedBy?: UserData | null;
  deletedOn?: Date | null;
  deletedBy?: UserData | null;
}

export interface ComponentData {
  id: string;
  project: Pick<ProjectData, 'id' | 'name'>;
  blueprint: Pick<BlueprintData, 'id' | 'name'>;
  blueprintVersion?: {
    id: BlueprintVersion['id'];
    name: BlueprintVersion['name'];
  } | null;
  name: string;
  content: Record<string, unknown>;
  createdOn: Date;
  createdBy: UserData | null;
  updatedOn?: Date | null;
  updatedBy?: UserData | null;
  deletedOn?: Date | null;
  deletedBy?: UserData | null;
}

export interface LayoutData {
  id: string;
  project: Pick<ProjectData, 'id' | 'name'>;
  name: string;
  layoutComponents: {
    id: ComponentData['id'];
    name: ComponentData['name'];
    content: ComponentData['content'];
  }[];
  createdOn: Date;
  createdBy: UserData | null;
  updatedOn?: Date | null;
  updatedBy?: UserData | null;
  deletedOn?: Date | null;
  deletedBy?: UserData | null;
}

export enum AuthorizationAction {
  CREATE,
  READ,
  UPDATE,
  DELETE,
}

export { type AllPaginationData } from 'src/controllers/utils/validatePagination';
export { type PublicPaginationData } from 'src/controllers/utils/validatePagination';
export { type BlueprintField };
export {
  type StringBlueprintField,
  type BooleanBlueprintField,
  type DateBlueprintField,
  type ObjectBlueprintField,
  type ArrayBlueprintField,
  type NumberBlueprintField,
  BlueprintFieldTypeValues,
} from 'src/models/blueprint/blueprint';
