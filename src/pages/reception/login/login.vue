<template>
  <div id="login" v-loading="loading">
    <div class="shadow">
      <ul class="header">
        <li class="logo" @click="goHp"></li>
        <li class="line"></li>
        <li class="lable">欢迎登录</li>
      </ul>
    </div>
    <div class="login-content">
      <div style="margin-top:35px;margin-bottom:40px;">
        <span class="login-titel" :class="{ active: isActive }" @click="changeAccount">账号登录</span>
        <span class="login-titel" :class="{ active: isActiveCode }" @click="changeCode">验证码登录</span>
      </div>
      <div v-if="isActive" key="1">
        <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" class="demo-ruleForm">
          <el-form-item prop="phoneNumber" :rules="isActive === true ? rules1.phoneNumber:[]">
            <el-input type="" v-model="ruleForm1.phoneNumber" auto-complete="off" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="password" :rules="isActive === true ? rules1.password:[]">
            <el-input type="password" v-model="ruleForm1.password" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item v-if="needVerify">
            <verify :phoneNumber="ruleForm1.phoneNumber" @verifySuccess="rule1VerifySuccess"></verify>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitPassWord('ruleForm1')" style="width:100%">登录</el-button>
          </el-form-item>
          <div style="text-align:right;margin-top:35px;margin-bottom:60px">
            <span class="login-password" @click="goForget">忘记密码?</span>
            <span class="login-register" @click="goRegister">免费注册></span>
          </div>
        </el-form>
      </div>
      <div v-if="isActiveCode" key="2">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
          <el-form-item prop="phoneNumber" :rules="isActiveCode === true ? rules2.phoneNumber:[]">
            <el-input type="" v-model="ruleForm2.phoneNumber" auto-complete="off" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="verifyCode" :rules="isActiveCode === true ? rules2.verifyCode:[]">
            <el-input type="" v-model="ruleForm2.verifyCode" auto-complete="off" placeholder="短信验证码" style="width:200px"></el-input>
            <span class="send-code" @click="sendCode">{{count}}</span>
          </el-form-item>
          <el-form-item v-if="needVerify">
            <verify :phoneNumber="ruleForm2.phoneNumber" @verifySuccess="rule2VerifySuccess"></verify>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm2')" style="width:100%">登录</el-button>
          </el-form-item>
          <div style="text-align:right;margin-top:35px;margin-bottom:60px">
            <span class="login-password" @click="goForget">忘记密码?</span>
            <span class="login-register" @click="goRegister">免费注册></span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import { sendSmsCode, login } from '@/api/reception/register/register'
  import verify from '@/components/common/login/verify.vue'
  import { setCustomerLevel, setToken, setUserId, setCompanyId, setVerifyNum, getVerifyNum, removeVerifyNum, setUserInfo, setCompanyStatus, setCompanyName, setCompanyFlag, setAccountFlag, setPhoneNumber, setUserName } from '@/utils/auth'
  export default {
    name: 'login',
    data () {
      return {
        needVerify: false,
        isActive: true,
        isActiveCode: false,
        showDialog: false,
        loading: false,
        count: '发送验证码',
        timeCode: 90,
        timer: null,
        ruleForm1: {
          phoneNumber: '',
          password: '',
        },
        ruleForm2: {
          phoneNumber: '',
          verifyCode: '',
        },
        rules1: {
          phoneNumber: [
            { required: true, message: '请输入手机号码', trigger: 'change' },
            { pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入正确手机号码格式！', trigger: 'change' }
          ],
          password: [
            { required: false, message: '请输入密码', trigger: 'change' },
          ]
        },
        rules2: {
          phoneNumber: [
            { required: true, message: '请输入手机号码', trigger: 'change' },
            { pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入正确手机号码格式！', trigger: 'change' }
          ],
          verifyCode: [
            { required: true, message: '请输入密码', trigger: 'change' },
            { min: 6, max: 6, message: '验证码长度在6个字符', trigger: 'change' },
          ]
        },
        // 主账号下的权限列表
        menuList: {
          // 账户中心 -- 主账号
          account: {
            name: '账户中心',
            url: 'setting/accountSetting',
            menuList: [
              {
                name: '认证信息',
                url: 'setting/accountSetting',
                selected: '1'
              },
              {
                name: '收货地址',
                url: 'setting/accountSetting/shippingAddress'
              },
              {
                name: '子账号管理',
                url: 'setting/accountSetting/subaccount'
              },
              {
                name: '安全设置',
                url: 'setting/accountSetting/securitySetting'
              }
            ]
          },
          // 账户中心 -- 子账号
          account2: {
            name: '账户中心',
            url: 'setting/accountSetting',
            menuList: [
              {
                name: '认证信息',
                url: 'setting/accountSetting',
                selected: '1'
              },
              {
                name: '收货地址',
                url: 'setting/accountSetting/shippingAddress'
              },
              {
                name: '安全设置',
                url: 'setting/accountSetting/securitySetting'
              }
            ]
          },
          // 供方中心
          supplier: {
            name: '供方中心',
            url: 'setting/supplier',
            menuList: [
              {
                name: '方案管理',
                url: 'setting/supplier'
              },
              {
                name: '锁货通知',
                url: 'setting/supplier/lockGood'
              },
              {
                name: '订单执行',
                url: 'setting/supplier/orderExecute'
              },
              {
                name: '发货管理',
                url: 'setting/supplier/deliveryManagement'
              }
            ]
          },
          // 需方中心
          buyer: {
            name: '需方中心',
            url: 'setting/buyer',
            menuList: [
              {
                name: '需求管理',
                url: 'setting/buyer',
                menuList: [
                  {
                    name: '发布需求',
                    url: 'setting/buyer'
                  },
                  {
                    name: '需求记录',
                    url: 'setting/buyer/requirement'
                  }
                ]
              },
              {
                name: '订单执行',
                url: 'setting/buyer/contract'
              }
            ]
          }
        }
      }
    },
    created () {

    },
    methods: {
      goHp () {
        this.$router.push({path: '/'})
      },
      rule1VerifySuccess () {
        this.needVerify = false
      },
      rule2VerifySuccess () {
        this.needVerify = false
      },
      submitPassWord(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let num = Number(getVerifyNum()) || 0
            setVerifyNum(Number(num + 1))
            let params = {
              phoneNumber: this.ruleForm1.phoneNumber,
              password: this.ruleForm1.password,
              type: 0
            }
            if (!this.needVerify) {
              login(params).then((res) => {
                if (res.data.code === 200) {
                  setToken(res.data.data.token)
                  setUserId(res.data.data.userId)
                  setCompanyId(res.data.data.companyId)
                  setCompanyStatus(res.data.data.companyStatus)
                  setCompanyName(res.data.data.companyName)
                  setCompanyFlag(res.data.data.companyFlag)
                  setAccountFlag(res.data.data.accountFlag)
                  setCustomerLevel(res.data.data.customerLevel)
                  setPhoneNumber(res.data.data.phoneNumber)
                  setUserName(res.data.data.userName)
                  // 更改menuList
                  // 是否认证 accountFlag  1-未认证 2-认证中 3-已认证
                  if (res.data.data.accountFlag !== '3') {
                    res.data.data.menuList = {}
                    res.data.data.menuList.account = {
                      name: '账户中心',
                      url: 'setting/accountSetting',
                      menuList: [
                        {
                          name: '安全设置',
                          url: 'setting/accountSetting/securitySetting'
                        }
                      ]
                    }
                  } else {
                    // 为供方主账号
                    if (res.data.data.accountType === '10') {
                      let menuList = {}
                      menuList.supplier = this.menuList.supplier
                      menuList.account = this.menuList.account
                      res.data.data.menuList = menuList
                    } else if (res.data.data.accountType === '20') {
                      // 为需方主账号
                      let menuList = {}
                      menuList.buyer = this.menuList.buyer
                      menuList.account = this.menuList.account
                      res.data.data.menuList = menuList
                    } else {
                      // 为供/需方子账号
                      // menuList 为空
                      if (res.data.data.menuList === null) {
                        res.data.data.menuList = {}
                        res.data.data.menuList.account = this.menuList.account2
                      } else {
                        res.data.data.menuList = this.changeMenuList(res.data.data.menuList)
                      }
                    }
                  }
                  // 存储用户信息
                  setUserInfo(JSON.stringify(res.data.data))
                  this.$message({
                    message: '登录成功',
                    type: 'success'
                  })
                  removeVerifyNum(num)
                  this.loading = true
                  setTimeout(() => {
                    this.loading = false
                    // this.$router.push({ path: '/' })
                    window.location.href = '/'
                  }, 3000)
                } else if (num > 2) {
                  this.needVerify = true
                  this.$message({
                    message: res.data.data,
                    type: 'error'
                  })
                } else {
                  this.$message({
                    message: res.data.data,
                    type: 'error'
                  })
                }
              })
            } else {
              this.$message({
                message: '请先通过滑动验证码！',
                type: 'error'
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let num = Number(getVerifyNum()) || 0
            setVerifyNum(Number(num + 1))
            let params = {
              phoneNumber: this.ruleForm2.phoneNumber,
              password: this.ruleForm2.verifyCode,
              type: 1
            }
            if (!this.needVerify) {
              login(params).then((res) => {
                if (res.data.code === 200) {
                  setToken(res.data.data.token)
                  setUserId(res.data.data.userId)
                  setCompanyId(res.data.data.companyId)
                  setCompanyStatus(res.data.data.companyStatus)
                  setCompanyName(res.data.data.companyName)
                  setCompanyFlag(res.data.data.companyFlag)
                  setAccountFlag(res.data.data.accountFlag)
                  setCustomerLevel(res.data.data.customerLevel)
                  setPhoneNumber(res.data.data.phoneNumber)
                  setUserName(res.data.data.userName)
                  // 更改menuList
                  // 是否认证 accountFlag  1-未认证 2-认证中 3-已认证
                  if (res.data.data.accountFlag !== '3') {
                    res.data.data.menuList = {}
                    res.data.data.menuList.account = {
                      name: '账户中心',
                      url: 'setting/accountSetting',
                      menuList: [
                        {
                          name: '安全设置',
                          url: 'setting/accountSetting/securitySetting'
                        }
                      ]
                    }
                  } else {
                    // 为供方主账号
                    if (res.data.data.accountType === '10') {
                      let menuList = {}
                      menuList.supplier = this.menuList.supplier
                      menuList.account = this.menuList.account
                      res.data.data.menuList = menuList
                    } else if (res.data.data.accountType === '20') {
                      // 为需方主账号
                      let menuList = {}
                      menuList.buyer = this.menuList.buyer
                      menuList.account = this.menuList.account
                      res.data.data.menuList = menuList
                    } else {
                      // 为供/需方子账号
                      // menuList 为空
                      if (res.data.data.menuList === null) {
                        res.data.data.menuList = {}
                        res.data.data.menuList.account = this.menuList.account2
                      } else {
                        res.data.data.menuList = this.changeMenuList(res.data.data.menuList)
                      }
                    }
                  }
                  console.log(9999, res.data.data)
                  // 存储用户信息
                  setUserInfo(JSON.stringify(res.data.data))
                  this.$message({
                    message: '登录成功',
                    type: 'success'
                  })
                  removeVerifyNum(num)
                  this.loading = true
                  setTimeout(() => {
                    this.loading = false
                    // this.$router.push({ path: '/' })
                    window.location.href = '/'
                    // console.log(JSON.stringify(res.data.data))
                  }, 3000)
                } else if (num > 2) {
                  this.needVerify = true
                  this.$message({
                    message: res.data.data,
                    type: 'error'
                  })
                } else {
                  this.$message({
                    message: res.data.data,
                    type: 'error'
                  })
                }
              })
            } else {
              this.$message({
                message: '请先通过滑动验证码！',
                type: 'error'
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      changeAccount() {
        this.isActive = true
        this.isActiveCode = false
      },
      changeCode() {
        this.isActive = false
        this.isActiveCode = true
      },
      sendCode() {
        let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
        if (this.ruleForm2.phoneNumber.length !== 11) {
          this.$message({
            message: '请输入正确的手机号码！',
            type: 'error'
          })
          return false
        } else if (!myreg.test(this.ruleForm2.phoneNumber)) {
          this.$message({
            message: '请输入正确的手机号码！',
            type: 'error'
          })
          return false
        }
        let parmas = {
          templateCode: 'SMS_126700019',
          phoneNumber: this.ruleForm2.phoneNumber,
          operationType: 'login'
        }
        sendSmsCode(parmas).then((res) => {
          if (res.data && res.data.code === 200) {
            const time = 90
            if (!this.timer) {
              this.count = `重新发送${this.timeCode}s`
              this.timer = setInterval(() => {
                if (this.timeCode > 0 && this.timeCode <= time) {
                  this.timeCode = this.timeCode - 1
                  this.count = `重新发送${this.timeCode}s`
                } else {
                  clearInterval(this.timer)
                  this.timer = null
                  this.count = '发送验证码'
                  this.timeCode = 90
                }
              }, 1000)
            }
          } else {
            this.$message({
              message: res.data.data,
              type: 'error'
            })
            return false
          }
        })
      },
      goRegister() {
        this.$router.push({ path: '/register' })
      },
      goForget() {
        this.$router.push({ path: '/forget' })
      },
      // 把 munuList（数组）改为对象
      changeMenuList(menuList) {
        if (menuList === null) {
          return
        }
        let list = {}
        for (var i = 0; i < menuList.length; i++) {
          let name = menuList[i].name
          if (name === '需方中心') {
            list.buyer = menuList[i]
          } else if (name === '供方中心') {
            list.supplier = menuList[i]
          }
          // else if (name === '账户中心') {
          //   list.account = menuList[i]
          // }
        }
        if (list.supplier) {
          list.supplier.menuList = this.filtrateData(list.supplier.menuList)
        }
        if (list.buyer) {
          list.buyer.menuList = this.filtrateData(list.buyer.menuList)
        }
        // if (list.account) {
        //   list.account.menuList = this.filtrateData(list.account.menuList)
        //   list.account.menuList.push(
        //     {
        //       name: '安全设置',
        //       url: 'setting/accountSetting/securitySetting',
        //       selected: '1'
        //     }
        //   )
        // }
        list.account = this.menuList.account2
        return list
      },
      // 筛选supplier, buyer, account中selected值为‘1’的数据
      filtrateData(data) {
        let arr = []
        for (var i = 0; i < data.length; i++) {
          if (data[i].selected === '1') {
            if (data[i].menuList) {
              let menuList = data[i].menuList
              let arr2 = []
              for (var j = 0; j < menuList.length; j++) {
                if (menuList[j].selected === '1') {
                  arr2.push(menuList[j])
                }
              }
              data[i].menuList = arr2
            }
            arr.push(data[i])
          }
        }
        return arr
      }
    },
    components: {
      verify
    }
  }
</script>
<style scoped lang="scss">
  #login{
    margin: 0 auto;
    .shadow{
      box-shadow: 0 5px 5px 0 rgba(0,0,0,0.05);
      .header{
        width: 1200px;
        margin: 0 auto;
        height:80px;
        background: #FFFFFF;
        padding:13px 0;
        li{
          float:left;
        }
        .logo{
          width:164px;
          height:54px;
          background:url(../../../assets/person/securitySettings/logo2x.png) no-repeat;
          background-size:contain;
        }
        .line{
          height:40px;
          border-left: 1px solid #C0C0C0;
          margin:8px 20px;
        }
        .lable{
          height:54px;
          line-height:54px;
          font-size: 18px;
          color: #333333;
          font-family: PingFangSC-Semibold;
        }
        .back{
          float:right;
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: #333333;
          text-align: right;
          height:54px;
          line-height:54px;
        }
      }
    }
    .login-content{
      width: 350px;
      margin: 0 auto;
      margin-top:100px;
      height: 700px;
    }
    .active {
      border-bottom: 4px solid #25B369;
      font-size: 22px !important;
      color: #333333 !important;
      padding: 5px 0;
    }
    .login-titel {
      font-size: 19px;
      color: #999999;
      height: 28px;
      line-height: 28px;
      margin-right: 42px;
    }
    .send-code{
      margin-left: 7px;
      background: #DDDDDD;
      padding:10px 29px;
      border: 1px solid #CCCCCC;
      border-radius: 2px;
    }
    .login-password{
      font-size: 14px;
      color: #333333;
      margin-right: 6px;
    }
    .login-register{
      font-size: 14px;
      color: #FF7515;
    }
    .el-form-item__error{
      color: #EB0700;
    }
  }
</style>
