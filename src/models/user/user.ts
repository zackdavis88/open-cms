import bcrypt from 'bcryptjs';
import {
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasOneGetAssociationMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import Project from 'src/models/project/project';
import Membership from 'src/models/membership/membership';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare isActive: CreationOptional<boolean>;
  declare username: string;
  declare displayName: string;
  declare hash: string;
  declare apiKey: CreationOptional<string>;
  declare createdOn: CreationOptional<Date>;
  declare updatedOn: CreationOptional<Date | null>;
  declare deletedOn: CreationOptional<Date | null>;

  // Project associations - HasMany
  declare getCreatedProjects: HasManyGetAssociationsMixin<Project>;
  declare countCreatedProjects: HasManyCountAssociationsMixin;
  declare getUpdatedProjects: HasManyGetAssociationsMixin<Project>;
  declare countUpdatedProjects: HasManyCountAssociationsMixin;
  declare getDeletedProjects: HasManyGetAssociationsMixin<Project>;
  declare countDeletedProjects: HasManyCountAssociationsMixin;
  declare createProject: HasManyCreateAssociationMixin<Project>;

  // Project associations - HasOne
  declare getCreatedProject: HasOneGetAssociationMixin<Project>;
  declare getUpdatedProject: HasOneGetAssociationMixin<Project>;
  declare getDeletedProject: HasOneGetAssociationMixin<Project>;

  // Membership associations - HasMany
  declare getCreatedMemberships: HasManyGetAssociationsMixin<Membership>;
  declare countCreatedMemberships: HasManyCountAssociationsMixin;
  declare getUpdatedMemberships: HasManyGetAssociationsMixin<Membership>;
  declare countUpdatedMemberships: HasManyCountAssociationsMixin;
  declare getMemberships: HasManyGetAssociationsMixin<Membership>;
  declare countMemberships: HasManyCountAssociationsMixin;

  // Membership associations - HasOne
  declare getCreatedMembership: HasOneGetAssociationMixin<Membership>;
  declare getUpdatedMembership: HasOneGetAssociationMixin<Membership>;
  declare getMembership: HasOneGetAssociationMixin<Membership>;

  static generateHash(password: string): NonAttribute<string> {
    let saltRounds: number | undefined;
    if (process.env.SALT_ROUNDS && !isNaN(Number(process.env.SALT_ROUNDS))) {
      saltRounds = Number(process.env.SALT_ROUNDS);
    }

    return bcrypt.hashSync(password, saltRounds);
  }

  compareHash(password: string): NonAttribute<boolean> {
    return bcrypt.compareSync(password, this.hash);
  }
}

export const initializeUser = (sequelize: Sequelize) => {
  User.init(
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
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      displayName: {
        type: DataTypes.STRING,
      },
      hash: {
        type: DataTypes.STRING,
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
      tableName: 'users',
      timestamps: false,
      scopes: {
        publicAttributes: {
          attributes: {
            exclude: ['id', 'hash', 'apiKey', 'updatedOn', 'deletedOn'],
          },
        },
      },
    },
  );
};

export default User;
