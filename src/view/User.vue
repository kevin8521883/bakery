<template>
  <div>
    <UserHeader></UserHeader>
    <Alert></Alert>
    <router-view></router-view>
    <Cart></Cart>
    <UserFooter></UserFooter>
  </div>
</template>
<script>
import UserHeader from "@/components/User/UserHeader";
import UserFooter from "@/components/User/UserFooter";
import Cart from "@/components/User/Cart";
import Alert from "@/components/Alert";
export default {
  data() {
    return {};
  },
  components: {
    UserHeader,
    UserFooter,
    Cart,
    Alert
  }
};
</script>
