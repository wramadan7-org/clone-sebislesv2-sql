const httpStatus = require('http-status');
const { Op } = require('sequelize');
const { Role } = require('../models/Role');
const ApiError = require('../utils/ApiError');

/**
 * Create new role
 * @param {Object} roleBody
 * @return {Promise<void | Role>}
 */
const createRole = async (roleBody) => Role.create(roleBody);

/**
 * Get role by ID
 * @param {string} roleId
 * @return {Promise<ApiError | Role>}
 */
const getRoleById = async (roleId) => {
  const role = await Role.findByPk(roleId);
  if (!role) throw new ApiError(httpStatus.NOT_FOUND, 'Role not found.');
  return role;
};
const getRoleByRoleName = async (roleName) => {
  const role = await Role.findOne({
    where: {
      roleName,
    },
  });
  if (!role) throw new ApiError(httpStatus.NOT_FOUND, 'Role not found.');
  return role;
};

/**
 * Update role by ID
 * @param {string} roleId
 * @param {Object} roleBody
 * @return {Promise<ApiError|Role>}
 */
const updateRoleById = async (roleId, roleBody) => {
  const role = await getRoleById(roleId);

  Object.assign(role, roleBody);
  await role.save();

  return role;
};

/**
 * Delete role by ID
 * @param {string} roleId
 * @return {Promise<ApiError|Role>}
 */
const deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);

  await role.destroy();

  return role;
};

const getRoleByName = async (roleName) => {
  const role = await Role.findOne({
    where: {
      roleName: {
        [Op.like]: roleName,
      },
    },
  });

  return role;
};

module.exports = {
  createRole,
  getRoleById,
  updateRoleById,
  deleteRoleById,
  getRoleByName,
  getRoleByRoleName,
};
