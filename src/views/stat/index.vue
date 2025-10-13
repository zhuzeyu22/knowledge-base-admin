<template>
    <div class="stat-page">
        <el-container>
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
                        <div ref="userChart" style="width: 100%; height: 300px;"></div>
                    </el-card>
                    <!-- 访问趋势折线图 -->
                    <el-card class="chart">
                        <div ref="trendChart" style="width: 100%; height: 350px;"></div>
                    </el-card>
                    <!-- 文档类型饼图 -->
                    <el-card class="chart">
                        <h4 class="h4">文档类型分布</h4>
                        <div ref="documentChart" style="width: 100%; height: 300px;"></div>
                    </el-card>
                    <!-- 知识库调用排名 -->
                    <el-card class="chart">
                        <div>
                            <h4 class="h4">知识库调用排名</h4>
                        </div>
                    </el-card>

                </div>
            </el-main>
        </el-container>
    </div>

</template>

<script setup lang="ts">
// import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

import { Plus, Minus } from '@element-plus/icons-vue';
import { useCardData } from '../../composables/useCardData';



// 调用真实数据使用
// axios({
//     url:'/api/',//假设后端接口地址
//     method:'get'
// }).then(res=>{
//     cardData.value = res.data;//后端返回数据赋值给cardData
// })
const { cardData } = useCardData();

// 定义图表容器ref
const userChart = ref<HTMLDivElement | null>(null);
const trendChart = ref<HTMLDivElement | null>(null);

//图表实例
var userChartInstance: ECharts | null = null;
var trendChartInstance: ECharts | null = null;

//模拟数据
const userChartData = {
    categories: ['北京银行总部', '科技部', '南京分行', '苏州分行', '南昌分行', '其他分行'],
    values: [20, 50, 25, 30, 25, 60],
};
// const trendChartData = {

// };

//初始化图表
const initUserChart = () => {
    //确保容器存在
    if (!userChart.value) return

    //销毁已存在
    if (userChartInstance) {
        (userChartInstance as ECharts).dispose();
    }

    //创建新用户图表实例
    userChartInstance = echarts.init(userChart.value);

    // 设置图表配置
    const options = {
        title: {
            text: '用户分布',
            left: 'left'
        },
        // 图表网格配置
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },   
        // X轴配置
        xAxis: {
            type: 'category',
            data: userChartData.categories,
            axisLabel: {
                interval: 0   // 强制显示所有标签
            }
        },
        // Y轴配置
        yAxis: {
            type: 'value'
        },
        // 系列数据配置（柱状图核心数据）
        series: [
            {
                data: userChartData.values,
                type: 'bar',
                barWidth: '30%'
            }
        ]
    };

    //应用配置到图表
    userChartInstance.setOption(options);
}
const initTrendChart = () => {
    //确保容器存在
    if (!trendChart.value) return

    //销毁已存在
    if (trendChartInstance) {
        (trendChartInstance as ECharts).dispose();
    }

    //创建新实例
    trendChartInstance = echarts.init(trendChart.value);

    // 设置图表配置
    const options = {
        title: {
            text: '访问趋势',
            left: 'left'
        },
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
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [

            {
                name: '访问次数',
                type: 'line',
                stack: 'Total',
                data: [20,50,60,50,60,50,60],
                smooth: true
            },
            {
                name: '访问人数',
                type: 'line',
                stack: 'Total',
                data: [15,16,100,50,60,50,60],
                smooth: true
            },
            
        ]
    };

    //应用配置到图表
    trendChartInstance.setOption(options);
}
// 处理窗口大小变化
const handleResize = () => {
    userChartInstance?.resize();
    trendChartInstance?.resize();
};

// 组件挂载时初始化图表
onMounted(() => {
    initUserChart();
    initTrendChart();
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
});

// 组件卸载时清理资源
onUnmounted(() => {
    // 移除事件监听
    window.removeEventListener('resize', handleResize);
    // 销毁图表实例
    if (userChartInstance) {
        userChartInstance.dispose();
        userChartInstance = null;
    }});
</script>

<style scoped lang="less">
.stat-page {
    // margin: 0 auto;
    width: 1200px;
    height: 100%;
    // overflow: hidden;

    .page-header {
        width: 100%;
        height: 73px;
        line-height: 73px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
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
            min-width: 280px;
            height: 130px;
            flex: 1;
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
        margin-top: 20px;
        gap: 20px;
        width: 100%;
        box-sizing: border-box;

        .chart {
            box-sizing: border-box;
            padding: 10px 0px;
            flex: 1 0 auto;
            min-width: 580px;
            max-width: calc(50% - 10px);
            height: 400px;

            .h4 {
                font-weight: 700;
            }
        }
    }
}
</style>