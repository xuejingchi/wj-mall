<template>
  <div class="account">
    <div class="account-body">
      <div class="account-content clearfix">
        <div class="account-left f-l">
          <el-menu
            :default-active="route"
            class="el-menu-vertical-demo" @select="selectNav">
            <el-menu-item v-for="item in childRoutes" :key="item.url" :index="item.url">{{ item.name }}</el-menu-item>
          </el-menu>
        </div>
        <div class="account-right f-l">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUserInfo } from '@/utils/auth'
  export default {
    name: 'accountSetting',
    components: {
    },
    data() {
      return {
        childRoutes: getUserInfo().menuList.account.menuList,
        route: 'setting/accountSetting/'
      }
    },
    beforeMount() {
    },
    mounted () {
      if (!getUserInfo().userId) {
        this.$router.push('/login')
      }
      // if (this.$route.path.indexOf('authentication') !== -1) {
      //   this.route = 'setting/accountSetting/'
      // } else {
      //   this.route = this.$route.path.slice(1)
      // }
      this.route = this.$route.path.slice(1)
      // 子账户 ~ 跳转至可用权限下第一个路由
      if (getUserInfo().accountType !== '11' && getUserInfo().accountType !== '21') {
        return
      }
      if (this.$route.name === 'securitySetting') {
        return
      }
      let obj = this.childRoutes[0]
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
      selectNav(key) {
        const accountFlag = getUserInfo().accountFlag
        if (accountFlag === '1' && key !== 'securitySetting') {
          this.$router.push('/identification/')
        } else {
          this.$router.push(`/${key}`)
        }
      }
    },
    watch: {
      $route() {
        this.route = this.$route.path.slice(1)
      }
    }
  }
</script>
<style lang="sass">
  @import "./account"
</style>
