<template>
  <div>
    <div class="huiyuan-block">
      <div class="huiyuan-info">个人信息</div>
      <div class="huiyuan-zhanghao huiyuan">
        <span>会员账号:</span>
        <span>{{item.phone}}</span>
      </div>
      <div class="huiyuan-time huiyuan">
        <span>注册时间:</span>
        <span>{{item.createTime}}</span>
      </div>
    </div>
    <div class="huiyuan-block" v-if="item.flag!=null">
      <div class="huiyuan-info">个人认证</div>
      <div class="huiyuan-name huiyuan">
        <span>姓名:</span>
        <span>{{item.name}}</span>
      </div>
      <div class="huiyuan-idcard huiyuan">
        <span>身份证号:</span>
        <span>{{item.identityCode}}</span>
      </div>
      <div class="huiyuan-bank huiyuan">
        <span>银行卡号:</span>
        <span>{{item.bankAcount}}</span>
      </div>
      <div class="huiyuan-phone huiyuan">
        <span>预留手机号:</span>
        <span>{{item.reservedPhone}}</span>
      </div>
    </div>
    <div class="huiyuan-block" v-else>
      <div class="huiyuan-info1">个人认证</div>
      <section class="content-white-box">
        <noData message="哎呀！当前还暂未认证" />
      </section>
    </div>
  </div>
</template>

<script>
import noData from "../components/noData";
import { getDetail } from "@/service/getData";
export default {
  data() {
    return {
      isInfo: true,
      item: {}
    };
  },
  components: {
    noData
  },
  created() {
    let str, num;
    (str = location.href), (num = str.split("memberDetail/")[1]);
    console.log(num);
    getDetail(num).then(res => {
      if (res && res.code == 200) {
        console.log(res.data);
        var item = res.data;
        this.item = item;
      }
    });
  }
};
</script>

<style scoped>
.huiyuan-info {
  border-bottom: 1px solid #d9d9d9;
  height: 70px;
  padding-top: 25px;
  padding-left: 30px;
  font-size: 16px;
  font-weight: bold;
}
.huiyuan-info1 {
  height: 70px;
  padding-top: 25px;
  padding-left: 30px;
  font-size: 16px;
  font-weight: bold;
}
.huiyuan-block {
  background: white;
  padding-bottom: 30px;
  margin-bottom: 10px;
}
.huiyuan-block .huiyuan {
  margin-left: 30px;
  margin-right: 30px;
  height: 62px;
  line-height: 62px;
  border-bottom: 1px solid #d9d9d9;
}
.huiyuan span {
  width: 217px;
  display: inline-block;
}
</style>
