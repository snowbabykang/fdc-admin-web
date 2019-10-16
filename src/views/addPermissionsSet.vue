<template>
<section class="content-white-box">
    <div class="big-border-title">{{editid ? '编辑' : '添加'}}权限组</div> 
    <a-form :form="form" class="form-item-label-left">
        <a-form-item v-bind="formItemLayout" label="权限组">
            <a-input v-decorator="['roleName', {rules:[{required: true, message: '请输入权限组'}]}]" maxlength="30"></a-input>
        </a-form-item>
        <table class="mytable">
            <tr>
                <th colspan="2">权限设置</th>
            </tr>
            <tr v-for="(item,key) in data" :key="item.id">
                <td width="100">
                    <a-checkbox @change="checkall(item)" :indeterminate="item.checkall" :checked="item.checked">{{item.permissionName}}</a-checkbox>
                </td>
                <td>
                    <span v-for="(i,j) in item.children" :key="i.id" style="padding-right: 64px;">
                        <a-checkbox @change="changeSub(item,i)" :checked="i.checked">{{i.permissionName}}</a-checkbox >
                        <a-radio-group size="small" v-model="i.type">
                            <a-radio-button :value="1" :disabled="!i.checked">操作</a-radio-button>
                            <a-radio-button :value="0" :disabled="!i.checked">查看</a-radio-button>
                        </a-radio-group>
                    </span>
                </td>
            </tr>
        </table>
        <div class="text-center"><a-button type="primary" @click="handleSubmit">确定</a-button></div>
    </a-form>
</section>
</template>

<script>
import {getPrdtreelist, getRolepower, addRolepower, editRolepower} from '@/service/getData'
const columns = [
    {title: '权限组', dataIndex: 'roleName', },
    {title: '操作', key: 'action',scopedSlots: { customRender: 'action' }, }
];
export default {
    data () {
        return {
            editid : '',
            data: [],
            form: this.$form.createForm(this),
            formItemLayout: {
                labelCol: { span: 2 },
                wrapperCol: { span: 12 },
            },
            checkedlist : {},
            editChecked : {},    //编辑时获取的权限数组
        }
    },
    methods: {
        checkall(item){
            let checked = item.checked;
            this.$set(item, 'checked', !checked);
            for(var i in item.children){
                this.$set(item.children[i], 'checked', !checked);
                if(!checked){
                    this.$set(item.children[i], 'type', 1);
                }else{
                    this.$set(item.children[i], 'type', undefined);
                }
            }
        },
        changeSub(main,sub){
            let checked = sub.checked;
            this.$set(sub, 'checked', !checked);
            if(!checked){
                this.$set(sub, 'type', 1);
            }else{
                this.$set(sub, 'type', undefined);
            }
            this.setMaincheck(main);
        },
        setMaincheck(main){
            let length = main.children.length;
            let checkedlength = 0;
            for(var i in main.children){
                if(main.children[i].checked){
                    checkedlength++;
                }
            }
            main.checkall  = !!checkedlength && (checkedlength < length);
            main.checked = checkedlength === length;
        },
        handleSubmit(){
            let data = this.data;
            let arr = [];
            for(var i in data){
                for(var j in data[i].children){
                    if(data[i].children[j].checked){
                        arr.push({id : data[i].children[j].id, type : data[i].children[j].type});
                    }
                }
            }
            this.form.validateFields((err, values) => {
                if (!err) {
                    if(!arr.length){
                        this.$message.error('请为权限组选择权限');
                        return false;
                    }
                    if(this.editid){
                        this.edit(this.editid,values.roleName,arr);
                    }else{
                        this.add(values.roleName,arr);
                    }
                }
            });
        },
        add(name,arr){
            addRolepower(name,arr).then((res) => {
                if(res && res.code == 200){
                    this.$message.success("新增成功");
                    this.$router.push('/roleSet');
                }
            })
        },
        edit(id,name,arr){
            editRolepower(id,name,arr).then((res) => {
                if(res && res.code == 200){
                    this.$message.success("编辑成功");
                    this.GLOBAL.getPower();
                    this.$router.push('/roleSet');
                }
            })
        },
        // 获取功能列表，树结构
        getAllPowerlist(){
            getPrdtreelist().then((res) => {
                if(res && res.code == 200){
                    this.data = res.data;
                    if(this.editid){
                        this.getEditCheckedlist();
                    }
                }
            })
        },
        // 编辑时获取当前权限组原本选中的权限
        getEditCheckedlist(){
            getRolepower(this.editid).then((res) => {
                if(res && res.code == 200){
                    this.form.setFieldsValue({
                        roleName : res.data.adminRole.roleName,
                    });
                    let permissions = res.data.permissions;
                    for(var i in permissions){
                        this.editChecked[permissions[i].id] = permissions[i].permissionType;
                    }
                    this.setChecked();
                }
            })
        },
        // 编辑赋值
        setChecked(){
            let data = this.data;
            let editChecked = this.editChecked;
            for(var i in data){
                for(var j in data[i].children){
                    let id = data[i].children[j].id;
                    if(editChecked[id] == 1 || editChecked[id] == 0){
                        this.$set(data[i].children[j], 'checked', true);
                        this.$set(data[i].children[j], 'type', editChecked[id]);
                    }
                }
                this.setMaincheck(data[i]);
            }
        }
    },
    mounted(){
        this.editid = this.$route.params.id;
        this.getAllPowerlist();
    },
    
}
</script>

<style scoped>
.mytable{
    border: 1px solid #D9D9D8;
    border-bottom: none;
    width: 100%;
    margin-bottom: 64px;
}
.mytable tr th{
    background: #E8E8E8;
    padding: 8px 10px;
}
.mytable tr td{
    border-bottom: 1px solid #D9D9D8;
    padding: 14px 10px;
}
</style>
