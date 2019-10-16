<template>
    <section>
        <section class="centerInfoBox">
            <div class="tablebox">
                <div class="table-cell center-imgbox">
                    <div class="center-img">
                        <a-avatar :size="134" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    </div>
                </div>
                <div class="table-cell">
                    <div class="status-list">
                        <span class="test-title">{{title}}</span>
                        <a-tag :color="item.status" v-for="item in status_list" :key="item.name">{{item.name}}</a-tag>
                    </div>
                    <div class="manageinfo">管理权限：{{manageName}}</div>
                    <div><router-link to="/approveQuality"><a-button type="primary">资质提交</a-button></router-link></div>
                </div>
            </div>
        </section>
        <section>
            <div class="cashtitle">保证金提交</div>
            <div class="cashDepositbox">
                <a-row class="companytitle">
                    <a-col :span="3" align="right"><span class="companyBorder">公司账号：</span></a-col> <a-col :span="16">{{companyInfo.account}}</a-col>
                    <a-col :span="5" align="right"><span class="statusname blue">审核中</span></a-col>
                </a-row>
                <a-row> <a-col :span="3" align="right">开户银行：</a-col> <a-col>{{companyInfo.bank}}</a-col> </a-row>
                <a-row> <a-col :span="3" align="right">开户名：</a-col> <a-col>{{companyInfo.bankname}}</a-col> </a-row>
                <a-row> 
                    <a-col :span="3" align="right">金额：</a-col> 
                    <a-col><span class="price">{{companyInfo.amount}}</span>RMB</a-col> 
                </a-row>
                <a-row type="flex" align="middle"> 
                    <a-col :span="3" align="right">打款时间：</a-col> 
                    <a-col><a-date-picker @change="onChange" placeholder="打款时间"/></a-col> 
                </a-row>
                <a-row> 
                    <a-col :span="3" align="right">上传凭证：</a-col> 
                    <a-col>
                        <div class="tablebox">
                            <div class="table-cell">
                                <a-upload
                                    name="avatar"
                                    listType="picture-card"
                                    class="avatar-uploader"
                                    :showUploadList="false"
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    :beforeUpload="beforeUpload"
                                    @change="handleChange"
                                  >
                                    <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
                                    <div v-else>
                                        <a-icon :type="loading ? 'loading' : 'plus'" />
                                        <div class="ant-upload-text">上传</div>
                                    </div>
                                </a-upload>
                            </div>
                            <div class="table-cell">
                                <div>上传凭证：上传保证金打款凭证照片</div>
                                <div>格式支持.png\jpg\jepg\bmp\raw\pdf</div>
                            </div>
                        </div>
                    </a-col> 
                </a-row>
                <a-row> 
                    <a-col :span="24" :offset="1">
                        <a-radio>保证金协议</a-radio>
                    </a-col> 
                </a-row>
                <div class="text-right submitbtn">
                    <a-button type="primary">提交</a-button>
                </div>
            </div>  
        </section>

    </section>
</template>

<script>
function getBase64 (img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}
export default {
    name: 'Home',
    data () {
        return {
            title : "美轮检测中心",
            status_list : [
                {name : '认证中',status : 'blue'},
                {name : '资质审核',status : ''},
                {name : '保证金',status : ''},
            ],
            manageName : "管理员",
            companyInfo : {
                account : "11111",
                bank : "招商银行",
                bankname : "333",
                amount : "500.00",

            },
            loading: false,
            imageUrl: '',
        }
    },
    methods: {
        onChange(date, dateString) {
          console.log(date, dateString);
        },
        handleChange (info) {
            if (info.file.status === 'uploading') {
                this.loading = true
                return
            }
            if (info.file.status === 'done') {
            // Get this url from response in real world.
                getBase64(info.file.originFileObj, (imageUrl) => {
                    this.imageUrl = imageUrl
                    this.loading = false
                })
            }
        },
        beforeUpload (file) {
            const isJPG = file.type === 'image/jpeg'
            if (!isJPG) {
                this.$message.error('You can only upload JPG file!')
            }
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isLt2M) {
                this.$message.error('Image must smaller than 2MB!')
            }
            return isJPG && isLt2M
        },
    },
}
</script>
<style scoped lang="less">
.centerInfoBox{
    background: #FAFAFA;
    padding: 40px 32px;
    margin-bottom: 42px;
}
.status-list{
    line-height: 1;
}
.status-list .test-title{
    font-size:34px;
    font-weight:800;
    color: #000;
    padding-right: 30px;
    vertical-align: middle;
}
.status-list .ant-tag{
    padding: 0px 20px;
    line-height: 24px;
    height: 24px;
    background: transparent;
}
.center-imgbox{
    padding-right: 20px;
}
.center-img{
}
.manageinfo{
    font-size:24px;
    color: #333;
    padding: 30px 0 24px 0;
}
.cashtitle{
    font-size:20px;
    color: rgba(0,0,0,0.65);
    font-weight: 500;
}
.cashDepositbox{
    border: 1px solid #DBDBDB;
    padding: 32px 42px 42px 20px;
}
.companytitle{
    font-size:16px;
    font-weight: 500;
    color: rgba(0,0,0,0.65);
}
.price{
    color: #E6242E;
    font-size: 16px;
    font-weight: 500;
    padding-right: 14px;
}
.cashDepositbox .ant-row,.cashDepositbox .ant-row-flex{
    margin-bottom: 14px;
}
.avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
}
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
.submitbtn{
    margin-top: 164px;
}
.statusname{
    font-weight: normal;
    font-size: 14px;
}
.blue{
    color: #1890FF;
}
.success{
    color: #52C41A;
}
.red{
    color: #F5222D;
}
.companyBorder{
    padding-left: 15px;
    border-left: 2px solid @primary-color;
}
.cashDepositbox .ant-col-3{
    width: 100px;
}
</style>
