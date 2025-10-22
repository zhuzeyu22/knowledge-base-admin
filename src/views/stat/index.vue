<template>
    <div class="stat-page">
        <el-container class="container">
            <!-- 标题 -->
            <el-header class="page-header">
                <h2 style="font-size: 20px;">数据统计</h2>
            </el-header>
            <!-- 整体下方数据部分 -->
            <el-main class="page-main">
                <!-- 数据count卡片容器 -->
                <div class="data-cards">
                    <!-- 单个卡片 -->
                    <el-card v-for="(card, index) in cardData" :key="index" class="card">
                        <!-- 卡片内容 -->
                        <div class="card-content">
                            <!-- 卡片标题、数值 -->
                            <div class="card-header">
                                <div class="text-container">
                                    <h4 class="h4">{{ card.title }}</h4>
                                    <p class="num">{{ card.value }}</p>
                                </div>
                                <!-- 卡片图标 -->
                                <el-icon :class="card.iconClass" class="icon">
                                    <component :is="card.icon"></component>
                                </el-icon>
                            </div>
                            <!-- 数值涨幅 -->
                            <div class="card-trend">
                                <span :class="['trend-value', card.trend > 0 ? 'positive' : 'negative']">
                                    <el-icon v-if="card.trend > 0">
                                        <Plus />
                                    </el-icon>
                                    <el-icon v-if="card.trend < 0">
                                        <Minus />
                                    </el-icon>
                                    {{ Math.abs(card.trend) }}%
                                </span>
                                <span class="trend-text">较上周</span>
                            </div>
                        </div>
                    </el-card>
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
import { Plus, Minus, View, UserFilled, Document } from '@element-plus/icons-vue';
import apiService, { VisitStatsParams, WeeklyData } from '../../service/api';

//卡片数据
interface StatCard {
    title: string;
    value: string | number;
    icon: any;
    iconClass: string;
    trend: number;
}

const convertWeeklyDataToCards = (weeklyData: WeeklyData): StatCard[] => [
    {
        title: '访问次数',
        value: weeklyData.currentDatasetQueries.toLocaleString(),
        icon: View, 
        iconClass: 'icon-blue',
        trend: weeklyData.datasetQueriesGrowthRate,
    },
    {
        title: '访问人数',
        value: weeklyData.currentDatasetUsers.toLocaleString(),
        icon: UserFilled,
        iconClass: 'icon-purple',
        trend: weeklyData.datasetUsersGrowthRate
    },
    {
        title: '文档总数',
        value: weeklyData.currentResources.toLocaleString(),
        icon: Document,
        iconClass: 'icon-green',
        trend: weeklyData.resourcesGrowthRate,
    },
    {
        title: '活跃用户',
        value: weeklyData.currentActiveUsers.toLocaleString(),
        icon: UserFilled,
        trend: weeklyData.activeUsersGrowthRate,
        iconClass: 'icon-red'
    }
];

const getMockCardData = (): StatCard[] => [
    {
        title: '访问次数',
        value: '128,930',
        icon: View, 
        iconClass: 'icon-blue',
        trend: 12.5,
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
];
const cardData = ref<StatCard[]>(getMockCardData());

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

        cardData.value = convertWeeklyDataToCards(weeklyResponse);

        dateRange.value = [sDate, eDate];

        documentTypeData.value = documentTypeResponse.map(item => ({
            value: item.count,
            name: item.type
        }));

        topDocs.value = rankingResponse.map(item => ({
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
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '访问次数',
                        type: 'line',
                        data: trendResponse.data.map(item => item.visitCount),
                        smooth: true
                    },
                    {
                        name: '访问人数',
                        type: 'line',
                        data: trendResponse.data.map(item => item.visitorCount),
                        smooth: true
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
                interval: 0   // 强制显示所有标签
            }
        },

        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: userChartData.value.values,
                type: 'bar',
                barWidth: '30%'
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
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '访问次数',
                type: 'line',
                data: trendData.visitCount,
                smooth: true
            },
            {
                name: '访问人数',
                type: 'line',
                data: trendData.visitorCount,
                smooth: true
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
        series: [
            {
                name: '文档类型',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['40%', '60%'],
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                label: {
                    show: true,
                    position: 'inside',
                    formatter: (params: any) => `${Math.round(params.percent)}%`,
                    color: '#000',
                    fontSize: 12,
                    fontWeight: '700',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 18,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
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
.stat-page {
    width: 100%;
    height: calc(100vh - 40px);

    .page-header {
        width: 100%;
        height: 73px;
        line-height: 73px;
        border: 1px solid #e4e7ed;
        border-radius: 20px;
        background-color: #fff;
        box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    }

    .page-main {
        padding: 0;
    }

    .data-cards {
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        margin-top: 20px;
        gap: 20px;

        .card {
            box-sizing: border-box;
            padding: 10px 0px;
            flex: 1;
            min-width: 230px;
            max-width: calc(25% - 15px);

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start; //标题图标顶部对齐

                .text-container {
                    .num {
                        padding-top: 10px;
                        font-size: 26px;
                        font-weight: 700;
                    }

                }

                .icon {
                    height: 50px;
                    width: 50px;
                    border-radius: 10px;
                }

            }

            .card-trend {
                display: flex;
                align-items: center;
                font-size: 12px;
                padding-top: 15px;

                .trend-text {
                    color: #6b7280;
                }

                .trend-value {
                    display: flex;
                    align-items: center;
                    padding-right: 20px;

                    &.positive {
                        color: #67c23a;
                    }

                    &.negative {
                        color: #f56c6c;
                    }
                }
            }

        }
    }

    .icon-blue {
        color: #409eff;
        background-color: rgba(64, 158, 255, 0.1);
    }

    .icon-purple {
        color: #d274d5;
        background-color: rgba(235, 144, 226, 0.1);
    }

    .icon-green {
        color: #67c23a;
        background-color: rgba(103, 194, 58, 0.1);
    }

    .icon-red {
        color: #f56c6c;
        background-color: rgba(245, 108, 108, 0.1);
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
            padding: 10px 0px;
            flex: 1 0 auto;
            min-width: 480px;
            width: calc(50% - 10px);
            height: 400px;

            .h4 {
                font-size: 24px;
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