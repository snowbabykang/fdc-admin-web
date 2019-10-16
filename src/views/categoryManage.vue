<template>
<section>
    <!-- <div class="content-white-box">
    类目管理
    </div> -->
    <div class="content-white-box">
        <a-row type="flex" align="bottom">
            <a-col :span="16" class="alertinfobox">
                <div class="red">操作提示：</div>
                <ul>
                    <li>·类目修改必须点击保存完成操作</li>
                    <li>·鼠标拖拽调整需求方展示顺序，只允许同级拖拽排序</li>
                </ul>
            </a-col>
            <a-col :span="8" class="text-right">
                <a-button v-if="checkPower()" type="primary" @click="add()">新增+</a-button>
            </a-col>
        </a-row>
        <div class="treebox">
            <div class="treehead">
                <table>
                    <tr>
                        <td>类目名称</td>
                        <td width="240">操作</td>
                    </tr>
                </table>
            </div>
            <el-tree
                ref="tree"
                :data="treeData"
                :props = "defaultProps"
                :check-strictly="true"
                :default-expand-all="false"
                show-checkbox
                :accordion="true"
                draggable
                @node-drop="handleDrop"
                :allow-drop="allowDrop"
                :allow-drag="allowDrag"
                node-key="id"
                :indent="50"
                :expand-on-click-node="false">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <a-popover :mouseLeaveDelay="2" placement="topLeft" :visible="data.isEdit"  :getPopupContainer="getPopupContainer()">
                        <template slot="content">
                            <a-icon type="exclamation-circle" theme="filled" style="color: #FAAD14"/>
                            <span>请保存</span>
                        </template>
                        <a-input maxlength="50" class="edit-title-box" :class="'edit-title-box-'+data.id" v-model="data.commodityTypeName" :readOnly="!data.isEdit" v-focus="data.isEdit" @blur="saveName(data)"/>
                    </a-popover>
                    <div class="add-lower-btn" @click="add(data)" v-if="checkPower() && (node.level == 1 || node.level == 2)">
                        <a-icon type="plus-square" theme="filled" />新增下级
                    </div>
                    <span class="tree-btn-list" v-if="checkPower()">
                        <span v-if="data.isEdit" class="success" @click="saveName(data)">保存</span>
                        <span v-if="!data.isEdit" @click="edit(node,data)">编辑</span>
                        <a-divider type="vertical" />
                        <span @click="deletenode(node,data)">删除</span>
                        <!-- <a-popconfirm title="你确定删除吗？" @confirm="remove(node, data)">
                            <span>删除</span>
                        </a-popconfirm> -->
                    </span>
                </div>
            </el-tree>
            <div class="all-delete-box"><a-checkbox :checked="checkall" @change="checkAll()">全部</a-checkbox><span class="btn-link" @click="batchDelete()" v-if="checkPower()">批量删除</span></div>
        </div>  
    </div>
</section>
</template>

