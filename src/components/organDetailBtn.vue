<template>
<section class="content-white-box" style="margin: 0;padding-bottom: 0;">
    <a-row>
        <a-col :span="16">
             <section class="steplist" style="margin-bottom: 0;">
                <router-link class="btn" v-for="item in btnarr" :key="item.id" 
                    :class="currentStep == item.id ? 'active' : ''" :to="item.path+$route.params.id">{{item.name}}
                </router-link>
            </section>
        </a-col>
        <!-- <a-col :span="8" class="text-right"><a-button type="primary" ghost @click="linkto()">返回</a-button></a-col> -->
    </a-row>
</section>
</template>
<script>
export default {
    name: 'organDetailBtn',
    props: ['currentStep'],
    data() {
        return {
            current : this.currentStep,
            btnarr : [
                {id : 1,name : '企业认证',path : '/showCompanyInfo/'},
                {id : 2,name : '资质审核',path : '/qualityCheck/'},
                {id : 3,name : '保证金',path : '/cashDeposit/'},
                {id : 4,name : '打款信息',path : '/moneyInformation/'},
            ],
        };
    },
    methods: {
        linkto(){
            if(this.current == 1){
                this.$router.push('/companyIdentify');
            }else if(this.current == 2){
                this.$router.push('/qualityIdentify');
            }else{
                this.$router.push('/shopManage');
            }
        }
    }
};
</script>
<style scoped>

</style>