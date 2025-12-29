import { Sequelize } from 'sequelize';
import { User, initializeUser } from './user';
import { Project, initializeProject } from './project';
import { Membership, initializeMembership } from './membership';
import { Blueprint, BlueprintVersion, initializeBlueprint } from './blueprint';

const synchronizeTables = async (sequelize: Sequelize) => {
  try {
    await sequelize.sync();
  } catch (error) {
    console.error('Error synchronizing models');
    console.error(error);
    throw error;
  }
};

export const initializeModels = (sequelize: Sequelize) => {
  initializeUser(sequelize);
  initializeProject(sequelize);
  initializeMembership(sequelize);
  initializeBlueprint(sequelize);

  /*  Sequelize is weird. These associations need to be done outside of the model files
   *  and after model initialization because of our code structure.
   */

  // Project -> User associations: createdBy
  User.hasMany(Project, { as: 'createdProjects', foreignKey: 'createdById' });
  User.hasMany(Project, { as: 'projects', foreignKey: 'createdById' });
  User.hasOne(Project, { as: 'createdProject', foreignKey: 'createdById' });
  Project.belongsTo(User, { as: 'createdBy' });

  // Project -> User associations: updatedBy
  User.hasMany(Project, { as: 'updatedProjects', foreignKey: 'updatedById' });
  User.hasOne(Project, { as: 'updatedProject', foreignKey: 'updatedById' });
  Project.belongsTo(User, { as: 'updatedBy' });

  // Project -> User associations: deletedBy
  User.hasMany(Project, { as: 'deletedProjects', foreignKey: 'deletedById' });
  User.hasOne(Project, { as: 'deletedProject', foreignKey: 'deletedById' });
  Project.belongsTo(User, { as: 'deletedBy' });

  // Membership -> User associations: createdBy
  User.hasMany(Membership, { as: 'createdMemberships', foreignKey: 'createdById' });
  User.hasOne(Membership, { as: 'createdMembership', foreignKey: 'createdById' });
  Membership.belongsTo(User, { as: 'createdBy' });

  // Membership -> User associations: updatedBy
  User.hasMany(Membership, { as: 'updatedMemberships', foreignKey: 'updatedById' });
  User.hasOne(Membership, { as: 'updatedMembership', foreignKey: 'updatedById' });
  Membership.belongsTo(User, { as: 'updatedBy' });

  // Membership -> User associations: memberships
  User.hasMany(Membership, {
    as: 'memberships',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
  User.hasOne(Membership, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
  Membership.belongsTo(User, {
    as: 'user',
  });

  // Membership -> Project associations: memberships
  Project.hasMany(Membership, {
    as: 'memberships',
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
  });
  Project.hasOne(Membership, {
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
  });
  Project.hasOne(Membership, {
    as: 'authUserMembership',
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
  });
  Membership.belongsTo(Project, {
    as: 'project',
  });

  // Blueprint -> Project associations: blueprints
  Project.hasMany(Blueprint, {
    as: 'blueprints',
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
  });
  Project.hasOne(Blueprint, {
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
  });
  Blueprint.belongsTo(Project, {
    as: 'project',
  });

  // Blueprint -> User associations: createdBy
  User.hasMany(Blueprint, { as: 'createdBlueprints', foreignKey: 'createdById' });
  User.hasOne(Blueprint, { as: 'createdBlueprint', foreignKey: 'createdById' });
  Blueprint.belongsTo(User, { as: 'createdBy' });

  // Blueprint -> User associations: updatedBy
  User.hasMany(Blueprint, { as: 'updatedBlueprints', foreignKey: 'updatedById' });
  User.hasOne(Blueprint, { as: 'updatedBlueprint', foreignKey: 'updatedById' });
  Blueprint.belongsTo(User, { as: 'updatedBy' });

  // Blueprint -> User associations: deletedBy
  User.hasMany(Blueprint, { as: 'deletedBlueprints', foreignKey: 'deletedById' });
  User.hasOne(Blueprint, { as: 'deletedBlueprint', foreignKey: 'deletedById' });
  Blueprint.belongsTo(User, { as: 'deletedBy' });

  // BlueprintVersion -> Blueprint associations: versions
  Blueprint.hasMany(BlueprintVersion, {
    as: 'versions',
    foreignKey: 'blueprintId',
    onDelete: 'CASCADE',
  });
  BlueprintVersion.belongsTo(Blueprint, { as: 'blueprint' });

  // BlueprintVersion -> User associations: createdBy
  User.hasMany(BlueprintVersion, {
    as: 'createdBlueprintVersions',
    foreignKey: 'createdById',
  });
  User.hasOne(BlueprintVersion, {
    as: 'createdBlueprintVersion',
    foreignKey: 'createdById',
  });
  BlueprintVersion.belongsTo(User, { as: 'createdBy' });
};

export const initializeModelsAndSync = async (sequelize: Sequelize) => {
  initializeModels(sequelize);
  await synchronizeTables(sequelize);
};

export { User } from './user';
export { Project } from './project';
export { Membership } from './membership';
export { Blueprint, BlueprintVersion } from './blueprint';
