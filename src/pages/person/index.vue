<template>
  <div class="setting-body">
    <div class="setting-content">
      <div class="setting-nav">
        <div class="setting-nav-body clearfix">
          <div @click="backHp" class="logo f-l"></div>
          <div class="nav f-l">
            <el-menu mode="horizontal" @select="changeChildrenRoute" :default-active="index">
              <el-menu-item :class="item.path === 'supplier' ? 'isActive' : ''" v-for="item in childRoutes" :key="item.path" :index="item.path">{{ item.name }}<span v-if="item.count" class="message-num">45</span></el-menu-item>
            </el-menu>
          </div>
        </div>
      </div>
      <div class="setting-core">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import buyer from '@/pages/person/buyer/buyer.vue'
  import supplier from '@/pages/person/supplier/supplier.vue'
  import accountSetting from '@/pages/person/accountSetting/accountSetting.vue'
  import message from '@/pages/person/message/message.vue'
  import { getUserInfo } from '@/utils/auth'
  export default {
    name: 'setting',
    components: {
      'accountSetting': accountSetting,
      'buyer': buyer,
      'supplier': supplier,
      'message': message
    },
    data() {
      return {
        route: '',
        childRoutes: [],
        index: ''
      }
    },
    mounted () {
      const type = getUserInfo().companyFlag
      let menuList = getUserInfo().menuList
      let supplier = menuList.supplier ? 1 : 0
      let buyer = menuList.buyer ? 1 : 0
      let arr = [
        {
          path: 'accountSetting',
          name: '账户中心'
        }
      ]
      if (type === '1' && supplier) {
        arr.unshift(
          {
            path: 'supplier',
            name: '供方中心'
          }
        )
      } else if (type === '2' && buyer) {
        arr.unshift(
          {
            path: 'buyer',
            name: '需方中心'
          }
        )
      }
      this.childRoutes = arr
      if (this.$route.path.indexOf('supplier') > -1) {
        this.index = 'supplier'
      } else if (this.$route.path.indexOf('buyer') > -1) {
        this.index = 'buyer'
      } else if (this.$route.path.indexOf('message') > -1) {
        this.index = 'message'
      } else {
        this.index = 'accountSetting'
      }
    },
    methods: {
      changeChildrenRoute (index) {
        // index === 'supplier' ? this.supplierColor = true : this.supplierColor = false
        // if (this.supplier)
        if (this.supplier) {
          this.supplierColor = index
        }
        // 在当前位置下点击不跳转（如在账户中心下时点击账户中心不跳转）
        if (this.$route.path.indexOf(index) === -1) {
          this.$router.push(`/setting/${index}`)
        }
      },
      backHp() {
        this.$router.push('/')
      }
    },
    watch: {
      $route() {
        if (this.$route.path.indexOf('supplier') > -1) {
          this.index = 'supplier'
        } else if (this.$route.path.indexOf('buyer') > -1) {
          this.index = 'buyer'
        } else if (this.$route.path.indexOf('message') > -1) {
          this.index = 'message'
        } else {
          this.index = 'accountSetting'
        }
      }
    }
  }
</script>
<style lang="sass">
  @import "./index"
</style>
