<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="container my-5">
      <div class="h2 text-center pb-5">
        <span style="border-bottom:2px solid black">我的願望清單</span>
      </div>
      <div v-if="products.length">
        <div
          v-if="!filterProducts.length"
          class="text-center d-flex justify-content-center align-items-center"
        >
          <div>
            <div class="h3 mb-3">目前沒有關注的商品哦</div>
            <router-link to="/products" class="btn btn-outline-primary">趕快去看看吧</router-link>
          </div>
        </div>
      </div>
      <div class="row">
        <div
          class="col-md-6 col-lg-4 mb-4"
          data-aos="fade-up"
          v-for="(item) in filterProducts"
          :key="item.id"
        >
          <div class="card shadow-sm card-round">
            <router-link :to="{path : `/product/${item.id}` }" class="pic">
              <div :style="{backgroundImage :`url(${item.imageUrl})`}" class="pic-enlarge"></div>
            </router-link>
            <router-link
              style="text-decoration:none;"
              :to="{path : `/product/${item.id}` }"
              class="card-body"
            >
              <h5 class="card-title text-dark">{{item.title}}</h5>
              <div class="d-flex justify-content-between align-items-baseline">
                <div class="h4" v-if="item.price===item.origin_price">{{item.origin_price|currency}}</div>
                <del
                  class="h6 text-secondary"
                  v-if="item.price!=item.origin_price"
                >{{item.origin_price|currency}}</del>
                <div
                  class="h4 text-danger"
                  v-if="item.price!=item.origin_price"
                >{{item.price|currency}}</div>
              </div>
              <div class="d-flex justify-content-between align-items-baseline">
                <a class="text-danger" @click.prevent="addMyFavorite(item.id)" title="加入最愛">
                  <i class="far fa-heart fa-lg" :class="{'fas fa-heart fa-lg':item.isLike}"></i>
                </a>
                <a class="text-danger" @click.prevent="addtoCart(item.id)" title="加入購物車">
                  <i class="fas fa-cart-plus fa-2x"></i>
                </a>
              </div>
            </router-link>
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
      isLoading: false,
      favoriteId: ["-M8yXZjdZ1KJXB49_jrX"],
      products: [],
      myFavorite: JSON.parse(localStorage.getItem("myFavorite")) || []
    };
  },
  methods: {
    getProducts() {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`;
      vm.$http.get(api).then(res => {
        vm.products = res.data.products;
        vm.products.forEach(function(item) {
          vm.$set(item, "isLike", false);
        });
        vm.products.forEach(function(item) {
          vm.myFavorite.forEach(function(itemLove) {
            if (itemLove === item.id) {
              item.isLike = true;
            }
          });
        });
        vm.isLoading = false;
      });
    },
    addtoCart(id, qty = 1) {
      const vm = this;
      vm.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      const productItem = {
        product_id: id,
        qty
      };
      vm.$http.post(api, { data: productItem }).then(res => {
        if (res.data.success) {
          vm.$bus.$emit("upDataCart");
          vm.$bus.$emit("message:push", res.data.message, "success");
        } else {
          vm.$bus.$emit("message:push", res.data.message, "danger");
        }
        vm.isLoading = false;
      });
    },
    addMyFavorite(id) {
      const vm = this;
      vm.products.forEach(function(item) {
        if (item.id === id) {
          item.isLike = !item.isLike;
        }
      });
      let index = vm.myFavorite.findIndex(function(item) {
        return item == id;
      });
      if (index === -1) {
        vm.myFavorite.push(id);
      } else {
        vm.myFavorite.splice(index, 1);
      }
      localStorage.setItem("myFavorite", JSON.stringify(vm.myFavorite));
      vm.$bus.$emit("upDataFavorite", vm.myFavorite);
    }
  },
  computed: {
    filterProducts() {
      const vm = this;
      return vm.products.filter(function(item) {
        return vm.myFavorite.indexOf(item.id) > -1;
      });
    }
  },
  created() {
    const vm = this;
    vm.$bus.$on("upDataFavorite", data => {
      vm.favoriteId = data;
    });
    vm.getProducts();
  }
};
</script>