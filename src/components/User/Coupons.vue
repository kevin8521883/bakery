<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="container my-5">
      <div class="h2 text-center pb-5">
        <span style="border-bottom:2px solid black">優惠活動</span>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3" v-for="(item) in Coupon" :key="item.id"  data-aos="fade-up">
          <div class="coupon d-flex">
            <div class="left"></div>
            <div class="right d-flex flex-column justify-content-center align-items-center">
              <div class="h3 m-2">{{item.title}}</div>
              <div class="h6">結帳輸入優惠碼：{{item.code}}</div>
              <div class="h6">即享{{item.percent/10}}折限時優惠</div>
              <div class="h6">優惠截止日期：{{item.due_date|date}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      Coupon: {},
      isLoading: false
    };
  },
  methods: {
    getCoupon(page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      const vm = this;
      vm.isLoading = true;
      this.$http.get(api).then(response => {
        vm.Coupon = response.data.coupons;
        vm.isLoading = false;
        
      });
    }
  },
  created() {
    const vm = this;
    vm.getCoupon();
  }
};
</script>