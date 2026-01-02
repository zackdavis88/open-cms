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
import Blueprint, { BlueprintVersion } from 'src/models/blueprint/blueprint';
import Project from 'src/models/project/project';

export class ComponentVersion extends Model<
  InferAttributes<ComponentVersion>,
  InferCreationAttributes<ComponentVersion>
> {
  declare id: CreationOptional<string>;
  declare componentId: ForeignKey<Component['id']>;
  declare name: string;
  declare content: Record<string, unknown>;
  declare createdById: ForeignKey<User['id']>;
  declare createdBy: NonAttribute<User>;
  declare createdOn: CreationOptional<Date>;
}

class Component extends Model<
  InferAttributes<Component>,
  InferCreationAttributes<Component>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare content: Record<string, unknown>;
  declare isActive: CreationOptional<boolean>;

  declare blueprint: NonAttribute<Blueprint>;
  declare blueprintId: ForeignKey<Blueprint['id']>;

  declare blueprintVersion: NonAttribute<BlueprintVersion | null>;
  declare blueprintVersionId: ForeignKey<BlueprintVersion['id']> | null;

  declare project: NonAttribute<Project>;
  declare projectId: ForeignKey<Project['id']>;

  declare createdById: ForeignKey<User['id']>;
  declare createdBy: NonAttribute<User>;
  declare createdOn: CreationOptional<Date>;

  declare updatedById: ForeignKey<User['id']> | null;
  declare updatedBy: NonAttribute<User> | null;
  declare updatedOn: CreationOptional<Date> | null;

  declare deletedById: ForeignKey<User['id']> | null;
  declare deletedBy: NonAttribute<User> | null;
  declare deletedOn: CreationOptional<Date> | null;

  declare createVersion: HasManyCreateAssociationMixin<ComponentVersion>;
  declare getVersions: HasManyGetAssociationsMixin<ComponentVersion>;
}

export const initializeComponent = (sequelize: Sequelize) => {
  Component.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.JSON,
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
    { sequelize, tableName: 'components', timestamps: false },
  );

  ComponentVersion.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.JSON,
      },
      createdOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { sequelize, tableName: 'component_versions', timestamps: false },
  );
};

export default Component;
