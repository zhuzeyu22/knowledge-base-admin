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
}
export const hasPermission = (permissions: string[], isHas: string) => {
  if (import.meta.env.MODE !== "production") {
    return true;
  }
  return Boolean(permissions.find((p) => p === isHas));
};
