<template>
  <header>
    <div class="header-inner df">
      <router-link :to="$publicUrl" class="logo df">
        <img
          src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2162411735,2401613782&fm=26&gp=0.jpg"
          alt
        />
        <span>前端交流社区</span>
      </router-link>
      <div v-if="userInfo" class="myMessage">
        <span>{{messageNum!=0?messageNum:''}}</span>
        <router-link :to="$publicUrl+'/my/messages'">未读消息</router-link>
      </div>
      <div class="create-box">
        <button v-if="userInfo && $route.path!='/topic/create'" class="createBtn">
          <router-link :to="$publicUrl+'/topic/create'">发布话题</router-link>
        </button>
      </div>
      <div v-if="!userInfo" class="login">
        <input type="text" v-model="text" />
        <button @click="login">登录</button>
      </div>

      <div v-else class="logout df">
        <router-link :to="`${$publicUrl}/user/${userInfo.loginname}`">
          <img :src="userInfo.avatar_url" alt />
        </router-link>

        <button @click="logout">退出</button>
      </div>
    </div>
  </header>
</template>

<script>
//  存储登陆状态  一般使用浏览器的本地存储功能    1. cookie   2. localStorage   3.  sessionStorage
//  local 和 session 的区别    local  一直存储直到你不想存了    session  关闭窗口就消失
//  用法     一般存储安全信息
//  存储    localStorage.setItem('属性名','属性值')   sessionStorage.setItem('属性名','属性值')
//  获取   localStorage.getItem('属性名')  session用法一致
//  清空    localStorage.removeItem('属性名')     sessionStorage.clear()全部清空   session用法一致
//   存储的属性值不能是对象类型  一般存 Boolean   number   string
//   存储的数据可以在浏览器的 开发者工具（f12）下的  Application 内查看

import axios from "axios";
export default {
  name: "tou",
  data() {
    return {
      text: "ed05bbe6-aaa7-43cf-95ca-4c5fb6b52df8",
      userInfo: null,
      messageNum: ""
    };
  },

  created() {
    console.log(this.$publicUrl);
    // 获取存储好的 token ，依据这个 token 向后台获取更新登陆状态
    if (sessionStorage.getItem("token")) {
      axios
        .post("https://www.vue-js.com/api/v1/accesstoken", {
          accesstoken: sessionStorage.getItem("token")
        })
        .then(res => {
          this.userInfo = res.data;
          console.log(this.userInfo);
        });
    }
  },
  watch: {
    "$route.fullPath": {
      immediate: true,

      handler() {
        if (sessionStorage.getItem("token")) {
          axios
            .get(
              `https://www.vue-js.com/api/v1/message/count?accesstoken=${sessionStorage.getItem(
                "token"
              )}`
            )
            .then(res => {
              this.messageNum = res.data.data;
              console.log(res.data);
              console.log(sessionStorage.getItem("token"));
              // 将得到的信息存储到本地浏览器
            });
        }
      }
    }
  },
  methods: {
    login() {
      axios
        .post("https://www.vue-js.com/api/v1/accesstoken", {
          accesstoken: this.text
        })
        .then(res => {
          this.userInfo = res.data;
          // console.log(res.data);
          // 将得到的信息存储到本地浏览器
          sessionStorage.setItem("token", this.text);
          sessionStorage.setItem("user_id", res.data.id);
          this.$router.push(this.$publicUrl);
        });
    },
    logout() {
      sessionStorage.clear();
      this.userInfo = null;
      this.$router.push(this.$publicUrl);
    }
  }
};
</script>

<style>
header {
  background: #1c6132;
  width: 100%;
  height: 55px;
}
header .logo {
  padding: 0 20px;
  height: 45px;
  font-size: 26px;
  font-weight: 500;
  color: #fff;
  height: 55px;
}
header .logo img {
  margin-right: 5px;
}
header .logo span {
  font-weight: bold;
}
header img {
  display: block;
  width: 45px;
}
header .header-inner {
  width: 90%;
  margin: 0 auto;
  justify-content: space-between;
}
header .header-inner button {
  margin-left: 5px;
}
header .header-inner .logout,
header .header-inner .login {
  padding: 0 20px;
}
/* header .header-inner .logout img {
  width: 45px;
  display: block;
} */
header .myMessage a {
  color: #fff;
}
header .myMessage span {
  color: #fff;
}
header .header-inner .logout button {
  align-self: flex-end;
}
header .createBtn {
  padding: 3px 5px;
  border: 0;
  margin-right: 5px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  letter-spacing: 2px;
  box-shadow: none;
  border-radius: 3px;
  line-height: 2em;
  vertical-align: middle;
  color: #fff;
  background-color: #369219;
  outline: none;
}
header .createBtn a {
  color: #fff;
}
header .create-box {
  width: 84px;
}
</style>
