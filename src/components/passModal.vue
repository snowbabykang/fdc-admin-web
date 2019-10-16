<!-- 通过modal -->
<template>
<a-modal :visible="isvisible" :footer="null" @cancel="handleCancel" :width="384">
    <div class="header">提示</div>
    <div class="modalinfo">
        <a-icon type="check-circle" theme="filled" />{{message}}
    </div>
    <div class="text-right">
        <a-button type="primary" @click="handleOk">确定</a-button>
        <a-button @click="handleCancel">取消</a-button>
    </div>  
</a-modal>
</template>
<script>
export default {
    name: 'passModal',
    props: {
        visible: { type: Boolean, default: false },   
        message : {type : String, default : '确认通过？'}
    },
    data() {
        return {
        };
    },
    computed : {       //点击背景阴影隐藏model
        isvisible : {
            get: function () {
                return this.visible;
            },
            set: function () {

            }
        }
    },
    methods: {
        handleCancel(){
            this.$emit('update:visible', false);    // 更新visible的值
            this.$emit('cancel');   // 传递取消事件
        },
        handleOk(e) {
            this.$emit('update:visible', false);    // 更新visible的值
            this.$emit('confirm');  // 传递确认事件
        },
    },
};
</script>
<style scoped>
.modalinfo{
    text-align: center;
    font-size:20px;
    font-weight:500;
    color:rgba(0,0,0,0.85);
    padding: 56px 0 30px;
}
.modalinfo .anticon{
    color: #52C41A;
    font-size: 30px;
    vertical-align: bottom;
    margin-right: 24px;
}
.header{
    background: #F8F8F8;
    margin: -24px;
    padding: 10px 24px;
    font-weight: 500;
    color: rgba(0,0,0,0.85);
    border-bottom: 1px solid #E1E1E1;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
</style>