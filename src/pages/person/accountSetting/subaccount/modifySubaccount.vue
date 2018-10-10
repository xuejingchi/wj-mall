<template>
  <div class="addSubaccount">
    <SettingTitle :msg='titleName'></SettingTitle>
    <div class="titel">
      <div class="titel-l">
        <span class="set">操作指引</span></div>
      <div class="titel-r">
        <span class="round">1</span><span class="text">添加子账号</span><span class="line">--------------------</span>
        <span class="round">2</span><span class="text">验证手机号归属</span><span class="line">--------------------</span>
        <span class="round">3</span><span class="text">账号添加角色权限</span><span class="line">--------------------</span>
        <span class="round">4</span><span class="text">完成</span><span class="line">--------------------</span>
      </div>
    </div>
    <div style="clear:box"></div>
    <div class="list">
      <div class="account">修改权限</div>
      <div class="role">
        <div class="role-select">
          <span>使用者：</span>
          <span style="margin-left:15px;">{{accountName}}</span>
        </div>
        <div class="role-select" style="margin-top:24px">
          <span>角色：</span>
          <span style="margin-left:28px;">{{roleName}}</span>
        </div>
        <div class="role-show">
          <div style="text">权限预览：</div>
          <div class="tree">
            <!-- <el-tree
             :data="data6"
             @node-click="handleNodeClick"
             node-key="id"
             :default-checked-nodes="[10]"
             default-expand-all
             show-checkbox
             :props="defaultProps"
             @check="getCheckedKeys"
            >
            </el-tree> -->
            <el-tree
              @check="getCheckedKeys"
              :data="tableList"
              show-checkbox
              node-key="menuId"
              :check-on-click-node="true"
              default-expand-all
              :default-checked-keys="checked"
              :props="defaultProps">
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-account">
      <el-button type="primary" @click="submitForm()">确认修改</el-button>
    </div>
  </div>
</template>
<script>
import SettingTitle from '@/components/common/settingTitle'
import { findRoleAndMenuListByAccountId, updatePermission } from '@/api/person/subaccount/subaccount'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'modifySubaccount',
  components: {
    SettingTitle: SettingTitle
  },
  data () {
    return {
      tableList: [],
      checked: [],
      titleName: '子账户管理',
      roleList: [{
        id: 1,
        label: '一级菜单',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1',
            a: '333'
          }, {
            id: 10,
            label: '三级 1-1-2',
            a: '333'
          }]
        }]
      }, {
        id: 2,
        label: '二鸡菜单',
        children: [{
          id: 5,
          label: '二级 2-1',
          a: '333'
        }, {
          id: 6,
          label: '二级 2-2',
          a: '333'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1',
          a: '333'
        }, {
          id: 8,
          label: '二级 3-2',
          children: [{
            id: 11,
            label: '三级 3-2-1',
            a: '333'
          }, {
            id: 12,
            label: '三级 3-2-2',
            a: '333',
          }, {
            id: 13,
            label: '三级 3-2-3',
            a: '333'
          }]
        }]
      }],
      defaultProps: {
        children: 'menuList',
        label: 'name'
      },
      accountId: '',
      accountName: '',
      roleId: '',
      roleIdModify: '',
      roleName: '',
      infPermissionInfoList: [] // 修改权限的一级三级菜单
    }
  },
  created() {
    this.findRoleAndMenuListByAccountId()
  },
  methods: {
    handleNodeClick(data) {
      console.log(data)
    },
    getCheckedKeys (checked, checkArr) {
      console.log('checkArr', checkArr)
      this.infPermissionInfoList = []
      checkArr.checkedNodes.forEach(item => {
        let jsons = {}
        if (item.flag) {
          jsons.rootId = item.flag
          jsons.menuId = item.menuId
          this.infPermissionInfoList.push(jsons)
        }
      })
    },
    // 修改权限
    submitForm () {
      // if (this.infPermissionInfoList.length === 0) {
      //   this.$message({
      //     message: '至少选取一个菜单！',
      //     type: 'success'
      //   })
      //   return
      // }
      let params = {
        accountId: this.$route.query.accountId,
        accountName: this.accountName,
        roleId: this.roleId,
        roleName: this.roleName,
        infPermissionInfoList: this.infPermissionInfoList,
        parentAccountId: getUserInfo().userId,
        parentAccountName: getUserInfo().userName,
      }
      updatePermission(params).then(res => {
        if (res.data.code === 200) {
          this.roleIdModify = res.data.data
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.$router.push({path: '/setting/accountSetting/subaccount'})
          // this.findRoleAndMenuListByAccountId()
        } else {
          this.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    findRoleAndMenuListByAccountId () {
      let params = {
        accountId: this.$route.query.accountId
        // accountType: getUserInfo().accountType
      }
      findRoleAndMenuListByAccountId(params).then(res => {
        if (res.data.code === 200) {
          this.accountName = res.data.data.accountName
          this.roleId = res.data.data.roleList[0].roleId
          this.roleIdModify = res.data.data.roleList[0].roleId
          this.roleName = res.data.data.roleList[0].roleName
          this.tableList = res.data.data.roleList[0].menuList
          this.checked = []
          this.infPermissionInfoList = []
          this.tableList.forEach((item) => {
            let jsons = {}
            item.menuList.forEach(itemValue => {
              if (!itemValue.menuList) {
                itemValue.flag = item.menuId
                jsons.rootId = item.menuId
                jsons.menuId = itemValue.menuId
                this.infPermissionInfoList.push(jsons)
                if (itemValue.selected === '1') {
                  this.checked.push(itemValue.menuId)
                }
              }
              if (itemValue.menuList) {
                itemValue.menuList.forEach(itemValueTwo => {
                  itemValueTwo.flag = item.menuId
                  jsons.rootId = item.menuId
                  jsons.menuId = itemValueTwo.menuId
                  this.infPermissionInfoList.push(jsons)
                  if (itemValueTwo.selected === '1') {
                    this.checked.push(itemValueTwo.menuId)
                  }
                })
              }
            })
          })
          // this.getCheckedKeys(1, this.tableList)
          // console.log(JSON.stringify(this.tableList))
        }
      })
    }
  }
}
</script>
<style lang="sass">
  @import "./modifySubaccount"
</style>
