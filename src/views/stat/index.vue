<template>
    <div class="stat-page" v-loading="loading" element-loading-text="加载数据中...">
        <el-container class="container">
            <!-- 整体下方数据部分 -->
            <el-main class="page-main">
              <div class="title">数据统计</div>
                <!-- 数据count卡片容器 -->
                <div class="data-cards">
                  <div v-for="(card, index) in cardData" :key="index" class="card-x" :class="{ 'not-last': index < cardData.length - 1 }">
                    <!-- 卡片内容 -->
                    <div class="card-content">
                      <!-- 左侧图标 -->
                      <div class="card-left">
                        <img :src="card.iconSrc" class="icon" alt="icon" />
                      </div>
                      <!-- 右侧信息 -->
                      <div class="card-right">
                        <div class="card-title">{{ card.title }}</div>
                        <div class="card-value">{{ card.value }}</div>
                        <div class="card-trend">
                          <span class="trend-text">较上周</span>
                          <span class="trend-value" :class="[card.trend > 0 ? 'positive' : 'negative']"> {{ Math.abs(card.trend) }}%</span>
                          <span >
                              <img v-if="card.trend > 0" src="/src/assets/up.png" class="trend-icon" alt="up" />
                              <img v-if="card.trend < 0" src="/src/assets/down.png" class="trend-icon" alt="down" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 数据可视化图表 -->
                <div class="data-charts">
                    <!-- 用户分布柱状图 -->
                    <el-card class="chart">
                        <h4 class="h4">用户分布</h4>
                        <div ref="userChart" style="width: 100%; height: 300px;"></div>
                    </el-card>
                    <!-- 访问趋势折线图 -->
                    <el-card class="chart">
                        <h4 class="h4">访问趋势</h4>
                        <!-- 日期选择-->
                        <div class="date-pick">
                            <el-date-picker class="date-picker" v-model="dateRange" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" @change="handleDateChange"/>
                        </div>
                        <div ref="trendChart" style="width: 100%; height: 350px;"></div>
                    </el-card>
                    <!-- 文档类型饼图 -->
                    <el-card class="chart">
                        <h4 class="h4">文档类型分布</h4>
                        <div ref="documentChart" style="width: 100%; height: 300px;"></div>
                    </el-card>
                    <!-- 知识库调用排名 -->
                    <el-card class="chart">
                        <h4 class="h4">知识库调用排名</h4>
                        <el-table class="table" :data="topDocsSorted" style="width: 100%" :border="false">
                            <el-table-column prop="name" label="知识文档" min-width="160" />
                            <el-table-column prop="creator" label="创建人" min-width="160" />
                            <el-table-column prop="calls" label="调用次数" min-width="100" sortable />
                        </el-table>
                    </el-card>

                </div>
            </el-main>
        </el-container>
    </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';
import { ElDatePicker, ElMessage } from 'element-plus';
import apiService, { VisitStatsParams, WeeklyData } from '../../service/api';

//卡片数据
interface StatCard {
    title: string;
    value: string | number;
    iconSrc: string;
    trend: number;
}

const convertWeeklyDataToCards = (weeklyData: WeeklyData): StatCard[] => [
  {
    title: '访问次数',
    value: (weeklyData.currentDatasetQueries || 0).toLocaleString(),
    iconSrc: '/src/assets/pv.png',
    trend: weeklyData.datasetQueriesGrowthRate || 0,
  },
  {
    title: '访问人数',
    value: (weeklyData.currentDatasetUsers || 0).toLocaleString(),
    iconSrc: '/src/assets/uv.png',
    trend: weeklyData.datasetUsersGrowthRate || 0
  },
  {
    title: '文档总数',
    value: (weeklyData.currentResources || 0).toLocaleString(),
    iconSrc: '/src/assets/doc-total.png',
    trend: weeklyData.resourcesGrowthRate || 0,
  },
  {
    title: '活跃用户',
    value: (weeklyData.currentActiveUsers || 0).toLocaleString(),
    iconSrc: '/src/assets/av.png',
    trend: weeklyData.activeUsersGrowthRate || 0,
  }
];

const getMockCardData = (): StatCard[] => [
  {
    title: '访问次数',
    value: '128,930',
    iconSrc: '/src/assets/pv.png',
    trend: 12.5,
  },
  {
    title: '访问人数',
    value: '45,281',
    iconSrc: '/src/assets/uv.png',
    trend: 8.2
  },
  {
    title: '文档总数',
    value: '3,829',
    iconSrc: '/src/assets/doc-total.png',
    trend: 8.3
  },
  {
    title: '活跃用户',
    value: '5,237',
    iconSrc: '/src/assets/av.png',
    trend: 6.8,
  }
];
const cardData = ref<StatCard[]>(getMockCardData());

