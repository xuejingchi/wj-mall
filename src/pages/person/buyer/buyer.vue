<template>
  <div class="buyer">
    <div class="buyer-body">
      <div class="supplier-content clearfix">
        <div class="supplier-left f-l">
          <el-menu
            :default-active="route"
            :active="route"
            class="el-menu-demo"
            @select="selectNav"
            @close="handleClose"
            :default-openeds="routeArr">
            <!--<el-menu-item v-for="item in childRoutes" :key="item.path" :index="item.path">{{ item.name }}</el-menu-item>-->
            <!--<template>-->
              <!--<el-menu-item index="" style="padding-left: 40px">发布需求</el-menu-item>-->
              <!--<el-menu-item index="requirement" style="padding-left: 40px">需求记录</el-menu-item>-->
            <!--</template>-->
            <!--<el-menu-item index="contract" style="color: #666666"><i class="iconfont list-icon">&#xe606;</i>订单执行</el-menu-item>-->
            <div class="menu-box" v-for="items in buyerMenuList">
              <el-submenu v-if="items.menuList" :index="items.url">
                <template slot="title">
                  <span slot="title" style="display: block; width: 100%;" v-if="items.menuList">
                    <i v-if="items.url === 'setting/buyer'" class="iconfont list-icon">&#xe61a;</i>
                    <!--<i class="iconfont list-icon">&#xe606;</i>-->
                    {{ items.name }}
                  </span>
                </template>
                <!--<el-submenu v-if="subItem.thirdRoutes" :index="subItem.path">-->
                <!--<template slot="title">-->
                <!--<span style="display: block; width: 100%;" @click="configOwnPage(subItem.hasOwnPage, subItem.path)" slot="title">{{ subItem.name }}</span>-->
                <!--</template>-->
                <!--<el-menu-item v-for="thirdItem in subItem.thirdRoutes" :key="thirdItem.path" :index="thirdItem.path">-->
                <!--{{ thirdItem.name }}-->
                <!--</el-menu-item>-->
                <!--</el-submenu>-->
                <el-menu-item v-for="item in items.menuList" :key="item.url" :index="item.url">
                  {{ item.name }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="items.url" style="color: #666666">
                <i v-if="items.url === 'setting/buyer/contract'" class="iconfont list-icon">&#xe606;</i>
                {{ items.name }}
              </el-menu-item>
            </div>
          </el-menu>
        </div>
        <div class="supplier-right f-l">
          <div class="account-right f-l">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUserInfo } from '@/utils/auth'
  export default {
    name: 'buyer',
    components: {
    },
    data() {
      return {
        route: 'publishRequirement',
        buyerMenuList: getUserInfo().menuList.buyer.menuList,
        routeArr: this.route === '' || this.route === 'requirement' ? ['1'] : ['2']
      }
    },
    beforeMount() {
    },
    mounted() {
      // if (this.$route.path.indexOf('requirement') !== -1) {
      //   this.route = 'setting/buyer/requirement'
      // } else if (this.$route.path.indexOf('contract') !== -1) {
      //   this.route = 'setting/buyer/contract'
      // } else {
      //   this.route = 'setting/buyer/'
      // }
      // console.log(getUserInfo())
      this.route = this.$route.path.slice(1)
      // 子账户 ~ 跳转至可用权限下第一个路由
      if (getUserInfo().accountType !== '21') {
        return
      }
      let obj = this.buyerMenuList[0]
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
      handleClose() {
        return false
      }
    },
    watch: {
      $route() {
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
