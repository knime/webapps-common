export const MasonCapabilities = Object.freeze({
  create: "knime:create",
  edit: "edit",
  update: "knime:update",
  delete: "knime:delete",
  move: "knime:move",
  copy: "knime:copy",
  rename: "knime:rename",
  upload: "knime:upload",
  uploadAvatar: "knime:upload-avatar",
  asyncUpload: "knime:initiate-upload",
  changePermission: "knime:change-permissions",
  createNewExecutionContext: "knime:new-execution-context",
  modifyTeamAccount: "knime:modify-team-account",
  addUser: "knime:add-user",
  removeUser: "knime:remove-user",
  getLogs: "knime:logs",
  viewJob: "knime:new-view-session",
  login: "knime:login",
  viewTrash: "knime:list-trash",
  clearTrash: "knime:clear-trash",
  restoreTrashItem: "knime:restore-trash-item",
  deleteTrashItem: "knime:delete-trash-item",
});

const has = (haystack: object, needle: string) => needle in haystack;

export type MasonCapabilityKey = keyof typeof MasonCapabilities;

export const hasCreateCapability = (masonControls: object) =>
  has(masonControls, MasonCapabilities.create);

export const hasEditCapability = (masonControls: object) =>
  has(masonControls, MasonCapabilities.edit) ||
  has(masonControls, MasonCapabilities.update);

export const hasUploadCapability = (masonControls: object) =>
  has(masonControls, MasonCapabilities.upload);

export const hasAsyncUploadCapability = (masonControls: object) =>
  has(masonControls, MasonCapabilities.asyncUpload);

export const hasDeleteCapability = (masonControls: object) =>
  has(masonControls, MasonCapabilities.delete);

export const hasRenameCapability = (masonControls: object) =>
  has(masonControls, MasonCapabilities.rename);

export const hasMoveCapability = (masonControls: object) =>
  has(masonControls, MasonCapabilities.move);

export const hasCopyCapability = (masonControls: object) =>
  has(masonControls, MasonCapabilities.copy);
// export const hasUploadAvatarCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.uploadAvatar);
// export const hasChangePermissionCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.changePermission);
// export const hasCreateNewExecutionContextCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.createNewExecutionContext);

// export const hasModifyTeamAccountCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.modifyTeamAccount);

// export const hasManageMembersCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.addUser) ||
//   has(masonControls, MasonCapabilities.removeUser);

// export const hasGetLogsCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.getLogs);

// export const hasViewJobCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.viewJob);

// export const hasLoginCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.login);

// export const getLoginCapabilityLink = (masonControls): string | null =>
//   masonControls?.[MasonCapabilities.login]?.href ?? null;

// export const hasViewTrashCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.viewTrash);

// export const hasClearTrashCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.clearTrash);

// export const hasRestoreTrashItemCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.restoreTrashItem);

// export const hasDeleteTrashItemCapability = (masonControls) =>
//   has(masonControls, MasonCapabilities.deleteTrashItem);
