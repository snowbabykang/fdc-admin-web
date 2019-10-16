<template>
  <div>
    <div class="huiyuan-manage">
      账号
      <a-input class="shuru-huiyuan" v-model="forminfo.zhanghao" placeholder="请输入"/>
      <a-button class="findhuiyuan" @click="searchZhanghao()" type="primary" ghost>查询</a-button>
    </div>
    <div class="huiyuan-table">
      <div class="huiyuan-attention">
        <div style="color:red;">操作提示 :</div>
        <div style="color:rgba(153, 153, 153, 1);">· 通过会员管理，你可以进行查看会员操作</div>
        <div style="color:rgba(153, 153, 153, 1);">· 你可以根据条件搜索会员，然后选择相应的操作</div>
      </div>
      <a-button v-if="checkPower()"
        type="primary"
        class="editable-add-btn"
        @click="showModal"
        style="float:right;margin-right:10px;"
      >新增+</a-button>
      <a-modal
        title
        v-model="visible"
        @ok="handleOk"
        :footer="null"
        centered
        :width="340"
        :closable="false"
      >
        <a-form :form="form" layout="horizontal" @submit="handleSubmit" class="verify-form">
          <a-col></a-col>
          <a-col>
            <a-alert
              v-if="errormsg"
              class="errormsgbox"
              type="error"
              :message="errormsg"
              closable
              showIcon
              :afterClose="handleClose"
            />
          </a-col>
          <a-form-item
            label
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
          >
            <a-input
              size="large"
              v-model="forminfo.phone"
              @keyup="checkIsShowBtn"
              @blur="validatePhone"
              placeholder="请输入手机号"
              class="huiyuan-phone"
            ></a-input>
            <span
              style="font-size:12px;width:240px;margin-left: 6px;color:rgba(153, 153, 153, 1);"
            >默认密码为 jiance</span>
          </a-form-item>
          <a-form-item
            label
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            class="code-form-item"
          >
            <a-row :gutter="8">
              <a-col :span="14">
                <a-input
                  size="large"
                  v-model="forminfo.captcha"
                  @change="validateCaptcha"
                  placeholder="手机验证码"
                  class="huiyuan-yanzheng"
                ></a-input>
              </a-col>
              <a-col :span="10">
                <a-button
                  size="large"
                  class="verifybtn"
                  disabled
                  v-if="!isGetCaptcha"
                >{{captchaBtn}}</a-button>
                <a-button size="large" class="verifybtn blackbtn" v-else @click="getCaptha()">获取验证码</a-button>
              </a-col>
            </a-row>
          </a-form-item>
          <!-- <a-checkbox >《FDC》协议</a-checkbox> -->
          <a-form-item>
            <a-checkbox
              style="color:rgba(35,0,168,1);margin-left:6px;"
              clearable="true"
              :checked="checked"
              @change="onChange" 
              
            ></a-checkbox><span @click="openNote()" style="color:rgba(35,0,168,1);cursor:pointer;">《FDC》协议</span>
          </a-form-item>
          <a-form-item style="text-align: center;">
            <a-button
              type="primary"
              html-type="submit"
              class="submitbtn"
              :disabled="!isSubmitBtn"
            >注册</a-button>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-table
        :columns="columns"
        :dataSource="data"
        :rowKey="record => record.id"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template slot="flag" slot-scope="flag">{{statusArr[flag]}}</template>
        <span slot="action" slot-scope="record">
          <span class="btn-link" @click="showDetail(record.id)">查看</span>
        </span>
      </a-table>
    </div>
    <openNoteModal :visible.sync="openNoteVisible"></openNoteModal>
  </div>
</template>

