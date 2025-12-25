import {
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  NonAttribute,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import User from 'src/models/user/user';
import Project from 'src/models/project/project';

interface BaseBlueprintField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  isRequired?: boolean;
}

type BlueprintField =
  | StringBlueprintField
  | NumberBlueprintField
  | BooleanBlueprintField
  | DateBlueprintField
  | ArrayBlueprintField
  | ObjectBlueprintField;

interface StringBlueprintField extends BaseBlueprintField {
  type: 'string';
  regex?: string;
  minLength?: number;
  maxLength?: number;
}

interface NumberBlueprintField extends BaseBlueprintField {
  type: 'number';
  min?: number;
  max?: number;
  isInteger?: boolean;
}

interface BooleanBlueprintField extends BaseBlueprintField {
  type: 'boolean';
}

interface DateBlueprintField extends BaseBlueprintField {
  type: 'date';
}

interface ArrayBlueprintField extends BaseBlueprintField {
  type: 'array';
  arrayOf: BlueprintField;
}

interface ObjectBlueprintField extends BaseBlueprintField {
  type: 'object';
  fields: BlueprintField[];
}

export class BlueprintVersion extends Model<
  InferAttributes<BlueprintVersion>,
  InferCreationAttributes<BlueprintVersion>
> {
  declare id: CreationOptional<string>;
  declare blueprintId: ForeignKey<Blueprint['id']>;
  declare name: string;
  declare fields: BlueprintField[];
  declare createdById: ForeignKey<User['id']>;
  declare createdBy: NonAttribute<User>;
  declare createdOn: CreationOptional<Date>;
}

class Blueprint extends Model<
  InferAttributes<Blueprint>,
  InferCreationAttributes<Blueprint>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare isActive: CreationOptional<boolean>;

  declare projectId: ForeignKey<Project['id']>;
  declare project: NonAttribute<Project>;

  declare createdById: ForeignKey<User['id']>;
  declare createdBy: NonAttribute<User>;
  declare createdOn: CreationOptional<Date>;

  declare updatedById: ForeignKey<User['id']> | null;
  declare updatedBy: NonAttribute<User> | null;
  declare updatedOn: CreationOptional<Date> | null;

  declare deletedById: ForeignKey<User['id']> | null;
  declare deletedBy: NonAttribute<User> | null;
  declare deletedOn: CreationOptional<Date> | null;

  declare blueprintVersionId: ForeignKey<BlueprintVersion['id']>;
  declare version: NonAttribute<BlueprintVersion>;
  declare createVersion: HasManyCreateAssociationMixin<BlueprintVersion>;
  declare getVersions: HasManyGetAssociationsMixin<BlueprintVersion>;
}

export const initializeBlueprint = (sequelize: Sequelize) => {
  Blueprint.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedOn: {
        type: DataTypes.DATE,
      },
      deletedOn: {
        type: DataTypes.DATE,
      },
    },
    { sequelize, tableName: 'blueprints', timestamps: false },
  );

  BlueprintVersion.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      fields: {
        type: DataTypes.JSON,
      },
      createdOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { sequelize, tableName: 'blueprint_versions', timestamps: false },
  );
};

export default Blueprint;
