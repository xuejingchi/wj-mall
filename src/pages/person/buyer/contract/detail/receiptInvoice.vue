<template>
  <div class="upload-project">
    <div class="detail">
      <div class="titel">
        <div class="titel-top">{{ contractName }}</div>
        <div class="lock">
          <span style="color:#999">采购订单号：<span>{{ contractCode }}</span></span>
          <span style="margin-left:45px;color:#999">订单日期：<span>{{ contractDate | timeFormat('YYYY-MM-DD HH:mm')}}</span></span>
        </div>
      </div>
      <div class="info" style="border-bottom: 1px dashed #E2E2E2;">
        <div class="top">基础信息</div>
        <div class="bottom">
          <div>
            <span class="detail-left-label">甲方</span>
            <span >{{purchaser}}</span>
          </div>
          <div>
            <span class="detail-left-label">乙方</span>
            <span >{{supplier}}</span></div>
          <div>
            <span class="detail-left-label">项目名称</span>
            <span >{{projectName ? projectName : "--" }}</span></div>
          <div>
            <span class="detail-left-label">收货地址</span>
            <span >{{address}} ({{name}}收) {{phone}}</span></div>
        </div>
        <div style="clear:both"></div>
      </div>
      <div class="purchase" style="margin:20px">
        <div class="top" style="margin-top:5px;">采购需求</div>
        <div class="bottom" style="margin-top:5px">
          <template>
            <el-table
              :data="tableData2"
              style="width: 100%"
              algin='left'
              border>
              <el-table-column
                type="index"
                width="60"
                label="序号">
              </el-table-column>
              <el-table-column
                label="商品"
                prop=""
                width="400"
                >
                <template slot-scope="scope">
                  <ul class="commodity-info">
                    <li>
                      <span>
                        <router-link v-if="scope.row.orderItemVersion === scope.row.itemVersion" class="demand-router" :to="{path: `/goodsDetail?itemId=${scope.row.itemId}`}">{{ scope.row.itemName }}</router-link>
                      </span>
                      <span v-if="scope.row.orderItemVersion !== scope.row.itemVersion">{{scope.row.itemName}}[<router-link class="demand-router" :to="{path: `/commoditySnapshot?itemLineId=${scope.row.itemLineId}&contractId=${scope.row.contractId}&version=${scope.row.orderItemVersion}`}">此商品已更新，点此查看商品快照</router-link>]</span>
                    </li>
                    <li><span>品牌：</span>{{scope.row.brandName ? scope.row.brandName : '--'}}</li>
                    <li><span>技术参数：</span>{{scope.row.paramters ? scope.row.paramters : '--'}}</li>
                  </ul>
                </template>
              </el-table-column>
              <el-table-column
                prop="quantity"
                label="数量"
                width="50"
                >
              </el-table-column>
              <el-table-column
                prop="unit"
                label="单位"
                width="60">
              </el-table-column>
              <el-table-column
                prop="unitPrice"
                width="100"
                label="含税单价(元)">
              </el-table-column>
              <el-table-column
                prop="taxRate"
                label="税率">
              </el-table-column>
              <el-table-column
                prop="anountPrice"
                label="金额(元)">
              </el-table-column>
              <el-table-column
                label="预计交付日期"
                width="100">
                <template slot-scope="scope">
                  <span>{{scope.row.expectDate | timeFormat('YYYY-MM-DD')}}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div style="clear:both"></div>
      </div>
      <div class="purchase" style="margin-left:20px;margin-right:20px;">
        <div class="enclosure" style="margin:0" v-if="attachmentList.length">
          <div class="top">附件和承诺</div>
          <div class="bottom">
            <div class="upload-file">
              <span v-for="item in attachmentList" @click="DownloadFile(item.attachmentPath, item.attachmentName)">
                <span>
                  <i class="iconfont icon-fujian"></i>
                  {{item.attachmentName}}
                </span>
              </span>
            </div>
          </div>
          <div style="clear:both"></div>
        </div>
        <div class="top" style="margin-top:20px;">结算信息</div>
        <div class="bottom">
          <template>
            <el-table
              :data="tableData3"
              style="width: 100%"
              border>
              <el-table-column
                prop="receiptsExplain"
                label="收款说明"
                >
              </el-table-column>
              <el-table-column
                label="开始日期"
                >
                <template slot-scope="scope">
                  <span>{{scope.row.startDate | timeFormat('YYYY-MM-DD HH:mm')}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="limitDay"
                label="收款期限(天)"
                >
              </el-table-column>
              <el-table-column
                prop="proportion"
                label="金额占比(%)">
              </el-table-column>
              <el-table-column
                prop="amount"
                label="金额"
                align="right">
              </el-table-column>
            </el-table>
          </template>
        </div>
        <div style="clear:both"></div>
      </div>
      <div class="enclosure">
        <div class="top">发票信息</div>
        <div class="bottom">
          <div>
            <div class="info-left" style="border-right:1px solid #E2E2E2;">单位名称</div>
            <div class="info-right">{{companyName}}</div>
          </div>
          <div style="clear:both;">
            <span class="info-left" style="border-right:1px solid #E2E2E2;">纳税人识别码</span>
            <span class="info-right">{{identificationCode}}</span>
          </div>
          <div style="clear:both;">
            <span class="info-left" style="border-right:1px solid #E2E2E2;">单位地址</span>
            <span class="info-right">{{companyAddress}}</span>
          </div>
          <div style="clear:both;">
            <span class="info-left" style="border-right:1px solid #E2E2E2;">电话</span>
            <span class="info-right">{{tel}}</span>
          </div>
          <div style="clear:both;">
            <span class="info-left" style="border-bottom:1px solid #E2E2E2;border-right:1px solid #E2E2E2;">开户行及账号</span>
            <span class="info-right" style="border-bottom:1px solid #E2E2E2">{{cardNumber}}</span>
          </div>
        </div>
        <div style="clear:both"></div>
      </div>
      <div class="enclosure" style="border-bottom: none;" v-show="contractList.length > 0">
        <div class="top">订单信息</div>
        <div class="bottom" v-if="contractList.length">
          <div class="upload-file">
            <span v-for="item in contractList" @click="DownloadFile(item.attachmentPath, item.attachmentName)">
              <i class="iconfont icon-fujian"></i>
              {{item.attachmentName}}
            </span>
          </div>
        </div>
        <div style="clear:both"></div>
      </div>
      <div class="info" style="border-top:1px dashed #e2e2e2;padding-top:20px;padding-top:20px;padding-bottom:70px" v-show="status == 55">
        <div class="top">确认信息</div>
        <div class="bottom">
          <div><span class="confirm">确认人</span><span>{{confirmer}}</span></div>
          <div><span class="confirm">确认时间</span><span>{{ confirmDateTime | timeFormat('YYYY-MM-DD  HH:mm:ss') }}</span></div>
        </div>
        <div style="clear:both"></div>
      </div>
      <div class="info" style="border-top:1px dashed #e2e2e2;padding-bottom:70px" v-show="status == 60">
        <div class="top">确认信息</div>
        <div class="bottom">
          <div>
            <span class="detail-left-label">确认人</span>
            <span >{{confirmer}}</span></div>
          <div>
            <span class="detail-left-label">确认时间</span>
            <span >{{ confirmDateTime | timeFormat('YYYY-MM-DD HH:mm:ss') }}</span></div>
          <div>
            <span class="detail-left-label">甲方签约人</span>
            <span >{{firstParty}}</span></div>
          <div>
            <span class="detail-left-label">乙方签约人</span>
            <span >{{secondParty}}</span></div>
          <div>
            <span class="detail-left-label">生效时间</span>
            <span >{{ takeEffectDateTime | timeFormat('YYYY-MM-DD HH:mm:ss') }}</span></div>
        </div>
        <div style="clear:both"></div>
      </div>
      <div class="submit" v-show="btn == 1">
        <div class="submit-style" @click="confrimDetial">订单确认</div>
        <!--<div class="submit-cancel" @click="">取消</div>-->
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { fgetContractInfo, confirmationContract } from '@/api/person/buyer/contract'
  import { getUserInfo } from '@/utils/auth'
  export default {
    data () {
      return {
        tableData2: [],
        tableData3: [],
        active: 0,
        address: '',
        dispatchCode: '',
        projectName: '',
        purchaser: '',
        secondParty: '',
        contractName: '',
        contractCode: '',
        contractDate: '',
        identificationCode: '',
        tel: '',
        companyName: '',
        companyAddress: '',
        cardNumber: '',
        status: '',
        btn: '',
        supplier: '',
        confirmer: '',
        confirmDateTime: '',
        firstParty: '',
        takeEffectDateTime: '',
        contractList: [],
        attachmentList: [],
        name: '',
        phone: '',
        userId: getUserInfo().userId || '2',
        userName: getUserInfo().userName || '2'
      }
    },
    mounted () {
      this.btn = this.$route.query.btn
      this.getDetail()
    },
    methods: {
      getDetail () {
        let params = {
          contractId: this.$route.query.contractId,
          userId: this.userId,
        }
        fgetContractInfo(params).then((response) => {
          if (response.data.code === 200) {
            let data = response.data.data
            this.tableData2 = data.itemList
            console.log(data.itemList[0])
            this.tableData3 = data.billingInformation
            this.address = data.address
            this.dispatchCode = data.dispatchCode
            this.projectName = data.projectName
            this.purchaser = data.purchaser
            this.secondParty = data.secondParty
            this.contractName = data.contractName
            this.contractCode = data.contractCode
            this.contractDate = data.contractDate
            this.identificationCode = data.identificationCode
            this.tel = data.tel
            this.companyName = data.companyName
            this.companyAddress = data.companyAddress
            this.cardNumber = data.cardNumber
            this.confirmer = data.confirmer
            this.confirmDateTime = data.confirmDateTime
            this.firstParty = data.firstParty
            this.supplier = data.supplier
            this.name = data.name
            this.phone = data.phone
            this.takeEffectDateTime = data.takeEffectDateTime
            this.status = data.status
            this.contractList = data.contractList
            this.attachmentList = data.attachmentList
          }
        }).catch(function (error) {
          console.log(error)
        })
      },
      confrimDetial () {
        let params = {
          contractId: this.$route.query.contractId,
          userId: this.userId,
          userName: this.userName,
          operatorType: '25'
          // contractId: '0da5dcf9bd94a547fdaec392ec39a0b2',
        }
        confirmationContract(params).then((response) => {
          if (response.data.code === 200) {
            this.$message({
              message: '确认成功！',
              type: 'success'
            })
            // 刷新数据
            this.btn = 0
            this.getDetail()
          } else {
            this.$message({
              message: '提交失败！',
              type: 'error'
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
</script>
<style lang="sass">
  @import "./receiptInvoice"
</style>
