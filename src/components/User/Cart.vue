<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <button :class="{'d-none': hidden}" class="cart" @click.prevent="openCart">
      <i class="fas fa-cart-plus fa-2x"></i>
      <span
        class="badge badge-pill badge-danger"
        v-if="cart.carts.length !== 0"
      >{{cart.carts.length}}</span>
    </button>
    <button class="gotop" @click.prevent="goTop">
      <i class="fa fa-angle-up"></i>
    </button>
    <!-- Modal -->
    <div
      class="modal fade"
      id="CartModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="CartModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="CartModalLabel">購物車內容</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <table class="table" v-if="cart.final_total!=0">
              <thead>
                <tr>
                  <th colspan="4">已選擇商品</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item) in cart.carts" :key="item.id">
                  <td class="align-middle">
                    <button class="btn btn-outline-danger btn-sm" @click="delCart(item)">
                      <i class="far fa-trash-alt"></i>
                    </button>
                  </td>
                  <td class="align-middle">{{item.product.title}}</td>
                  <td class="align-middle">{{item.qty}}/{{item.product.unit}}</td>
                  <td
                    class="align-middle text-right"
                    v-if="item.product.price"
                  >{{item.total |currency}}</td>
                </tr>
                <tr>
                  <td colspan="3" class="text-right">總計</td>
                  <td class="text-right">{{cart.total |currency}}</td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              <p class="h1 text-center">購物車內尚無內容</p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-primary form-control"
              v-if="cart.final_total!=0"
              @click.prevent="goOrder"
            >結帳</button>
            <button
              type="button"
              class="btn btn-outline-primary form-control"
              v-else
              @click.prevent="goShop"
            >立刻去逛逛吧！</button>
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
      hidden: false,
      cart: {
        carts: {}
      },
      isLoading: false
    };
  },
  methods: {
    openCart() {
      $("#CartModal").modal("show");
    },
    getCart() {
      const vm = this;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      vm.$http.get(api).then(res => {
        if (res.data.success) {
          vm.cart = res.data.data;
        }
      });
    },
    delCart(item) {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${item.id}`;
      vm.$http.delete(api).then(res => {
        vm.$bus.$emit(
          "message:push",
          `已將 ${item.product.title} 從購物車中刪除`,
          "danger"
        );
        vm.getCart();
        vm.isLoading = false;
      });
    },
    goShop() {
      const vm = this;
      $("#CartModal").modal("hide");
      vm.$bus.$emit("goAllProducts", "All");
      vm.$router.push(`/products`);
    },
    goOrder() {
      const vm = this;
      $("#CartModal").modal("hide");
      vm.$router.push("/Order");
    },
    goTop() {
      $("html, body").animate({ scrollTop: 0 }, 500);
    },
    hideenCart() {
      const vm = this;
      if (vm.$route.name === "Order" || vm.$route.name === "CheckOut") {
        vm.hidden = true;
      } else {
        vm.hidden = false;
      }
    }
  },
  created() {
    const vm = this;
    vm.getCart();
    vm.hideenCart();
    vm.$bus.$on("upDataCart", () => {
      vm.getCart();
    });
    $(window).scroll(function() {
      if ($(this).scrollTop() > 400) {
        $(".gotop").fadeIn();
      } else {
        $(".gotop").fadeOut();
      }
    });
  },
  watch: {
    $route(route) {
      const vm = this;
      if (route.name === "Order" || route.name === "CheckOut") {
        vm.hidden = true;
      } else {
        vm.hidden = false;
      }
    }
  }
};
</script>