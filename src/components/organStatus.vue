<!-- 机构管理查看详情中各个状态列表 -->
<template>
    <section class="content-white-box">
        <div class="big-border-title">状态信息</div>
        <a-row class="statuslist">
            <a-col :span="10">
                <a-row>
                    <a-col :span="6" class="status_title">提交时间：</a-col>
                    <a-col :span="18">{{info.createTime}}</a-col>
                </a-row>
            </a-col>
            <a-col :span="10" v-if="info.status !== 0">
                <a-row>
                    <a-col :span="6" class="status_title">审核时间：</a-col>
                    <a-col :span="18">{{info.updateTime}}</a-col>
                </a-row>
            </a-col>
            <a-col :span="10" v-if="info.status !== 0 && type !== 1">
                <a-row>
                    <a-col :span="6" class="status_title">操作人：</a-col>
                    <a-col :span="18">{{info.auditor}}</a-col>
                </a-row>
            </a-col>
            <a-col :span="10">
                <a-row>
                    <a-col :span="6" class="status_title">状态：</a-col>
                    <a-col :span="18"> <span :class="type == 4 ? accountstatusClass[info.status] : statusClass[info.status]">{{type == 4 ? checkAccountStatus[info.status] : checkStatus[info.status]}} <span v-if="info.status == 2 && info.failReason">（{{info.failReason}}）</span></span></a-col>
                </a-row>
            </a-col>
        </a-row>
    </section>
</template>
<script>
import { checkStatus,statusClass ,checkAccountStatus,accountstatusClass} from '../api/dictionary'
export default {
    name: 'organStatus',
    props: ['status','type'],
    data() {
        return {
            checkStatus : checkStatus,
            statusClass : statusClass,
            checkAccountStatus : checkAccountStatus,
            accountstatusClass : accountstatusClass
        };
    },
    computed : {
        info(){
            return this.status || {}
        }
    },
};
</script>
<style scoped>
.statuslist{
    color:rgba(0,0,0,0.65);
    line-height: 1;
    padding-left: 11px;
}
.statuslist .status_title{
    font-weight:500;
    color:rgba(0,0,0,0.65);
    font-size: 16px;
}
.statuslist .ant-row{
    padding-bottom: 22px;
}
.content-white-box{
    margin-bottom: 0;
}
</style>