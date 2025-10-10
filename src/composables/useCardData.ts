import { ref } from 'vue';
import { View, UserFilled, Document } from '@element-plus/icons-vue';

// 定义卡片数据类型接口
export interface StatCard {
  title: string;
  value: string | number;
  icon: any;
  iconClass: string;
  trend: number;
}

export function useCardData() {
  //模拟数据
  const cardData = ref<StatCard[]>([
    {
      title: '访问次数',
      value: '128,930',
      icon: View,
      trend: 12.5,
      iconClass: 'icon-blue'
    },
    {
      title: '访问人数',
      value: '45,281',
      icon: UserFilled,
      iconClass: 'icon-purple',
      trend: 8.2
    },
    {
      title: '文档总数',
      value: '3,829',
      icon: Document,
      iconClass: 'icon-green',
      trend: 8.3
    },
    {
      title: '活跃用户',
      value: '5,237',
      icon: UserFilled,
      trend: 6.8,
      iconClass: 'icon-red'
    }
  ]);

  //返回数据
  return { cardData };
}