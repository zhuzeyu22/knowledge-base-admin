import { Router, RouteLocationNormalized } from 'vue-router';
import { getQueryParam } from '@/utils/params';
import { accessUnitlogin } from '@/utils/auth';
import { postSwitchWorkspace } from '@/service/team';
import { useTeamStore } from '@/store/team';

// 处理 SSO 登录回调
export const handleSSOCallback = async (to: RouteLocationNormalized): Promise<boolean> => {
  const code = getQueryParam('code');
  if (code) {
    await accessUnitlogin({ code });
    const cleanUrl =
      window.location.origin + window.location.pathname + window.location.hash;
    window.location.replace(cleanUrl);
    return false;
  }
  return true;
};

// 处理团队切换
export const handleTeamSwitch = async (to: RouteLocationNormalized): Promise<void> => {
  if (to.meta.requiresSwitch && to.params.teamId) {
    const teamId = String(to.params.teamId);
    try {
      await postSwitchWorkspace(teamId);
      const teamStore = useTeamStore();
      await teamStore.updateCurrentTeamById(teamId);
    } catch (error) {
      console.error('切换团队失败:', error);
      throw error;
    }
  }
};

// 注册路由守卫
export const setupRouterGuards = (router: Router): void => {
  router.beforeEach(async (to, from, next) => {
    try {
      // 处理 SSO 回调
      const canContinue = await handleSSOCallback(to);
      if (!canContinue) return;

      // 处理团队切换
      await handleTeamSwitch(to);

      next();
    } catch (error) {
      console.error('路由守卫错误:', error);
      next();
    }
  });
};
