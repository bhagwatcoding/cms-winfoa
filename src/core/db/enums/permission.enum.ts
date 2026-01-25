/**
 * Permission Enums
 * Numeric values for efficient DB storage
 */

export const enum PermissionAction {
  CREATE = 1,
  READ = 2,
  UPDATE = 3,
  DELETE = 4,
  MANAGE = 5,
  EXECUTE = 6,
  APPROVE = 7,
  REJECT = 8,
}

export const PermissionActionLabel: Record<PermissionAction, string> = {
  [PermissionAction.CREATE]: 'Create',
  [PermissionAction.READ]: 'Read',
  [PermissionAction.UPDATE]: 'Update',
  [PermissionAction.DELETE]: 'Delete',
  [PermissionAction.MANAGE]: 'Manage',
  [PermissionAction.EXECUTE]: 'Execute',
  [PermissionAction.APPROVE]: 'Approve',
  [PermissionAction.REJECT]: 'Reject',
};
