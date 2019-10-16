<template>
<section>
    <organBtnGroup :currentStep="1" @confirm="search" />
    <section class="content-white-box">
        <a-table :columns="columns"
            :rowKey="record => record.id"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <span slot="status" slot-scope="record">
                  {{record.type == 0 ? '资质' : '企业'}}{{status_arr[record.status]}}
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
import {getOrglist} from '@/service/getData'
import { checkStatus } from '../api/dictionary'
const columns = [
    {title: '机构', dataIndex: 'orgName', }, 
    {title: '所属账号', dataIndex: 'account', }, 
    {title: '操作人', dataIndex: 'auditor', }, 
    {title: '状态', key: 'status',scopedSlots: { customRender: 'status' }}, 
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
            orgName : '',
            status : '',
            statustype : '',
            status_arr : checkStatus,
        };
    },
    components : {
        organBtnGroup
    },
    methods : {
        async initData(page,size){
            this.loading = true;
            let res = await getOrglist(this.orgName,this.status,this.statustype,page,size);
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
            this.orgName = val.orgName || '';
            switch(val.status){
                case undefined:
                case 0:
                    this.status = '';
                    this.statustype = '';
                    break;
                case 1:
                    this.status = 0;
                    this.statustype = 1;
                    break;
                case 2:
                    this.status = 1;
                    this.statustype = 1;
                    break;
                case 3:
                    this.status = 2;
                    this.statustype = 1;
                    break;
                case 4:
                    this.status = 0;
                    this.statustype = 0;
                    break;
                case 5:
                    this.status = 1;
                    this.statustype = 0;
                    break;
                case 6:
                    this.status = 2;
                    this.statustype = 0;
                    break;
            }
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