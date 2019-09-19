import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./components/Home.vue";
import Topic from "./components/Topic.vue";
import User from "./components/User.vue";
import CreateTopic from "./components/CreateTopic.vue";
import Message from "./components/Message.vue";
import PUBLICURL from "./constants";
Vue.use(VueRouter);
export default new VueRouter({
  routes: [
    {
      path: PUBLICURL,
      component: Home
    },
    {
      path: `${PUBLICURL}/topics/:id`,
      component: Topic
    },
    {
      path: `${PUBLICURL}/user/:loginname`,
      component: User
    },
    {
      path: `${PUBLICURL}/topic/create`,
      component: CreateTopic
    },
    {
      path: `${PUBLICURL}/my/messages`,
      component: Message
    }
  ],
  mode: "history"
});
