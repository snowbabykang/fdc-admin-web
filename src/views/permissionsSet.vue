<template>
<section>
    <section class="content-white-box">
        <div class="big-border-title">权限设置</div>
        <section class="steplist">
            <router-link class="btn active" to="/permissionsSet">操作员</router-link>
            <router-link class="btn" to="/roleSet">权限组</router-link>
        </section>
        <a-button type="primary" class="addbtn" v-if="checkPower()"  @click="addOperator">添加操作员</a-button>
        <a-table :columns="columns" :rowSelection="rowSelection"
            :rowKey="record => record.id"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <template slot="action" slot-scope="record">
                <div v-if="record.roleId == 'admin'">超级管理员不可编辑</div>
                <div v-if="checkPower() && record.roleId !== 'admin'">
                    <a href="javascript:void(0);" class="btn-link" @click="edit(record.id)">编辑</a>
                    <a-divider type="vertical" />
                    <a href="javascript:void(0);" class="btn-link" @click="deleteOperator(record.id)">删除</a>
                </div>
            </template>
        </a-table>
        <div v-if="data.length > 0" style="margin-top: -38px;"><a @click="alldel" v-if="checkPower()"> 批量删除</a></div>
    </section>  
    <addOperatorModal :visible.sync="visible" :id="editid" @confirm="confirm" />   
</section>
</template>

<script>
import addOperatorModal from '../components/addOperatorModal'
import {getUserlist, deleteUser} from '@/service/getData'
const columns = [
    {title: '登录名', dataIndex: 'userName', },
    {title: '上次登录', dataIndex: 'lastTime', },
    {title: '权限组', dataIndex: 'roleName', },
    {title: '操作', key: 'action',scopedSlots: { customRender: 'action' }, }
];
export default {
    data () {
        return {
            data: [],
            pagination: {},
            loading: false,
            columns,
            pagesize : 10,
            selectedRowKeys: [],
            visible : false,
            editid : ''
        }
    },
    components:{
        addOperatorModal
    },
    computed : {
        rowSelection() {
            const { selectedRowKeys } = this;
            return {
                onChange: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys = selectedRowKeys
                },
                getCheckboxProps: record => ({
                  props: {
                    disabled: record.roleId === 'admin', 
                  }
                }),
            }
        },
    },
    methods: {
        async initData(page,size){
            this.loading = true;
            let res = await getUserlist(page,size);
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
        // 添加操作员
        addOperator () {
            this.editid = "";
            this.visible=true;
        },
        edit(id){
            this.editid = id;
            this.visible=true;
        },
        confirm(){
            this.initData(1,this.pagesize);
            if(this.editid){
                this.GLOBAL.getPower();
            }
        },
        deleteOperator(id){
            let that = this;
            this.$confirm({
                title: '真的要删除吗？',
                onOk() {
                    let arr = [];
                    arr.push(id);
                    that.delete(arr);
                },
            });
        },
        delete(arr){
            deleteUser(arr).then((res) => {
                if(res && res.code == 200){
                    this.initData(1,this.pagesize);
                }
            })
        },
        alldel(){
            if(!this.selectedRowKeys.length){
                this.$notification.error({
                    message: '错误提示',
                    description: '请选择要删除的选项',
                });
            }else{
                let that = this;
                this.$confirm({
                    title: '真的要删除吗？',
                    onOk() {
                        that.delete(that.selectedRowKeys);
                    },
                });
                
            }
        },
    },
    mounted(){
        this.initData(1,this.pagesize);
    },
    
}
</script>

<style scoped>
.expanderTb{
    width: 100%;
}
.expanderTb tr:first-child td{
    padding-bottom: 22px;
}
.addbtn{
    float: right;
}
</style>
