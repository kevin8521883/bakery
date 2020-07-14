<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openCouponMOdal(false)">新增優惠券</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th width="120">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in Coupon" :key="item.id">
          <td>{{item.title}}</td>
          <td>{{item.percent}}%</td>
          <td>{{item.due_date|date}}</td>
          <td v-if="item.is_enabled" class="text-success">已啟用</td>
          <td v-if="!item.is_enabled" class="text-danger">未啟用</td>
          <td class="btn-group">
            <button class="btn btn-sm btn-outline-primary" @click="openCouponMOdal(true,item)">編輯</button>
            <button class="btn btn-sm btn-outline-danger" @click="delCoupon(item.id)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="couponModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="couponModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="title">標題</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="tempCoupon.title"
                placeholder="請輸入標題"
              />
            </div>
            <div class="form-group">
              <label for="coupon_code">優惠碼</label>
              <input
                type="text"
                class="form-control"
                id="coupon_code"
                v-model="tempCoupon.code"
                placeholder="請輸入優惠碼"
              />
            </div>
            <div class="form-group">
              <label for="due_date">到期日</label>
              <input type="date" class="form-control" id="due_date" v-model="due_date" />
            </div>
            <div class="form-group">
              <label for="percent">折扣百分比</label>
              <input
                type="number"
                class="form-control"
                id="percent"
                v-model="tempCoupon.percent"
                placeholder="請輸入折扣百分比"
              />
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="is_enabled"
                  :true-value="1"
                  :false-value="0"
                  v-model="tempCoupon.is_enabled"
                />
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="updataCoupon()">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  data() {
    return {
      isLoading: false,
      Coupon: {},
      tempCoupon: {
        title: "",
        is_enabled: 0,
        percent: 100,
        due_date: 0,
        code: ""
      },
      due_date:'',
      isNew: false
    };
  },
  watch: {
    due_date() {
      const vm = this;
      const timestamp = Math.floor(new Date(vm.due_date) / 1000);
      vm.tempCoupon.due_date = timestamp;
    }
  },
  methods: {
    openCouponMOdal(isNew, item) {
      const vm = this;
      $("#couponModal").modal("show");
      if (!isNew) {
        vm.tempCoupon = {};
        vm.isNew = true;
      } else {
        vm.tempCoupon = Object.assign({}, item);
        vm.isNew = false;
        const dateAndTime = new Date(vm.tempCoupon.due_date * 1000).toISOString().split('T');
        vm.due_date = dateAndTime[0];
      }
    },
    updataCoupon(id) {
      const vm = this;
      vm.isLoading = true;
      if (vm.isNew) {
        const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
        this.$http.post(api, { data: vm.tempCoupon }).then(response => {
          vm.getCoupon();
          $("#couponModal").modal("hide");
        });
      } else {
        const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
        this.$http.put(api, { data: vm.tempCoupon }).then(response => {
          vm.getCoupon();
          $("#couponModal").modal("hide");
        });
      }
    },
    getCoupon(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.Coupon = response.data.coupons;
        vm.isLoading = false;
      });
    },
    delCoupon(id) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${id}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.delete(api).then(response => {
        vm.getCoupon();
      });
    }
  },

  created() {
    this.getCoupon();
  }
};
</script>