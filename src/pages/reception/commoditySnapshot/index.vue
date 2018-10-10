<template>
    <div class="commoditySnapshot-box">
      <!-- 头部 -->
      <div class="shadow">
        <ul class="header">
          <li class="logo" @click="goHome"></li>
          <li class="line"></li>
          <li class="lable">商品快照</li>
        </ul>
        <div class="commodity-title">
          <div class="title">
            <div class="title-left">
              <span>[商品快照]</span>
              <span>{{datalist.itemName}}</span>
            </div>
            <div class="title-right">
              <span>订单时间：</span>
              <span>{{datalist.orderDate}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- end -->
      <!-- 快照详情 -->
      <div class="commodity-info">
        <el-container>
          <el-aside width="390px">
            <div class="commodity-img">
              <div class="large-img">
                <img v-if="imgurllist.length > 0" :src="`${ goodsImgUrl }${ imgurllist[0].picExFileid }`">
              </div>
            </div>
            <div class="list-img">
              <ul v-for="(item,index) in imgurllist">
                <li><img :src="`${ goodsImgUrl }${ item.picExFileid }`"></li>
              </ul>
            </div>
          </el-aside>
          <el-main>
            <div class="main-title">
              <h2>{{datalist.itemName}}</h2>
              <div class="main-price">
                <p>
                  <span>价格：</span>
                  <span class="price">￥{{datalist.itemLinePrice | showPriceToTwoDecimal}}</span>
                </p>
                <p>
                  <span>计价单位：</span>
                  <span class="valuation">{{datalist.unit}}</span>
                </p>
              </div>
            </div>
            <div class="main-info">
              <div class="main-info-top">
                <span class="font-color-one">供货区域：</span>
                <span class="font-color-two">{{datalist.areaName}}</span>
              </div>
              <div class="main-info-cen">
                <ul>
                  <li v-for="item in datalist.specContentList">
                    <span class="font-color-one">{{item.attributeName}}：</span>
                    <span class="font-color-two">{{item.attributeValue}}</span>
                  </li>
                </ul>
              </div>
              <div class="main-info-btn">
                <span class="font-color-one">最小起订量：</span>
                <span class="font-color-two">{{datalist.minOrderNum}}</span>
              </div>
            </div>
          </el-main>
        </el-container>
      </div>
      <!-- end -->
      <!-- 详细信息描述 -->
      <div class="info-describe">
        <div class="info-describe-desc">
          <div class="info-describe-title">商品描述</div>
        </div>
        <div class="info-content">
          <ul>
            <li v-for="(item,index) in imginfoList" class="info-content-desc">
              <div class="desc-img">
                <img :src="`${ goodsImgUrl }${ item.picExFileid }`">
              </div>
              </li>
              <li v-for="(item,index) in itemInfoList">
              <div>
                <div class="desc-title">{{item.descTitle}}</div>
                <div class="desc-info" :class="{'desc-info-border' : index>itemInfoList.length}">{{item.descText}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script>
import {getItemSnapshotInfo} from '@/api/reception/commoditySnapshot/commoditySnapshot'
export default {
  data() {
    return {
      itemInfoList: [], // 商品描述信息
      imginfoList: [], // 图片列表
      itemLineId: '', // 商品行Id
      salesContractHeadId: '', // 商品id
      version: '', // 商品行版号
      imgurllist: [], // 图片url
      datalist: {}
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    goHome () {
      this.$router.push({
        path: '/'
      })
    },
    getInfo() {
      let params = {
        salesContractHeadId: this.$route.query.contractId,
        itemLineId: this.$route.query.itemLineId,
        version: this.$route.query.version
      }
      getItemSnapshotInfo(params).then((res) => {
        if (res.data.code === 200) {
          this.datalist = res.data.data
          this.itemInfoList = this.datalist.itemDesc.itemDescDTOList
          this.imginfoList = this.datalist.itemDesc.imageDTOList
          this.imgurllist = this.datalist.imageList.splice(0, 5)
        }
      })
    }
  }
}
</script>
<style lang="sass">
  @import "./index"
</style>
