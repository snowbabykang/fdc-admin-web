<!--查看大图modal -->
<template>
    <section>
        <a-modal
            class="sourceImgModal"
            centered
            :closable = "false"
            :footer="null"
            v-model="isvisible"
            :width="700"
            @cancel = "handleCancel()"
        >
            <div class="detectionBox">
                <div class="closebox" @click = "handleCancel()">
                    <span class="closeicon"><a-icon type="close-circle" theme="filled" /></span>
                </div>
                <div class="detectionImg text-center">
                    <img :src="img" alt="">
                </div>
            </div>
        </a-modal>
    </section>
</template>

<script>
export default {
    name: 'sourceImgModal',
    props: {
        visible: { type: Boolean, default: false },   
        img: { type: String, default: '' },   
    },
    data() {
        return {
        };
    },
    computed : {         //点击背景阴影隐藏model
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
        },
    },
}
</script>
<style type="text/css">
.sourceImgModal .ant-modal-content{
    background: transparent;
    box-shadow: none;
}
</style>
<style scoped>
.detectionBox{
    background: #fff;
    position: relative;
    margin-top: 40px;
}
.closebox{
    position: absolute;
    top: -52px;
    right: 0;
    color: #000;
    cursor: pointer;
}
.closebox .closeicon{
    font-size: 26px;
}
.closebox .closeicon:after{
    content : "";
    border-right: 2px solid #000;
    position: absolute;
    top: 26px;
    right: 12px;
    height: 26px;
}
</style>
