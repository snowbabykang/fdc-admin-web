<template>
<section>
    <organBtnGroup :currentStep="2" @confirm="search" />
    <section class="content-white-box">
        <a-table :columns="columns"
            :rowKey="record => record.id"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <span slot="marginStatus" slot-scope="marginStatus">
                <span v-if="marginStatus == 1">是</span>   
                <span v-else>否</span>   
            </span>
            <span slot="status" slot-scope="status">
                 企业{{status_arr[status]}}
            </span>
            <span slot="action" slot-scope="record">
                <span class="btn-link" @click="showDetail(record.orgId)">查看</span>
            </span>
        </a-table>
    </section>
</section>
</template>
<script>
import organBtnGroup from "../components/organBtnGroup"
import {getOrgRzlist} from '@/service/getData'
import { checkStatus } from '../api/dictionary'
const columns = [
    {title: '机构', dataIndex: 'orgName', }, 
    {title: '所属账号', dataIndex: 'account', }, 
    {title: '申请时间', dataIndex: 'createTime', }, 
    {title: '是否缴纳保证金', dataIndex: 'marginStatus', scopedSlots: { customRender: 'marginStatus' }}, 
    {title: '状态', dataIndex: 'status',scopedSlots: { customRender: 'status' }}, 
    {title: '操作', key: 'action',scopedSlots: { customRender: 'action' }, }
];

export default {
    data() {
        return {
            data: [],
            pagination: {},
            loading: false,
            columns,
            pagesize : 10,
            account : '',
            orgName : '',
            status : '',
            status_arr : checkStatus,
        };
    },
    components : {
        organBtnGroup
    },
    methods : {
        async initData(page,size){
            this.loading = true;
            let res = await getOrgRzlist(this.account,this.orgName,this.status,page,size);
            if(res && res.code == 200){
                const pagination = { ...this.pagination };
                pagination.total = res.data.total;
                pagination.pageSize = size;
                this.loading = false;
                this.data = res.data.list;
                this.pagination = pagination;
            }
        },
        handleTableChange (pagination) {
            const pager = { ...this.pagination };
            pager.current = pagination.current;
            this.pagination = pager;
            this.initData(pagination.current,this.pagesize);
        },
        search(val){
            this.account = val.account || '';
            this.orgName = val.orgName || '';
            this.status = val.status !== undefined ? val.status : '';
            this.pagination.current = 1;
            this.handleTableChange(this.pagination);
        },
        showDetail(id){
            this.$router.push('/showCompanyInfo/'+id);
        }
    },
    mounted(){
        this.initData(1,this.pagesize);
    }
};
</script>
<style type="text/css" scoped>

</style>