//loading状态
const loading = ref<boolean>(false);

//图表
const userChart = ref<HTMLDivElement | null>(null);
const trendChart = ref<HTMLDivElement | null>(null);
const documentChart = ref<HTMLDivElement | null>(null);

//实例
var userChartInstance: ECharts | null = null;
var trendChartInstance: ECharts | null = null;
var documentChartInstance: ECharts | null = null;
let resizeTimer: number | undefined;

//日期选择相关
const dateRange = ref<[Date, Date]>([
    new Date(new Date().getTime() - 3600 * 1000 * 24 * 6),
    new Date()
]);

const getMockUserData = () => ({
    categories: ['北京银行总部', '科技部', '南京分行', '苏州分行', '南昌分行', '其他分行'],
    values: [20, 50, 25, 30, 25, 60],
});

const userChartData = ref(getMockUserData());

const getMockTrendData = (startDate: Date, endDate: Date) => {
    //计算日期范围天数
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

    //生成日期数组
    const dates = [];
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(`${date.getMonth() + 1}-${date.getDate()}`);
    }

    const visitCount = [];
    const visitorCount = [];
    const baseVisitor = 30;
    const baseVisit = 45;

    for (let i = 0; i < days; i++) {
        const visitorValue = Math.round(baseVisitor + Math.sin(i * 0.5) * 10 + (i % 3) * 3);
        visitorCount.push(visitorValue);

        const visitValue = Math.round(baseVisit + Math.sin(i * 0.5) * 15 + (i % 3) * 5);
        visitCount.push(visitValue);
    }

    return { dates, visitCount, visitorCount };
};

//默认最近7天
const defaultDateRange = computed(() => {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
    return [start, end] as [Date, Date];
});

const getMockDocumentTypeData = () => [
    { value: 335, name: 'pdf' },
    { value: 310, name: 'doc' },
    { value: 274, name: 'docx' },
    { value: 235, name: 'xlsx' },
    { value: 235, name: 'xls' },
    { value: 235, name: 'txt' },
    { value: 200, name: '其他' }
];

const documentTypeData = ref(getMockDocumentTypeData());

type TopDocRow = {
    name: string;
    creator: string;
    calls: number;
};

const getMockTopDocs = (): TopDocRow[] => [
    {
        name: '金融法规.pdf',
        creator: 'user001',
        calls: 570
    },
    {
        name: '风控指南.xlsx',
        creator: 'user001',
        calls: 468
    },
    {
        name: '客户服务手册.pdf',
        creator: 'user001',
        calls: 442
    },
    {
        name: '线上运营规范.doc',
        creator: 'user001',
        calls: 401
    },
    {
        name: '数据报表规范.xlsx',
        creator: 'user001',
        calls: 356
    },
    {
        name: '信息安全手册.pdf',
        creator: 'user001',
        calls: 318
    },
];

const topDocs = ref<TopDocRow[]>(getMockTopDocs());

const topDocsSorted = computed(() =>
    [...topDocs.value].sort((a, b) => b.calls - a.calls)
);

