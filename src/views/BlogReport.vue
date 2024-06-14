<template>
    <div class="blog_report">
        <div class="blog_report_container">
            <h3>文章檢舉管理</h3>
            <ul class="btns">
                <li class="btn" :class="{ active: filter === 'all' }" @click="filterReports('all')">全部({{ reports.length }})</li>
                <li class="btn" :class="{ active: filter === 'pending' }" @click="filterReports('pending')">待處理({{ pendingReports.length }})</li>
                <li class="btn" :class="{ active: filter === 'processed' }" @click="filterReports('processed')">已處理({{ processedReports.length }})</li>
            </ul>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>文章編號</th>
                        <th>文章標題</th>
                        <th>發文者</th>
                        <th>檢舉原因</th>
                        <th>檢舉日期</th>
                        <th>處理狀態</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="report in filteredReports" :key="report.id">
                        <td>{{ report.id }}</td>
                        <td>{{ report.title }}</td>
                        <td>{{ report.author }}</td>
                        <td>{{ report.reason }}</td>
                        <td>{{ report.date }}</td>
                        <td><span class="status" :class="report.status"><i class="circle"></i>{{ report.statusText }}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            filter: 'all',
            reports: [
                { id: '240111424', title: '東京紅燈區泡泡浴帶你飛', author: 'Nabi', reason: '不當內容', date: '20240115', status: 'pending', statusText: '待處理' },
                { id: '240102314', title: '不用門票就能逛迪士尼樂園', author: 'NeonDog', reason: '不實資訊', date: '20240212', status: 'removed', statusText: '已下架' },
                { id: '231229631', title: '飆股30%高投報不佳套房', author: 'Winnie64', reason: '不當商業行為', date: '20231231', status: 'processed', statusText: '已處理' },
            ]
        }
    },
    computed: {
        pendingReports() {
            return this.reports.filter(report => report.status === 'pending');
        },
        processedReports() {
            return this.reports.filter(report => report.status === 'processed' || report.status === 'removed');
        },
        filteredReports() {
            if (this.filter === 'all') {
                return this.reports;
            } else if (this.filter === 'pending') {
                return this.pendingReports;
            } else if (this.filter === 'processed') {
                return this.processedReports;
            }
            return []; // 確保所有條件都有返回值
        }
    },
    methods: {
        filterReports(status) {
            this.filter = status;
        }
    }
}
</script>


<style scoped>
.blog_report {
    position: absolute;
    top: 100px;
    bottom: 0;
    right: 0;
    left: 20%;
    z-index: 5;
    padding: 20px;
}

.blog_report_container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 20px;
    width: 100%;
    max-width: 1200px;

    h3 {
        margin-top: 0;
        margin-bottom: 20px;
        font-size: 24px;
        color: #333;
    }

    .btns {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0 0 20px 0;
    }

    .btn {
        padding: 10px 15px;
        cursor: pointer;
        font-size: 16px;
        color: #333;
        margin-right: 15px;

        &.active {
            color: #3b8beb;
            border-bottom: 2px solid #3b8beb;
            font-weight: bold;
        }
    }

    .report-table {
        width: 100%;
        border-collapse: collapse;

        th,
        td {
            padding: 12px;
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
        }

        th {
            background-color: #9FC3E7;
            color: #4F82D4;
            height: 50px;
            line-height: 50px;
        }

        .status {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #333;

            .circle {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                display: inline-block;
                margin-right: 5px;
            }

            &.pending .circle {
                background-color: #888888;
            }

            &.removed .circle {
                background-color: #ff4444;
            }

            &.processed .circle {
                background-color: #00c851;
            }
        }
    }
}
</style>
