<template>
  <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <router-link class="navbar-brand col-md-3 col-lg-2 mr-0 px-3" to="/">Bakery</router-link>
    <button
      class="navbar-toggler position-absolute d-md-none collapsed"
      type="button"
      data-toggle="collapse"
      data-target="#sidebarMenu"
      aria-controls="sidebarMenu"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
  
    <ul class="navbar-nav px-3">
      <li class="nav-item text-nowrap">
        <a class="nav-link" href="#" @click.prevent="signout">登出</a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  methods: {
    signout() {
      const api = `${process.env.APIPATH}/logout`;
      const vm = this;
      this.$http.post(api).then(res => {
        if (res.data.success) {
          vm.$router.push("/login");
        }
      });
    }
  }
};
</script>