<!-- 删除服务modal -->
<template>
    <a-modal :visible="isvisible" :id="id" :footer="null" @cancel="handleCancel" :width="760">
        <a-form :form="form" class="form-item-label-left myform">
            <a-form-item v-bind="formItemLayout" label="删除原因">
                <a-textarea v-decorator="['reason',{rules: [{ required: true, message: '请输入删除原因' }]}]" placeholder="请输入" :rows="4" class="reasonTextarea" maxlength="500"/>
            </a-form-item>
            <div class="text-center">
                <a-button type="primary" ghost @click="handleOk">确认</a-button>
            </div>
        </a-form>
    </a-modal>
</template>
<script>
import {commodityInfo,commodityInfodel} from '@/service/getData'
export default {
    name: 'refuseModal',
    props: {
        visible: { type: Boolean, default: false },   
        id:{ type: String, default: ''  },
    },
    data() {
        return {
            formItemLayout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 18 },
            },
            loading:false,
        };
    },
    computed : {       //点击背景阴影隐藏model
        isvisible : {
            get: function () {
                this.form.resetFields();
                return this.visible;
            },
            set: function () {

            }
        }
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    methods: {
        handleCancel(){
            this.$emit('update:visible', false);    // 更新visible的值
            this.$emit('cancel');   // 传递取消事件
        },
        handleOk(e) {
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                    this.$emit('update:visible', false);    // 更新visible的值
                    this.$emit('confirm',values);  // 传递确认事件
                    this.showDelate(this.id,values);
                }
            });
        },
        showDelate(id,values){
            console.log("刪除"+values.reason);
            let reason =values.reason;
            
            commodityInfodel(id,reason).then(res => {
            if(res && res.code == 200){
                this.$emit('fetch','','',1);
            }
        })
    },
    },
};
</script>
<style scoped>
.myform{
    padding-top: 42px;
}
.reasonTextarea{
    width: 520px;
}
</style>