//加载数据
const loadAllData = async (startDate?: Date, endDate?: Date) => {
    loading.value = true;
    try {
        //确定日期范围
        const [sDate, eDate] = startDate && endDate
            ? [startDate, endDate]
            : defaultDateRange.value;

        //格式化日期为字符串
        const trendParams: VisitStatsParams = {
            startDate: sDate.toISOString().split('T')[0],
            endDate: eDate.toISOString().split('T')[0]
        };

        const [weeklyResponse, trendResponse, documentTypeResponse, rankingResponse] = await Promise.all([
            apiService.getWeeklyData(),
            apiService.getTrendData(trendParams),
            apiService.getDocumentTypeData(),
            apiService.getDocumentRankingData()
        ]);

        cardData.value = convertWeeklyDataToCards(weeklyResponse.data);

        dateRange.value = [sDate, eDate];

        documentTypeData.value = documentTypeResponse.data.map(item => ({
            value: item.count,
            name: item.type
        }));

        topDocs.value = rankingResponse.data.map(item => ({
            name: item.documentName,
            creator: item.creator,
            calls: item.callCount
        }));

        //用户分布图表目前使用模拟数据 后端暂无
        initUserChart();
        initDocumentChart();

        if (trendChart.value) {
            if (trendChartInstance) {
                (trendChartInstance as ECharts).dispose();
            }

            trendChartInstance = echarts.init(trendChart.value);

          const options = {
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['访问次数', '访问人数']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '10%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: trendResponse.data.map(item => item.date)
            },
            yAxis: [
              {
                type: 'value',
                name: '次',
                position: 'left',
                nameTextStyle: {
                  color: '#455166',
                  fontSize: 12
                },
                splitLine: {
                  lineStyle: {
                    type: 'dashed'
                  }
                }
              },
              {
                type: 'value',
                name: '人',
                position: 'right',
                nameTextStyle: {
                  color: '#455166',
                  fontSize: 12
                },
                splitLine: {
                  show: false
                }
              }
            ],
            series: [
              {
                name: '访问次数',
                type: 'line',
                yAxisIndex: 0,
                data: trendResponse.data.map(item => item.visitCount),
                smooth: true,
                itemStyle: {
                  color: '#4BA8FF'
                },
                lineStyle: {
                  color: '#4BA8FF'
                }
              },
              {
                name: '访问人数',
                type: 'line',
                yAxisIndex: 1,
                data: trendResponse.data.map(item => item.visitorCount),
                smooth: true,
                itemStyle: {
                  color: '#FFD184'
                },
                lineStyle: {
                  color: '#FFD184'
                }
              }
            ]
          };

            trendChartInstance.setOption(options);
        }

        ElMessage.success('数据加载成功');
    } catch (error: any) {
        ElMessage.error(error.message || '后端加载数据失败，使用模拟数据');
        cardData.value = getMockCardData();
        userChartData.value = getMockUserData();
        documentTypeData.value = getMockDocumentTypeData();
        topDocs.value = getMockTopDocs();
        initUserChart();
        initDocumentChart();
        initTrendChart(startDate, endDate);
    } finally {
        loading.value = false;
    }
};

//初始化图表
const initUserChart = () => {
  if (!userChart.value) return
  //销毁已存在
  if (userChartInstance) {
    (userChartInstance as ECharts).dispose();
  }

  userChartInstance = echarts.init(userChart.value);

  const options = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(0, 0, 0, 0.1)',
          width: 5
        }
      },
      formatter: (params: any) => {
        const data = params[0];
        return `
                    <div style="text-align: left; font-weight: bold; margin-bottom: 12px;">${data.name}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span style="display: inline-block; width: 12px; height: 12px; background-color: #51B6F0;"></span>
                            <span>用户数</span>
                        </div>
                        <span style="font-weight: bold;">${data.value}</span>
                    </div>
                `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: userChartData.value.categories,
      axisLabel: {
        interval: 0,   // 强制显示所有标签
        color: '#455166',
        fontSize: 12
      }
    },

    yAxis: {
      type: 'value',
      name: '人',
      nameTextStyle: {
        color: '#455166',
        fontSize: 12,
        padding: [0, 0, 0, -20]
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        data: userChartData.value.values,
        type: 'bar',
        barWidth: 15,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#51B6F0' },
            { offset: 1, color: '#3089CE' },
          ]),
          borderRadius: [4, 4, 4, 4]
        }
      }
    ]
  };

  userChartInstance.setOption(options);
}
const initTrendChart = (startDate?: Date, endDate?: Date) => {
    if (!trendChart.value) return

    if (trendChartInstance) {
        (trendChartInstance as ECharts).dispose();
    }

    const [sDate, eDate] = startDate && endDate
        ? [startDate, endDate]
        : defaultDateRange.value;

    dateRange.value = [sDate, eDate];

    //使用模拟数据
    const trendData = getMockTrendData(sDate, eDate);

    trendChartInstance = echarts.init(trendChart.value);

    const options = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['访问次数', '访问人数']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: trendData.dates
        },
      yAxis: [
        {
          type: 'value',
          name: '次',
          position: 'left',
          nameTextStyle: {
            color: '#455166',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        {
          type: 'value',
          name: '人',
          position: 'right',
          nameTextStyle: {
            color: '#455166',
            fontSize: 12
          },
          splitLine: {
            show: false
          }
        }
      ],
        series: [
          {
            name: '访问次数',
            type: 'line',
            yAxisIndex: 0,
            data: trendData.visitCount,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#4BA8FF',
              borderWidth: 0
            },
            lineStyle: {
              color: '#4BA8FF'
            }
          },
          {
            name: '访问人数',
            type: 'line',
            yAxisIndex: 1,
            data: trendData.visitorCount,
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#FFD184',
              borderWidth: 0
            },
            lineStyle: {
              color: '#FFD184'
            }
          }
        ]
    };

    trendChartInstance.setOption(options);
}
const initDocumentChart = () => {
    if (!documentChart.value) return

    if (documentChartInstance) {
        (documentChartInstance as ECharts).dispose();
    }

    documentChartInstance = echarts.init(documentChart.value);

  const options = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'right'
    },
    color: ['#A1F5FF', '#519AFF', '#5BE4FF', '#8CBCFF', '#7FB4FF', '#BCD8FF', '#D3E6FF', '#4A90E2', '#6DD5FA', '#A8D8FF'],
    graphic: [
      {
        type: 'text', // 图形元素类型为文本
        left: '33%',
        top: '40%',
        style: {
          text: '文档总数\n' + documentTypeData.value.reduce((sum: number, item: any) => sum + item.value, 0).toLocaleString() + '份',
          textAlign: 'center',
          fill: '#333', // 文字颜色
          fontSize: 20,
          fontWeight: 'bold',
          lineHeight: 30,
        }
      }
    ],
    series: [
      {
        name: '文档类型',
        type: 'pie',
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          color: '#333',
          fontSize: 12,
          fontWeight: 'bold'
        },
        radius: ['45%', '60%'],
        center: ['40%', '50%'],
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        data: documentTypeData.value
      }
    ]
  };

    documentChartInstance.setOption(options);
}

