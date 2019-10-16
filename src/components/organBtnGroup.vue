<template>
<section>
    <section class="content-white-box">
        <a-form layout="inline" :form="form">
            <a-form-item label="机构">
                <a-input v-decorator="['orgName']" placeholder="请输入" maxlength="50"> </a-input>
            </a-form-item>
            <a-form-item label="账号" v-if="currentStep !== 1">
                <a-input v-decorator="['account']" placeholder="请输入" maxlength="50"> </a-input>
            </a-form-item>
            <a-form-item label="状态">
                <a-select  :getPopupContainer="GLOBAL.getPopupContainer" placeholder="请选择" style="width: 160px;" v-decorator="['status']">
                    <a-select-option v-if="currentStep == 1" :value="item.id" v-for="item in allOptions" :key="item.id">{{item.name}}</a-select-option>
                    <a-select-option v-if="currentStep == 2" :value="item.id" v-for="item in companyOptions" :key="item.id">{{item.name}}</a-select-option>
                    <a-select-option v-if="currentStep == 3" :value="item.id" v-for="item in qualityOptions" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" ghost  @click="handleSubmit">查询</a-button>
            </a-form-item>
        </a-form>
    </section>
    <section class="content-white-box" style="margin: 0;padding-bottom: 0;">
        <section class="steplist">
            <router-link class="btn" v-for="item in btnarr" :key="item.id" 
                :class="currentStep == item.id ? 'active' : ''" :to="item.path">{{item.name}}
            </router-link>
        </section>
        <div class="alertinfobox">
            <div class="red">操作提示：</div>
            <ul>
                <li>·机构审核中、失败和资质审核中、失败状态，前台将不能继续浏览该店铺，但是机构依然可以编辑该店铺</li>
            </ul>
        </div>
    </section>
</section>
</template>
<script>
export default {
    name: 'organBtnGroup',
    props: ['currentStep'],
    data() {
        return {
            current : this.currentStep,
            btnarr : [
                {id : 1,name : '管理',path : '/shopManage'},
                {id : 2,name : '企业认证',path : '/companyIdentify'},
                {id : 3,name : '资质认证',path : '/qualityIdentify'},
            ],
            allOptions : [
                {id : 0, name : '所有状态'},
                {id : 1, name : '企业认证中'},
                {id : 2, name : '企业认证成功'},
                {id : 3, name : '企业认证失败'},
                {id : 4, name : '资质认证中'},
                {id : 5, name : '资质认证成功'},
                {id : 6, name : '资质认证失败'},
            ],
            companyOptions : [
                {id : 0, name : '企业认证中'},
                {id : 1, name : '企业认证成功'},
                {id : 2, name : '企业认证失败'},
            ],
            qualityOptions : [
                {id : 0, name : '资质认证中'},
                {id : 1, name : '资质认证成功'},
                {id : 2, name : '资质认证失败'},
            ],
        };
    },
    beforeCreate () {
        this.form = this.$form.createForm(this);
    },
    methods : {
        handleSubmit(){
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.$emit('confirm',values);  // 传递确认事件
                }
            });
        }
    }
};
</script>
<style scoped>

</style>