<script>
import {getCategory,addCategory,updateCategory,sortCategory,deleteCategory} from '@/service/getData'
export default {
    data () {
        return {
            treeData : [],
            treeDataOne : [],   //树结构转换一维数组，全选使用
            checkall : false,
            defaultProps: {
              children: 'list',
              label: 'commodityTypeName'
            },
        }
    },
    methods: {
        getPopupContainer(){
            return () => document.getElementsByClassName('ant-layout-content')[0]
        },
        async initData(){
            this.treeData = [];
            this.treeDataOne = [];
            this.checkall = false;
            let tree = this.$refs.tree;
            tree.setCheckedKeys([]);
            let res = await getCategory();
            if(res && res.code == 200){
                this.treeData = this.deepCopy(res.data);
            }
        },
        deepCopy(obj) {
            let arrobj;
            Array.isArray(obj) ? arrobj =[] :arrobj = {};
            for(var i in obj){
                if(obj.hasOwnProperty(i)){
                    if(typeof obj[i] === "object"){
                        arrobj[i] = this.deepCopy(obj[i]);
                    }else{
                        arrobj[i] = obj[i];
                        arrobj['isEdit'] = false;
                    }
                }
            }
            return arrobj;
        },
        exchangeData(obj) {
            for(var i in obj){
                if(obj.hasOwnProperty(i)){
                    if(i == 'id'){
                        this.treeDataOne.push(obj.id);
                    }
                    if(typeof obj[i] === "object"){
                        this.exchangeData(obj[i]);
                    }
                }
            }
        },
        // 新增
        add(data) {
            let name,pid;
            if(data){
                this.$refs.tree.store.nodesMap[data.id].expanded = true;
                name = data.commodityTypeName + '_'+parseInt(Math.random()*100);
                pid = data.id;
            }else{
                name = "p_"+ parseInt(Math.random()*100);
                pid = "";
            }
            addCategory(name,pid).then((res) => {
                if(res && res.code == 200){
                    let newChild = res.data;
                    newChild.isEdit = true;
                    newChild.commodityTypeName = "";
                    if(data){
                        if (!data.list) {
                            this.$set(data, 'list', []);
                        }
                        data.list.push(newChild);
                    }else{
                        this.treeData.push(newChild);
                    }
                }
            })
        },
        // 编辑保存
        edit(node,data) {
            data.isEdit = true;
        },
        saveName(data){
            if(!data.isEdit){
                return false;
            }
            if(!data.commodityTypeName){
                this.$error({
                    title: '提示',
                    content: "请输入类目名",
                    onOk() {
                        data.isEdit = true;
                    },
                });
                return false;
            }else{
                updateCategory(data.commodityTypeName,data.id).then((res) => {
                    if(res && res.code == 200){
                        data.isEdit = false;
                    }
                })
            }
        },
        deletenode(node, data){
            let that = this;
            this.$confirm({
                title: '信息',
                content: '真的要删除吗？',
                onOk() {
                    if(data.list && data.list.length > 0){
                        that.$error({
                            title: '提示',
                            content: "删除失败，此类目下有下级类目，请删除后操作",
                        });
                        return false;
                    }
                    let arr = [];
                    arr.push(data.id);
                    deleteCategory(arr).then((res) => {
                        if(res && res.code == 200){
                            that.remove(node, data);
                        }
                    })
                },
            });
        },
        // 删除
        remove(node, data) {
            const parent = node.parent;
            const list = parent.data.list || parent.data;
            const index = list.findIndex(d => d.id === data.id);
            list.splice(index, 1);
        },
        // 批量删除
        batchDelete(){
            let tree = this.$refs.tree;
            let keys = tree.getCheckedKeys();
            if(keys.length <= 0){
                this.$error({
                    title: '提示',
                    content: "请选择要删除的类目",
                });
                return false;
            }
            let isDelete = true;
            for(let i of keys){
                var nodes = tree.getNode(i);
                if(nodes.childNodes.length > 0){
                    isDelete = false;
                }
            }
            if(isDelete){
                deleteCategory(keys).then((res) => {
                    if(res && res.code == 200){
                        this.$message.success('删除成功');
                        this.initData();
                    }
                })
            }else{
                this.$error({
                    title: '提示',
                    content: "只可以同时删除无子节点的数据",
                });
                return false;
            }
        },
        // 全选
        checkAll(){
            this.checkall = !this.checkall;
            let tree = this.$refs.tree;
            if(!this.checkall){
                tree.setCheckedKeys([]);
            }else{
                this.treeDataOne = [];
                this.exchangeData(this.treeData);
                tree.setCheckedKeys(this.treeDataOne);
            }
        },
        // 拖拽
        handleDrop(draggingNode, dropNode, dropType, ev) {
            sortCategory(draggingNode.data.id, dropNode.data.id, dropType).then((res) => {
                if(res && res.code == 200){
                    
                }
            })
        },
        allowDrop(draggingNode, dropNode, type) {
            // 只允许同级排序
            if(type == 'inner'){
                return false;
            }else{
                return draggingNode.parent.data.id == dropNode.parent.data.id;
            }
        },
        allowDrag(draggingNode) {
            return true;
        },
    },
    mounted(){
        this.initData();
    },
    directives: {
        focus: {
            update: function(el, binding) {
                if (binding.value){
                    el.focus();
                }else{
                    el.blur();
                }
            },
            inserted: function(el, binding) {
                if (binding.value){
                    el.focus();
                }else{
                    el.blur();
                }
            },
        }
    },
}
</script>

<style scoped>
.treebox{
    margin-top: 18px;
}
.treehead{
    background: #E8E8E8;
}
.treehead table{
    width: 100%;
}
.treehead table td{
    line-height: 38px;
    text-align: center;
    font-size: 14px;
}
.custom-tree-node{
    width: 100%;
    font-size: 14px;
}
.add-lower-btn{
    display: inline-block;
}
.add-lower-btn .anticon{
    color: #979797;
    margin-right: 10px;
}
.tree-btn-list{
    color: #1890FF;
    float: right;
    width: 240px;
    text-align: center;
    padding-top: 10px;
}
.tree-btn-list .ant-divider{
    background: #1890FF;
}
.tree-btn-list .success{
    color: #52C41A;
}
.treebox >>> .el-tree-node__content{
    height: 62px;
    border: 1px solid transparent;
    border-bottom:1px solid #D9D9D9;
}
.treebox >>> .el-tree-node__content:hover {
    background-color: transparent;
    border: 1px solid #1890FF;
}
.edit-title-box{
    display: inline-block;
    width: 320px;
    margin-right: 30px;
}
.edit-title-box[readonly]{
    background: #f1f2f33d;
}
.edit-title-box[readonly]:hover{
    border-color: #d9d9d9;
    box-shadow: none;
}
.all-delete-box{
    margin-top: 80px;
}
</style>
