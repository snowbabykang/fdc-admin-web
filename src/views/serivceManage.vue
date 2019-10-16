<template>
    <div>
    <div class="huiyuan-manage">
        <span>所属店铺</span><a-input v-model="forminfo.dianpu" placeholder="请输入" maxlength="50"/>
        <span>服务名称</span><a-input v-model="forminfo.mingcheng" placeholder="请输入" maxlength="50" />
        <a-button class="findhuiyuan" @click="searchService()"  type="primary" ghost>查询</a-button>
    </div>
    <div class="huiyuan-table">
    <div class="huiyuan-attention"><div style="color:red;margin-bottom:14px;">操作提示 :</div><div  style="color:rgba(153, 153, 153, 1);">· 管理平台商品</div></div>
    <!-- <a-button style="float:right;margin-top: 10px;"
        type="primary"  v-if="ishave"
      >
        批量删除
      </a-button> -->
      <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" (加批量删除需添加) -->
    <a-table :columns="columns" :pagination="pagination" :loading="loading" @change="handleTableChange" :dataSource="data" :rowKey="record => record.id" v-if="ishave">
        <template slot="commodityPrice" slot-scope="commodityPrice"> 
                <span v-if="commodityPrice">￥{{commodityPrice}}</span></template>
        <span slot="action" slot-scope="record">
          <a href="javascript:;" v-if="checkPower()" @click="xiajia(record.id)">删除</a>
        </span>
        </a-table>
    <table class="kong-table" v-else>
      <thead><tr><td>服务名称</td><td>店铺名</td><td>价格</td><td>时间</td><td>操作</td></tr></thead>
        <tbody>
          <tr><td style="padding: 0;" colspan="5"><section class="content-white-box">
            <noData />
        </section></td></tr>
        </tbody>
        
    </table>
    </div>
    <delService :visible.sync="xiajiaVisible" :id="id" @confirm="confirmxiajia" @fetch="retable(arguments)" />
    </div>
</template>

<script>
import noData from '../components/noData'
import {commodityInfo,commodityInfodel} from '@/service/getData'
import delService from "../components/delService"
const columns = [{
  title: '服务名称',
  dataIndex: 'commodityName',
  key: '服务名称',
}, {
  title: '店铺名',
  dataIndex: 'storeName',
  key: '店铺名',
}, {
  title: '价格',
  dataIndex: 'commodityPrice',
  scopedSlots: { customRender: 'commodityPrice' }
},{
  title: '时间',
  dataIndex: 'createTime',
  key: '时间',
},{
  title: '操作',
  key: 'action',
  scopedSlots: { customRender: 'action' },
}];

const data = [];
let commodityName='';
let storeName='';
let page=1;
export default {
  data() {
    return {
      data,
      columns,
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      ishave:true,
      loading:false,
      xiajiaVisible : false,
      id:'',
      pagination: {},
      forminfo : {
        dianpu : '',
        mingcheng : '',
      },
    }
  },
  components : {
        noData,delService
  },
  mounted() {
    this.fetch(commodityName,storeName,1);
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    start () {
      this.loading = true;
      // ajax request after empty completing
      setTimeout(() => {
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    },
    retable(msg){
      this.msg1=msg[0];
      this.msg2=msg[1];
      this.msg3=msg[2];
      this.pagination.current = 1;
      this.handleTableChange (this.pagination);
    },
    xiajia(id){
            this.xiajiaVisible = true;
            this.id=id;
            console.log(id);
    },
    confirmxiajia(values){
            console.log("失败原因");
            console.log(values);
    },
    handleTableChange (pagination) {
      let commodityName = this.forminfo.mingcheng;
      let storeName = this.forminfo.dianpu;
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch(commodityName,storeName,pagination.current);
    },
    fetch (commodityName,storeName,page) {
      this.loading = true
    commodityInfo(commodityName,storeName,page).then(res => {
            if(res && res.code == 200){
                const pagination = { ...this.pagination };
                pagination.total = res.data.total;
                pagination.pageSize = 10;
                this.loading = false;
                this.data = res.data.list;
                console.log(res.data.total);
                this.pagination = pagination;
            }
        })
    },
    // onSelectChange (selectedRowKeys) {
    //   console.log('selectedRowKeys changed: ', selectedRowKeys);
    //   this.selectedRowKeys = selectedRowKeys
    // },
    searchService(){
      this.pagination.current = 1;
      this.handleTableChange (this.pagination); 
    }
  },
}
</script>

<style scoped>
    .ant-input{
        width: 240px;
        margin: 0 8px 8px 8px;
    }
    .ant-pagination{
      float: right;
    }
    .huiyuan-attention{
        width:470px;
        font-size:12px;
        display: inline-block;
        padding-bottom:21px;
    }
    .huiyuan-manage{
        padding-top:24px;
        padding-left:25px;
        background: white;
        padding-bottom:24px;
    }
    .huiyuan-manage .ant-input{
      margin-right: 42px;
    }
    .findhuiyuan{
        width:74px;
        height:31px;
    }
    .huiyuan-table{
        padding-top:20px;
        background:white;
        padding-left:32px;
        padding-right:32px;
        margin-top:10px;
    }
    .kong-table{
      width: 100%;
    }
    .kong-table tr td{
      width: 15%;
      padding-left: 10%;
      height:38px;
      background-color: RGBA(232, 232, 232, 1);
    }
    .content-white-box{
      width:100%;
      margin-bottom:0;
    }
</style>
