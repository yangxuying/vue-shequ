<template>
  <div>
    <Header />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Footer from "./components/Footer";
import Header from "./components/Header";
export default {
  name: "app",
  components: {
    Header,
    Footer
  }
};
</script>

<style>
</style>
