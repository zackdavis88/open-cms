import {
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  NonAttribute,
  BelongsToGetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasOneGetAssociationMixin,
} from 'sequelize';
import User from 'src/models/user/user';
import Membership from 'src/models/membership/membership';
import Blueprint from 'src/models/blueprint/blueprint';

class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  declare id: CreationOptional<string>;
  declare isActive: CreationOptional<boolean>;
  declare name: string;
  declare description: CreationOptional<string | null>;
  declare apiKey: CreationOptional<string>;

  // User associations - BelongsTo
  declare getCreatedBy: BelongsToGetAssociationMixin<User>;
  declare createdById: ForeignKey<User['id'] | null>;
  declare createdBy: NonAttribute<User | null>;
  declare createdOn: CreationOptional<Date>;

  declare getUpdatedBy: BelongsToGetAssociationMixin<User>;
  declare updatedById: ForeignKey<User['id'] | null>;
  declare updatedBy: NonAttribute<User | null>;
  declare updatedOn: CreationOptional<Date | null>;

  declare getDeletedBy: BelongsToGetAssociationMixin<User>;
  declare deletedById: ForeignKey<User['id'] | null>;
  declare deletedBy: NonAttribute<User | null>;
  declare deletedOn: CreationOptional<Date | null>;

  // Membership associations - HasMany
  declare createMembership: HasManyCreateAssociationMixin<Membership>;
  declare getMemberships: HasManyGetAssociationsMixin<Membership>;
  declare countMemberships: HasManyCountAssociationsMixin;

  // Membership associations - HasOne
  declare getMembership: HasOneGetAssociationMixin<Membership | null>;
  declare authUserMembership: NonAttribute<Membership | null>;

  // Blueprint associations - HasMany
  declare createBlueprint: HasManyCreateAssociationMixin<Blueprint>;
  declare getBlueprints: HasManyGetAssociationsMixin<Blueprint>;
  declare countBlueprints: HasManyCountAssociationsMixin;
}

export const initializeProject = (sequelize: Sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      apiKey: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    {
      sequelize,
      tableName: 'projects',
      timestamps: false,
    },
  );
};

export default Project;
