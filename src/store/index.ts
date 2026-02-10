import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();

// 使用持久化插件
pinia.use(piniaPluginPersistedstate);

export default pinia;

// 重新导出所有 store
export * from './user';
export * from './team';
export * from './public';
export * from './workspace';
