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
                        <div ref="user-chart">用户分布</div>
                    </el-card>
                    <!-- 访问趋势折线图 -->
                    <el-card class="chart">
                        <div ref="trend-chart">访问趋势</div>
                    </el-card>
                    <!-- 文档类型饼图 -->
                    <el-card class="chart">
                        <div ref="document-chart">文档类型分布</div>
                    </el-card>
                    <!-- 知识库调用排名 -->
                    <el-card class="chart">
                        <div>知识库调用排名</div>
                    </el-card>

                </div>
            </el-main>
        </el-container>
    </div>

</template>

<script setup lang="ts">
// import axios from 'axios';
import { Plus, Minus } from '@element-plus/icons-vue';
import { useCardData } from '../../composables/useCardData';

const { cardData } = useCardData();


// 调用真实数据使用
// axios({
//     url:'/api/',//假设后端接口地址
//     method:'get'
// }).then(res=>{
//     cardData.value = res.data;//后端返回数据赋值给cardData
// })

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

                    .h4 {
                        color: #6b7280;
                        font-size: 12px;
                    }

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
        gap:20px;
        width: 100%;
        box-sizing: border-box;
        .chart {
            box-sizing: border-box;
            padding: 10px 0px;
            flex: 1 0 auto;
            min-width: 580px;
            max-width: calc(50% - 10px);
            min-height: 220px;
        }
    }
}
</style>