//日期变化
const handleDateChange = (newDateRange: [Date, Date]) => {
    dateRange.value = newDateRange;//同步更新
    loadAllData(newDateRange[0], newDateRange[1]);
};

//窗口大小变化（防抖）
const handleResize = () => {
    if (resizeTimer) {
        clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(() => {
        userChartInstance?.resize();
        trendChartInstance?.resize();
        documentChartInstance?.resize();
    }, 150);
};

onMounted(() => {
    loadAllData();
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (userChartInstance) {
        userChartInstance.dispose();
        userChartInstance = null;
    }
    if (trendChartInstance) {
        trendChartInstance.dispose();
        trendChartInstance = null;
    }
    if (documentChartInstance) {
        documentChartInstance.dispose();
        documentChartInstance = null;
    }
});
</script>

<style scoped lang="less">
.title{
  font-size: 16px;
  font-weight: bold;
  padding: 12px 0 20px;
}
.page-main{
  overflow: auto;
}
.stat-page {
  height: 100vh;
  overflow: auto;
  .data-cards {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background: #fff;
    border-radius: 8px;
    padding: 20px 0;

    .card-x {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &.not-last::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 50px;
        background-color: #e4e7ed;
      }

      .card-content {
        display: flex;
        align-items: center;
        padding: 0 20px;
      }

      .card-left {
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
          width: 36px;
          height: 36px;
          object-fit: contain;
        }
      }

      .card-right {
        display: flex;
        flex-direction: column;
        margin-left: 16px;

        .card-title {
          font-size: 14px;
          color: #455166;
        }

        .card-value {
          font-size: 24px;
          color: #000;
          margin: 12px 0;
        }

        .card-trend {
          font-size: 14px;
          color: #455166;

          .trend-value {
            padding: 0 4px;

            &.positive {
              color: #f56c6c;
            }

            &.negative {
              color: #67c23a;
            }
          }
          .trend-icon {
            width: 14px;
            height: 14px;
            object-fit: contain;
          }

          .trend-text {
            font-size: 14px;
            color: #455166;
          }
        }
      }
    }
  }
    .data-charts {
        display: flex;
        flex-wrap: wrap;
        margin: 20px 0 20px;
        gap: 20px;
        width: 100%;
        box-sizing: border-box;

        .chart {
            box-sizing: border-box;
            padding: 10px 0;
            flex: 1 0 auto;
            min-width: 480px;
            width: calc(50% - 10px);
            height: 400px;

            .h4 {
                font-size: 14px;
                font-weight: 700;
            }

            .date-pick {
                position: relative;

                ::v-deep .date-picker {
                    position: absolute;
                    top: -20px;
                    right: 20px;
                    width: 240px;
                    z-index: 1; //日期选择在图表上方
                }
            }

            .table {
                margin-top: 20px;
            }
        }
    }
}
</style>
