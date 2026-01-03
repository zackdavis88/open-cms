import { Sequelize } from 'sequelize';
import { User, initializeUser } from './user';
import { Project, initializeProject } from './project';
import { Membership, initializeMembership } from './membership';
import { Blueprint, BlueprintVersion, initializeBlueprint } from './blueprint';
import { Component, ComponentVersion, initializeComponent } from './component';
import { Layout, LayoutComponent, initializeLayout } from './layout';
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
  initializeComponent(sequelize);
  initializeLayout(sequelize);

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

  // Component -> Project associations: components
  Project.hasMany(Component, {
    as: 'components',
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
  });
  Project.hasOne(Component, {
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
  });
  Component.belongsTo(Project, {
    as: 'project',
  });

  // Component -> Blueprint associations: components
  Blueprint.hasMany(Component, {
    as: 'components',
    foreignKey: 'blueprintId',
    onDelete: 'CASCADE',
  });
  Blueprint.hasOne(Component, {
    foreignKey: 'blueprintId',
    onDelete: 'CASCADE',
  });
  Component.belongsTo(Blueprint, {
    as: 'blueprint',
  });

  BlueprintVersion.hasMany(Component, {
    as: 'components',
    foreignKey: 'blueprintVersionId',
    onDelete: 'CASCADE',
  });
  Component.belongsTo(BlueprintVersion, { as: 'blueprintVersion' });

  // Component -> User associations: createdBy
  User.hasMany(Component, { as: 'createdComponents', foreignKey: 'createdById' });
  User.hasOne(Component, { as: 'createdComponent', foreignKey: 'createdById' });
  Component.belongsTo(User, { as: 'createdBy' });

  // Component -> User associations: updatedBy
  User.hasMany(Component, { as: 'updatedComponents', foreignKey: 'updatedById' });
  User.hasOne(Component, { as: 'updatedComponent', foreignKey: 'updatedById' });
  Component.belongsTo(User, { as: 'updatedBy' });

  // Component -> User associations: deletedBy
  User.hasMany(Component, { as: 'deletedComponents', foreignKey: 'deletedById' });
  User.hasOne(Component, { as: 'deletedComponent', foreignKey: 'deletedById' });
  Component.belongsTo(User, { as: 'deletedBy' });

  // ComponentVersion -> Component associations: versions
  Component.hasMany(ComponentVersion, {
    as: 'versions',
    foreignKey: 'componentId',
    onDelete: 'CASCADE',
  });
  ComponentVersion.belongsTo(Component, { as: 'component' });

  // ComponentVersion -> User associations: createdBy
  User.hasMany(ComponentVersion, {
    as: 'createdComponentVersions',
    foreignKey: 'createdById',
  });
  User.hasOne(ComponentVersion, {
    as: 'createdComponentVersion',
    foreignKey: 'createdById',
  });
  ComponentVersion.belongsTo(User, { as: 'createdBy' });

  // Layout -> Project associations: layouts
  Project.hasMany(Layout, {
    as: 'layouts',
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
  });
  Project.hasOne(Layout, {
    foreignKey: 'projectId',
    onDelete: 'CASCADE',
  });
  Layout.belongsTo(Project, {
    as: 'project',
  });

  // Layout -> User associations: createdBy
  User.hasMany(Layout, { as: 'createdLayouts', foreignKey: 'createdById' });
  User.hasOne(Layout, { as: 'createdLayout', foreignKey: 'createdById' });
  Layout.belongsTo(User, { as: 'createdBy' });

  // Layout -> User associations: updatedBy
  User.hasMany(Layout, { as: 'updatedLayouts', foreignKey: 'updatedById' });
  User.hasOne(Layout, { as: 'updatedLayout', foreignKey: 'updatedById' });
  Layout.belongsTo(User, { as: 'updatedBy' });

  // Layout -> User associations: deletedBy
  User.hasMany(Layout, { as: 'deletedLayouts', foreignKey: 'deletedById' });
  User.hasOne(Layout, { as: 'deletedLayout', foreignKey: 'deletedById' });
  Layout.belongsTo(User, { as: 'deletedBy' });

  // Layout -> LayoutComponent: layoutComponents
  Layout.hasMany(LayoutComponent, {
    as: 'layoutComponents',
    foreignKey: 'layoutId',
    onDelete: 'CASCADE',
  });
  Layout.hasOne(LayoutComponent, { as: 'layoutComponent', foreignKey: 'layoutId' });
  LayoutComponent.belongsTo(Layout, { as: 'layout' });

  Component.hasMany(LayoutComponent, {
    as: 'component',
    foreignKey: 'componentId',
    onDelete: 'CASCADE',
  });
  LayoutComponent.belongsTo(Component, { as: 'component' });
};

export const initializeModelsAndSync = async (sequelize: Sequelize) => {
  initializeModels(sequelize);
  await synchronizeTables(sequelize);
};

export { User } from './user';
export { Project } from './project';
export { Membership } from './membership';
export { Blueprint, BlueprintVersion } from './blueprint';
export { Component } from './component';
export { Layout, LayoutComponent } from './layout';
