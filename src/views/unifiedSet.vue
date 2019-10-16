<template>
<section>
    <section class="content-white-box">
        <div class="big-border-title">统一设置</div>
         <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" -->
        <a-table :columns="columns"
            :rowKey="record => record.id"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
          >
            <template slot="settingValue" slot-scope="record">
                {{setbefore_arr[record.settingType]}}
                <a-input-number v-if="record.settingType == 3" v-model="record.settingValue" :min="0" :max="9999999" :precision="2" placeholder="请输入"  :disabled="!record.isEdit"/>
                <a-input-number v-else-if="record.settingType == 4" v-model="record.settingValue" :min="0" :precision="1" :max="100" placeholder="请输入"  :disabled="!record.isEdit"/>
                <a-input v-else  v-model="record.settingValue" style="width: 70px;" :disabled="!record.isEdit"/>

                {{setafter_arr[record.settingType]}}  
                <div v-if="checkPower()" style="display: inline-block;">
                    <a v-if="!record.isEdit" @click="edit(record)" class="editbtn">编辑</a>
                    <a v-else @click="saveedit(record)" class="editbtn success">保存</a>
                </div>
            </template>
            <template slot="status" slot-scope="record">
                <a-switch v-if="checkPower()" :checked="record.status ? false : true" @change="changeStatus(record.id,record.status,record)" />
                <a-switch v-else :checked="record.status ? false : true" />
            </template>
        </a-table>
        <!-- <div v-if="data.length > 0" style="margin-top: -38px;"><a @click="alldel"> 批量删除</a></div> -->
    </section>     
</section>
</template>

<script>
import {systemSetlist, updateSystemSet} from '@/service/getData'
const columns = [
    {title: '功能名称', dataIndex: 'settingName', },
    {title: '功能', key: 'settingValue', scopedSlots: { customRender: 'settingValue' }},
    {title: '状态', key: 'status', scopedSlots: { customRender: 'status' }},
];
export default {
    data () {
        return {
            data: [],
            pagination: {},
            loading: false,
            columns,
            pagesize : 10,
            setbefore_arr : {3 : '金额',4 : '比例'},
            setafter_arr : {3 : '元',4 : '%'},
            selectedRowKeys: [],
        }
    },
    methods: {
        async initData(page,size){
            this.loading = true;
            let res = await systemSetlist(page,size);
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
        edit(item){
            this.$set(item, 'isEdit', this.isEdit = true);
        },
        saveedit(record){
            let value = {
                id : record.id,
                settingValue : record.settingValue,
            };
            updateSystemSet(value).then((res) => {
                if(res && res.code == 200){
                    this.$set(record, 'isEdit', this.isEdit = false);
                }
            })
        },
        changeStatus(id,status,record){
            let value = {
                id : id,
                status : status == 1 ? 0 : 1,
            };
            updateSystemSet(value).then((res) => {
                if(res && res.code == 200){
                    record.status = status == 1 ? 0 : 1;
                }
            })
        },
        onSelectChange (selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
        },
        alldel(){
            console.log(this.selectedRowKeys);
            if(!this.selectedRowKeys.length){
                this.$notification.error({
                    message: '错误提示',
                    description: '请选择要删除的选项',
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
.editbtn{
    padding-left: 30px;
}
</style>
