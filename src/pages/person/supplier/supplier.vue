<template>
  <div class="supplier">
    <div class="supplier-body">
      <div class="supplier-content clearfix">
        <div class="supplier-left f-l">
          <el-menu
            :default-active="route"
            class="el-menu-demo" @select="selectNav" style="margin-top:10px">
            <el-menu-item v-for="item in supplierMenuList" :index="item.url" :key="item.url">
              <i v-if="item.url === 'setting/supplier'" class="iconfont classify-icon">&#xe62f;</i>
              <i v-if="item.url === 'setting/supplier/lockGood'" class="iconfont classify-icon">&#xe61c;</i>
              <i v-if="item.url === 'setting/supplier/orderExecute'" class="iconfont classify-icon">&#xe606;</i>
              <i v-if="item.url === 'setting/supplier/deliveryManagement'" class="iconfont classify-icon">&#xe61b;</i>
              {{ item.name }}
            </el-menu-item>
            <!--<el-menu-item index="lockGood"><i class="iconfont classify-icon">&#xe61c;</i>锁货通知</el-menu-item>-->
            <!--<el-menu-item index="lockGood"><i class="iconfont classify-icon">&#xe606;</i>订单执行</el-menu-item>-->
            <!--<el-menu-item index="deliveryManagement"><i class="iconfont classify-icon">&#xe61b;</i>发货管理</el-menu-item>-->
            <!-- <el-submenu index="">
              <template slot="title">报表查询</template>
              <el-menu-item index="">订单执行情况</el-menu-item>
              <el-menu-item index="">发运签收情况</el-menu-item>
            </el-submenu> -->
          </el-menu>
        </div>
        <div class="supplier-right f-l">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUserInfo } from '@/utils/auth'
  export default {
    name: 'supplier',
    components: {
    },
    data() {
      return {
        route: '',
        supplierMenuList: getUserInfo().menuList.supplier.menuList
      }
    },
    beforeMount() {
    },
    mounted() {
      // this.activeMenu()
      // console.log(88888, getUserInfo())
      this.route = this.$route.path.slice(1)
      // 子账户 ~ 跳转至可用权限下第一个路由
      if (getUserInfo().accountType !== '11') {
        return
      }
      let obj = this.supplierMenuList[0]
      let path
      if (obj.menuList) {
        path = obj.menuList[0].url
      } else {
        path = obj.url
      }
      this.$router.push(`/${path}`)
      this.route = path
    },
    methods: {
      selectNav(index) {
        this.$router.push(`/${index}`)
      },
      // // 首次进入 || 路由变化菜单栏焦点函数
      // activeMenu() {
      //   if (this.$route.path.indexOf('lockGood') !== -1) {
      //     this.route = 'setting/supplier/lockGood'
      //   } else if (this.$route.path.indexOf('orderExecute') !== -1) {
      //     this.route = 'setting/supplier/orderExecute'
      //   } else if (this.$route.path.indexOf('deliveryManagement') !== -1) {
      //     this.route = 'setting/supplier/deliveryManagement'
      //   } else {
      //     this.route = 'setting/supplier/'
      //   }
      // }
    },
    watch: {
      $route () {
        // this.route = this.$route.path.slice(1)
        let arr = this.$route.path.slice(1).split('/')
        this.route = arr[2] ? `${arr[0]}/${arr[1]}/${arr[2]}` : `${arr[0]}/${arr[1]}`
      }
    }
  }
</script>
<style lang="sass">
  @import "index"
</style>
