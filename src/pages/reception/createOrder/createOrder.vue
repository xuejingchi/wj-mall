<template>
  <div class="color-bg">
    <div class="logo-color">
      <div class="seacrh clearfix">
        <div class="log f-l">
          <router-link :to="{path: '/'}"><img src="/static/img/logo2x.86248df.png" alt="" width="100%"></router-link>
        </div>
      </div>
    </div>
    <div class="create-order">
      <div class="nav">
        <img src="./../../../assets/reception/createOrder/step.png" alt="">
      </div>
      <div class="order" v-if="course.begin">
        <div class="data">
          <div class="title">交付说明：</div>
          <div class="info">
            <div class="line">
              <div class="name"><span>*</span>收货地址</div>
              <div>
                <el-select v-model="province" @change="provinceChoose" placeholder="省份">
                  <el-option
                    v-for="item in provinceList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select v-model="city" @change="cityChoose" placeholder="城市" :disabled="cityDisabled">
                  <el-option
                    v-for="item in cityList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-select class="area-w" v-model="area" placeholder="区域/乡镇" :disabled="areaDisabled">
                  <el-option
                    v-for="item in areaList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-input class="address" v-model="addressDetail" placeholder="详细地址"></el-input>
              </div>
            </div>
            <div class="line">
              <div class="clearfix">
                <div class="contract"><span>*</span>收货人姓名</div>
                <el-input class="contract-input" v-model="contactName" placeholder="请输入收货人姓名"></el-input>
                <div class="contract  contract-w"><span>*</span>收货人联系方式</div>
                <el-input class="contract-input" v-model="contactPhone" placeholder="请输入收货人联系方式"></el-input>
                <div class="name contract-w"><span>*</span>交付期限截止到</div>
                <el-date-picker
                  class="dead-line"
                  v-model="deadline"
                  :editable="false"
                  :picker-options="time"
                  type="date"
                  placeholder="YYYY-MM-DD">
                </el-date-picker>
              </div>
            </div>
            <div class="line">
              <button class="next-proceed-btn" @click="nextToProceed()">下一步</button>
            </div>
          </div>
        </div>
      </div>
      <div class="order" v-if="course.proceed">
        <div class="data">
          <div class="title">采购信息：</div>
          <div class="data-list" v-for="(item, index) in particularsList">
            <div class="order">
              <div class="title">
                <div class="name">{{ item.itemName }}（商品编码：{{ item.itemLineCode }}）</div>
                <div class="number">数量：{{ item.count }}</div>
                <div class="price" v-if="item.matched === false">无货</div>
                <div class="price" v-else>￥{{ item.unitPrice | showPriceToTwoDecimal }} </div>
              </div>
              <div class="tec-data">
                <div class="name">技术参数：</div>
                <div class="tec-detail">
                  <el-table
                    empty-text="暂无技术参数"
                    :data="item.itemParams"
                    style="width: 100%"
                    stripe
                    :show-header="false"
                  >
                    <el-table-column
                      prop="key1"
                      width="99">
                    </el-table-column>
                    <el-table-column
                      prop="value1"
                      width="179">
                    </el-table-column>
                    <el-table-column
                      prop="key2"
                      width="99">
                    </el-table-column>
                    <el-table-column
                      prop="value2"
                      width="179">
                    </el-table-column>
                    <el-table-column
                      prop="key3"
                      width="99">
                    </el-table-column>
                    <el-table-column
                      prop="value3"
                      width="179">
                    </el-table-column>
                    <el-table-column
                      prop="key4"
                      width="99">
                    </el-table-column>
                    <el-table-column
                      prop="value4">
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="create" :class="fixFit ? 'fix-fit' : ''" v-loading="loading">
          <div class="tel-info">
            <el-button size="mini">在线咨询</el-button>
            <i class="el-icon-phone"></i>
            <span class="tel">400-826-7880</span>
          </div>
          <div class="amount">数量：<span>{{ totalNum }}</span></div>
          <div class="price">
            <div class="title">总计金额：</div>
            <div class="total-price" v-if="prices">￥{{ totalPrice | showPriceToTwoDecimal }}</div>
            <div class="total-price" v-if="!prices">￥{{ totalPrice }}</div>
          </div>
          <div class="enter" @click="submitFrom">提交订单</div>
        </div>
      </div>
      <div class="finish" v-if="course.finish">
        <div class="form-result">
          <div class="title">
            <i class="el-icon-circle-check-outline"></i>
            <span class="name">订单已提交</span>
          </div>
          <div class="contact" v-if="subType">万郡绿建会在<span class="hours">24小时内</span>与您确认订单信息，请确保联系人手机畅通</div>
        </div>
        <div class="order-info">
          <div class="order-title">订单号：<span>{{ orderNum }}</span></div>
          <div class="order-detail">订购商品：<span>{{ orderDetail }}(商品编码: {{ orderCode }})</span></div>
          <div v-if="more">......</div>
          <div class="more-order">
            <div class="more" v-if="pushRouterType" @click="loadMore">查看订单详情</div>
            <div class="more" v-if="!pushRouterType" @click="loadMoreTwo">查看订单详情</div>
            <div class="contact" v-if="subType" @click="loadContact">查看企业联系人信息</div>
          </div>
        </div>
        <div class="number">订单中心客服电话 400-826-7880</div>
      </div>
      <el-dialog
        :visible.sync="dialog.submitOrderVisible"
        width="30%"
        :show-close="true"
        class="submit-order-dialog">
        <h3>友情提示</h3>
        <p>由于收货地址不在商品供应范围内，<br>无法直接生成订单。</p>
        <span slot="footer" class="dialog-footer">
          <button class="submit-form-order-btn" @click="requisitionFormSubmit()">以需求单提交</button>
          <button class="cancel-btn" @click="lastStep" style="cursor: pointer">取消下单</button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { fetchCityList } from '@/api/reception/order/cityList'
  import { fetchCartList, fetchBatchOrder } from '@/api/reception/cart/cart'
  import { fetchAddOrder, createSalesOrder, findCurrentItemLineList } from '@/api/reception/order/order'
  // import { getItemBaseInfo, getSkuAttributeList } from '@/api/reception/goodsDetail'
  import store from '@/store'
  import { getUserInfo } from '@/utils/auth'
  import { phone } from '@/api/common/checkout'
  import moment from 'moment'
  import { getCarNum } from '@/api/common/searchNav'
  export default {
    name: 'createOrder',
    data () {
      return {
        time: {
          disabledDate: (val) => {
            return val.getTime() < new Date() - 86400000
          }
        },
        dialog: {
          submitOrderVisible: false
        },
        course: {
          begin: true,
          proceed: false,
          finish: false
        },
        provinceList: [],
        cityList: [],
        areaList: [],
        province: '',
        city: '',
        area: '',
        addressDetail: '',
        deadline: '',
        loadingCity: null,
        fixFit: false,
        data: [],
        itemLineList: [],
        particularsList: [],
        totalNum: '',
        totalPrice: '',
        orderNum: '',
        orderDetail: '',
        orderCode: '',
        more: true,
        cityDisabled: true,
        areaDisabled: true,
        allList: [],
        loading: false,
        areaCode: '',
        contactName: '',
        contactPhone: '',
        itemSpecList: [],
        matched: true,
        titleItem: [],
        subType: false,
        prices: true,
        pushRouterType: true
      }
    },
    store,
    created () {
      // 获取地址
      fetchCityList().then((res) => {
        const data = res.data.data
        this.allList = data
        const allList = this.allList
        for (let i = 0; i < allList.length; i++) {
          this.provinceList.push(
            {
              'value': i,
              'id': allList[i].id,
              'label': allList[i].name
            }
          )
        }
      })
      // 获取购物车列表
      const { num, itemId, areaCode } = this.$route.query
      if (num && itemId && areaCode) {
        this.data.push({'itemId': itemId, 'count': num})
      } else {
        fetchCartList({ userId: getUserInfo().userId, advanceOrderId: this.$route.query.id }).then((res) => {
          const data = res.data.data
          this.totalNum = data.count
          this.totalPrice = data.totalPrice
          let newData = []
          for (let i = 0; i < data.cartItemLineListDTOList.length; i++) {
            for (let j = 0; j < data.cartItemLineListDTOList[i].items.length; j++) {
              newData.push(data.cartItemLineListDTOList[i].items[j])
            }
          }
          newData.map((item) => {
            this.data.push({'itemId': item.itemId, 'count': item.number})
          })
        })
      }
    },
    methods: {
      lastStep() {
        window.close()
      },
      submitFrom() {
        if (!this.matched) {
          this.subType = true
          this.dialog.submitOrderVisible = true
        } else {
          this.subType = false
          let params = {
            userId: getUserInfo().userId,
            itemLineList: this.itemLineList,
            provinceCode: this.province !== '' ? this.provinceList[this.province].id : '',
            provinceName: this.province !== '' ? this.provinceList[this.province].label : '',
            cityCode: (this.city !== '') ? this.cityList[this.city].id : '',
            cityName: (this.city !== '') ? this.cityList[this.city].label : '',
            countyCode: (this.area !== '') ? this.areaList[this.area].id : '',
            countyName: (this.area !== '') ? this.areaList[this.area].label : '',
            address: this.addressDetail,
            receiver: this.contactName,
            receiverMobile: this.contactPhone,
            deliveryEndDate: moment(this.deadline).valueOf(),
            customerId: getUserInfo().customerId
          }
          createSalesOrder(params).then((res) => {
            if (res.data.code === 200) {
              this.course.begin = false
              this.course.proceed = false
              this.course.finish = true
              this.orderNum = res.data.data.salesContractCode
              this.dialog.submitOrderVisible = false
              this.pushRouterType = false
              let parmas = {
                userId: getUserInfo().userId
              }
              getCarNum(parmas).then((response) => {
                if (response.status === 200) {
                  let num = response.data.data
                  this.$store.commit('addPurchaseList', num)
                }
              })
            }
          })
        }
      },
      nextToProceed() {
        this.course.finish = false
        // const leadTime = moment(this.deadline).valueOf()
        const province = this.province !== '' ? this.provinceList[this.province].label : ''
        const provinceId = this.province !== '' ? this.provinceList[this.province].id : ''
        const city = (this.city !== '') ? this.cityList[this.city].label : ''
        const cityId = (this.city !== '') ? this.cityList[this.city].id : ''
        const area = (this.area !== '') ? this.areaList[this.area].label : ''
        const areaId = (this.area !== '') ? this.areaList[this.area].id : ''
        let contactName = this.contactName
        let contactPhone = this.contactPhone
        if (!this.addressDetail) {
          this.$message.error('详细地址不能为空')
          this.loading = false
          return
        }
        if (contactName === '') {
          this.$message.error('收货人不能为空')
          this.loading = false
          return
        }
        if (contactPhone === '') {
          this.$message.error('收货人联系方式不能为空')
          this.loading = false
          return
        }
        if (phone(contactPhone) !== true) {
          this.$message.error('请输入正确的手机号')
          this.loading = false
          return
        }
        if (this.deadline === '') {
          this.$message.error('交货日期不能为空')
          this.loading = false
          return
        }
        if (area === '' || this.addressDetail === '') {
          this.$message.error('地址不能为空')
          this.loading = false
          return false
        }
        let params = {
          userId: getUserInfo().userId,
          itemList: this.data,
          provinceCode: provinceId,
          provinceName: province,
          cityCode: cityId,
          cityName: city,
          countyCode: areaId,
          countyName: area
        }
        findCurrentItemLineList(params).then((res) => {
          if (res.data.code === 200) {
            let data = res.data.data
            this.particularsList = data.list
            this.course.begin = false
            this.course.proceed = true
            for (let s = 0; s < data.list.length; s++) {
              if (data.list[s].unitPrice === -1) {
                this.prices = false
              }
            }
            if (!this.prices) {
              this.totalPrice = '议价'
            } else {
              this.totalPrice = data.totalAmount
            }
            this.totalNum = data.totalCount
            for (let i = 0; i < this.particularsList.length; i++) {
              if (this.particularsList[i].matched === false || this.particularsList[i].unitPrice === -1) {
                this.matched = false
              }
              this.particularsList[i].itemParams = []
              this.itemLineList.push({itemLineId: this.particularsList[i].itemLineId, saleQuantity: this.particularsList[i].count})
              if (this.particularsList[i].itemSpecList !== null) {
                for (let j = 0; j < this.particularsList[i].itemSpecList.length; j += 4) {
                  this.particularsList[i].itemParams.push({
                    'key1': this.particularsList[i].itemSpecList[j] ? this.particularsList[i].itemSpecList[j].attributeName : '',
                    'value1': this.particularsList[i].itemSpecList[j] ? this.particularsList[i].itemSpecList[j].attributeValue : '',
                    'key2': this.particularsList[i].itemSpecList[j + 1] ? this.particularsList[i].itemSpecList[j + 1].attributeName : '',
                    'value2': this.particularsList[i].itemSpecList[j + 1] ? this.particularsList[i].itemSpecList[j + 1].attributeValue : '',
                    'key3': this.particularsList[i].itemSpecList[j + 2] ? this.particularsList[i].itemSpecList[j + 2].attributeName : '',
                    'value3': this.particularsList[i].itemSpecList[j + 2] ? this.particularsList[i].itemSpecList[j + 2].attributeValue : '',
                    'key4': this.particularsList[i].itemSpecList[j + 3] ? this.particularsList[i].itemSpecList[j + 3].attributeName : '',
                    'value4': this.particularsList[i].itemSpecList[j + 3] ? this.particularsList[i].itemSpecList[j + 3].attributeValue : ''
                  })
                }
              }
            }
            if (this.particularsList[0] !== undefined) {
              this.orderCode = this.particularsList[0].itemLineCode
              this.orderDetail = this.particularsList[0].itemName
            }
          }
        })
      },
      provinceChoose() {
        this.city = ''
        this.cityList = []
        this.area = ''
        this.areaList = []
        if (this.cityDisabled) {
          this.cityDisabled = false
        }
        const allList = this.allList[this.province].cityListEntityList
        for (let i = 0; i < allList.length; i++) {
          this.cityList.push({
            'value': i,
            'id': allList[i].id,
            'label': allList[i].name
          })
        }
        if (this.loadingCity === null) {
        } else {
          this.cityChoose()
        }
      },
      cityChoose() {
        this.areaList = []
        this.area = ''
        if (this.areaDisabled) {
          this.areaDisabled = false
        }
        const allList = this.allList[this.province].cityListEntityList[this.city].cityListEntityList
        this.loadingCity = allList
        for (let i = 0; i < allList.length; i++) {
          this.areaList.push({
            'value': i,
            'id': allList[i].id,
            'label': allList[i].name
          })
        }
      },
      loadMore() {
        this.$router.push('/setting/buyer/requirement')
      },
      loadMoreTwo() {
        this.$router.push('/setting/buyer/contract')
      },
      loadContact() {
        this.$router.push('/setting/accountSetting/')
      },
      handleScroll() {
        const maxHeight = window.document.body.scrollHeight
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (maxHeight - scrollTop < 1500) {
          // relative
          this.fixFit = true
        } else {
          this.fixFit = false
        }
      },
      requisitionFormSubmit() {
        const { num, itemId, areaCode } = this.$route.query
        const leadTime = moment(this.deadline).valueOf()
        const province = this.province !== '' ? this.provinceList[this.province].label : ''
        const provinceId = this.province !== '' ? this.provinceList[this.province].id : ''
        const city = (this.city !== '') ? this.cityList[this.city].label : ''
        const cityId = (this.city !== '') ? this.cityList[this.city].id : ''
        const area = (this.area !== '') ? this.areaList[this.area].label : ''
        const areaId = (this.area !== '') ? this.areaList[this.area].id : ''
        const address = this.addressDetail
        let contactName = this.contactName
        let contactPhone = this.contactPhone
        if (num && itemId && areaCode) {
          // 立即下单
          fetchAddOrder(
            {
              countryCode: 'CN',
              countryName: '中国',
              provinceName: province,
              cityName: city,
              areaName: area,
              provinceCode: provinceId,
              cityCode: cityId,
              areaId: areaId,
              address,
              postCode: '310000',
              itemId,
              leadTime,
              number: num,
              areaCode,
              userId: getUserInfo().userId,
              userName: getUserInfo().userName,
              customerCode: getUserInfo().companyCode,
              customerName: getUserInfo().companyName,
              contactName,
              contactPhone,
              customerId: getUserInfo().customerId,
              companyId: getUserInfo().companyId
            }
          ).then((res) => {
            this.loading = false
            if (res.data.code === 200) {
              const data = res.data.data
              this.orderNum = data.orderCode
              this.orderDetail = data.itemIdName
              this.orderCode = data.orderId
              this.more = false
              this.course.begin = false
              this.course.proceed = false
              this.course.finish = true
              this.dialog.submitOrderVisible = false
              this.pushRouterType = true
            } else {
              this.$message({
                message: '下单失败！',
                type: 'error'
              })
            }
          })
        } else {
          // 批量下单
          fetchBatchOrder(
            {
              countryCode: 'CN',
              countryName: '中国',
              userId: getUserInfo().userId,
              userName: getUserInfo().userName,
              customerCode: getUserInfo().companyCode,
              customerName: getUserInfo().companyName,
              leadTime,
              provinceName: province,
              cityName: city,
              areaName: area,
              provinceCode: provinceId,
              cityCode: cityId,
              areaId,
              address,
              postCode: '310000',
              contactName,
              contactPhone,
              customerId: getUserInfo().customerId,
              companyId: getUserInfo().companyId,
              advanceOrderId: this.$route.query.id
            }).then((res) => {
            this.loading = false
            if (res.data.code === 200) {
              const data = res.data.data
              this.orderNum = data.orderCode
              this.orderDetail = data.itemList[0]
              this.orderCode = data.orderId
              data.itemList[1] ? this.more = true : this.more = false
              this.course.begin = false
              this.course.proceed = false
              this.course.finish = true
              this.dialog.submitOrderVisible = false
            } else {
              this.$message({
                message: '下单失败！',
                type: 'error'
              })
            }
          })
        }
      },
    },
    mounted () {
      window.scroll(0, 1)
      const maxHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      if (maxHeight < 900) {
        this.fixFit = true
      }
      window.addEventListener('scroll', this.handleScroll)
    },
  }
</script>
<style lang="sass">
  @import "index"
</style>
