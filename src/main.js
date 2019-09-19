import Vue from "vue";
//导入 整个 App 组件
import App from "./App.vue";
import { Pagination } from "element-ui";
import "./assets/glocal.css";
import "./assets/icon/iconfont.css";
import router from "./router";
import PUBLICURL from "./constants";
Vue.config.productionTip = false;
Vue.use(Pagination);
Vue.prototype.$publicUrl = PUBLICURL;

// 将 App 组件内的虚拟 dom 结构，转化成真实的 dom 结构  并且把这个真是的 dom 结构挂载到 #app 这个元素身上
// 框架写的是 虚拟 dom
// 获取后台数据  通过原生或者  jq  操作真实的  dom  去生成页面并且写上交互效果。 直接操作 dom 节点可能会引起浏览器的重绘(重渲)
new Vue({
  render: h => h(App),
  router
}).$mount("#app");
// render 渲染   .$mount  挂载    #app 在 App.vue 中
