// tenant/api/app/role_permission/name_list?role_id
// .map(x => { return [x.toLocaleUpperCase().replaceAll('-','_'), x ]})
// Object.fromEntries(a)
export enum Permission {
  // 知识库相关权限
  PRIVATE_DATASET_MENU_BUTTON_VISIBLE = "private-dataset_menu-button_visible",
  CONVERSATION_LOG_MENU_BUTTON_VISIBLE = "conversation-log_menu-button_visible",
  LOGIN_LOG_MENU_BUTTON_VISIBLE = "login-log_menu-button_visible",
  AUTH_LOG_MENU_BUTTON_VISIBLE = "auth-log_menu-button_visible",
  STAT_MENU_BUTTON_VISIBLE = "stat_menu-button_visible",
  OP_MENU_BUTTON_VISIBLE = "op_menu-button_visible",
  // 编辑公共知识库的权限
  PUBLIC_DDATASET_MENU_EDIT_OPERABLE = "public-ddataset_menu-edit_operable",
  // 团队相关权限
  MEMBER_MANAGEMENT_DROPDOWN_ROLE_SETTING_BUTTON_VISIBLE = "member-management_dropdown-role-setting-button_visible",
}
export const hasPermission = (permissions: string[], isHas: string) => {
  // if (import.meta.env.MODE !== "production") {
  //   return true;
  // }
  return Boolean(permissions.find((p) => p === isHas));
};