<script>
import { getMember, getRegister, getsendNote } from "@/service/getData";
import openNoteModal from "../components/openNoteModal";
const formItemLayout = {};
const columns = [
  {
    title: "会员账号",
    dataIndex: "phone"
  },
  {
    title: "姓名",
    dataIndex: "name"
  },
  {
    title: "注册时间",
    dataIndex: "createTime"
  },
  {
    title: "个人认证状态",
    dataIndex: "flag",
    scopedSlots: { customRender: "flag" }
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

let renzheng;
let phone = "";
let data = [];
export default {
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      openNoteVisible: false,
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false,
      formItemLayout,
      checked: true,
      form: this.$form.createForm(this),
      pagination: {},
      loading: false,
      statusArr: { 1: "已认证", null: "未认证" },
      forminfo: {
        zhanghao: "",
        phone: "",
        captcha: ""
      },
      isGetCaptcha: false, //是否可点击获取验证码
      isSubmitBtn: false, //是否可点击提交按钮
      errormsg: "",
      captchaBtn: "获取验证码",
      countdown: 60
    };
  },
  components: {
    openNoteModal
  },
  mounted() {
    this.fetch(phone, 1);
  },
  methods: {
    handleChange() {},
    handleClose() {
      this.errormsg = "";
    },
    openNote(){
      this.openNoteVisible =true;
    },
    showModal() {
      this.visible = true;
      this.forminfo = {
        zhanghao: "",
        phone: "",
        captcha: ""
      };
      this.errormsg = '';
    },
    showDetail(id) {
      this.$router.push("/memberDetail/" + id);
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    searchZhanghao() {
      this.pagination.current = 1;
      this.handleTableChange(this.pagination);
    },
    onChange(e) {
      let phone = this.forminfo.phone;
      let captcha = this.forminfo.captcha;
      this.checked = e.target.checked;
      this.isSubmitBtn =
        captcha && captcha.length == 6 && this.validatePhone() && this.checked
          ? true
          : false;
    },
    handleTableChange(pagination) {
      let phone = this.forminfo.zhanghao;
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch(phone, pagination.current);
    },
    fetch(phone, page) {
      this.loading = true;
      getMember(phone, page).then(res => {
        if (res && res.code == 200) {
          const pagination = { ...this.pagination };
          pagination.total = res.data.total;
          this.loading = false;
          this.data = res.data.list;
          this.pagination = pagination;
        }
      });
    },
    checkIsShowBtn() {
      let phone = this.forminfo.phone;
      if (phone.length !== 11) {
        this.isGetCaptcha = false;
        this.isSubmitBtn = false;
      }
    },
    validatePhone() {
      let phone = this.forminfo.phone;
      let captcha = this.forminfo.captcha;
      const reg = /^1[3456789][0-9]{9}$/;
      if (reg.test(phone)) {
        this.isGetCaptcha = true;
        this.errormsg = "";
        this.isSubmitBtn = captcha && captcha.length == 6 ? true : false;
        return true;
      } else {
        this.isGetCaptcha = false;
        this.isSubmitBtn = false;
        this.errormsg = phone ? "账号手机号位数有误" : "账号手机号位数有误";
        return false;
      }
    },
    validateCaptcha() {
      let phone = this.forminfo.phone;
      let captcha = this.forminfo.captcha;
      this.isSubmitBtn =
        captcha && captcha.length == 6 && this.validatePhone() ? true : false;
    },
    settime() {
      let that = this;
      if (that.countdown == 0) {
        that.isGetCaptcha = true;
        that.captchaBtn = "获取验证码";
        that.countdown = 60;
      } else {
        that.isGetCaptcha = false;
        that.captchaBtn = "重新发送（" + that.countdown + "）";
        that.countdown--;
        setTimeout(function() {
          that.settime();
        }, 1000);
      }
    },
    //获取验证码
    getCaptha() {
      let phone = this.forminfo.phone;
      getsendNote(phone).then(res => {
        if (res && res.code == 200) {
          console.log(res);
          this.settime();
        }
      });
    },
    handleSubmit(e) {
      if (!this.checked) {
        this.isShow = true;
        this.messages = "哎呀~！请勾选协议";
        return;
      }
      e.preventDefault();
      let info = this.forminfo;
      getRegister(info.captcha, info.phone).then(res => {
        if (res && res.code == 200) {
          console.log(res);
          this.visible = false;
          this.pagination.current = 1;
          this.handleTableChange(this.pagination);
        }
      });
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    }
  }
};
</script>

<style scoped>
.errormsg {
  height: 40px;
}
.errormsgbox {
  width: 280px;
  height: 40px;
  line-height: 40px;
  margin-left: 6px;
}
.errormsgbox.ant-alert {
  font-size: 14px;
  line-height: 24px;
}
.errormsgbox >>> .ant-alert-icon {
  top: 13px;
}
.errormsgbox >>> .ant-alert-close-icon {
  top: 9px;
}
.ant-btn {
  border-radius: 4px;
}
.ant-input {
  width: 240px;
  margin: 0 8px 8px 42px;
  font-size: 14px;
}
.findhuiyuan {
  width: 74px;
  height: 31px;
  margin-left: 42px;
}
.huiyuan-manage {
  padding-top: 24px;
  padding-left: 32px;
  background: white;
  padding-bottom: 24px;
}
.shuru-huiyuan {
  margin-left: 12px;
}
.huiyuan-attention {
  width: 470px;
  font-size: 12px;
  display: inline-block;
  padding-bottom: 21px;
}
.huiyuan-attention div {
  padding-bottom: 10px;
}
.huiyuan-table {
  padding-top: 20px;
  background: white;
  padding-left: 32px;
  padding-right: 32px;
  margin-top: 10px;
}
.editable-add-btn {
  margin-top: 25px;
  background-color: #1890ff;
  color: white;
}
.huiyuan-phone {
  width: 280px;
  height: 32px;
  margin-top: 10px;
}
.blackbtn {
  background: white;
  color: rgba(24, 144, 255, 1);
  border-color: rgba(24, 144, 255, 1);
  width: 102px;
  height: 32px;
}
.ant-form-item {
  margin-bottom: 17px;
}
.verifybtn {
  margin-left: 8px;
  width: 102px;
  padding: 0;
  height: 32px;
  font-size: 14px;
}
.ant-modal-body {
  padding: 27px 30px 32px 30px;
}
.ant-form-item-control {
  width: 200px;
}
.huiyuan-yanzheng {
  width: 170px;
  height: 32px;
  margin-right: 8px;
}
.submitbtn {
  width: 102px;
  margin-top: 20px;
}
.verify-form .ant-input,
.code-form-item .ant-input {
  margin-left: 6px;
  margin-bottom: 0px;
}
</style>
