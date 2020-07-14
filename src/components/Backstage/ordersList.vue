<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table">
      <thead>
        <tr>
          <th width="120">購買時間</th>
          <th width="300">Email</th>
          <th>購買款項</th>
          <th width="120">應付金額</th>
          <th width="120">是否付款</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in sortOrder" :key="item.id">
          <td>{{item.create_at|date}}</td>
          <td>{{item.user.email}}</td>
          <td>
            <ul class="list-unstyled">
              <li
                v-for="(itemProducts) in item.products"
                :key="itemProducts.id"
              >{{itemProducts.product.title}} 數量：{{itemProducts.qty}} {{itemProducts.product.unit}}</li>
            </ul>
          </td>
          <td class="text-right">{{item.total | currency}}</td>
          <td>
            <span v-if="!item.is_paid" class="text-muted">尚未付款</span>
            <span v-else class="text-success">已付款</span>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :childPagination="Pagination" @childChangePage="getOrder" />
  </div>
</template>
<script>
import Pagination from "../Pagination";
export default {
  data() {
    return {
      Pagination: {},
      order: {},
      isLoading: false
    };
  },
  components: {
    Pagination
  },
  methods: {
    getOrder(page = 1) {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
      this.$http.get(api).then(res => {
        vm.order = res.data.orders;
        vm.Pagination = res.data.pagination;
        vm.isLoading = false;
      });
    }
  },
  computed: {
    sortOrder() {
      const vm = this;
      let newOrder = [];
      if (vm.order.length) {
        newOrder = vm.order.sort((a, b) => {
          const aIsPaid = a.is_paid;
          const bIsPaid = b.is_paid;
          return bIsPaid - aIsPaid;
        });
      }
      return newOrder;
    }
  },
  created() {
    this.getOrder();
  }
};
</script>