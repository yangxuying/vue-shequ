<template>
  <div class="home">
    <ul class="home-nav df">
      <li>
        <router-link
          @click.native="total=860"
          :class="$route.fullPath.indexOf('all')!=-1||$route.fullPath===$publicUrl||$route.fullPath===$publicUrl+'/'?'active':''"
          :to="$publicUrl+'/?tab=all'"
        >全部</router-link>
      </li>
      <li>
        <router-link
          @click.native="total=15"
          :class="$route.fullPath.indexOf('good')!=-1?'active':''"
          :to="$publicUrl+'/?tab=good'"
        >精华</router-link>
      </li>
      <li>
        <router-link
          @click.native="total=3"
          :class="$route.fullPath.indexOf('weex')!=-1?'active':''"
          :to="$publicUrl+'/?tab=weex'"
        >weex</router-link>
      </li>
      <li>
        <router-link
          @click.native="total=247"
          :class="$route.fullPath.indexOf('share')!=-1?'active':''"
          :to="$publicUrl+'/?tab=share'"
        >分享</router-link>
      </li>
      <li>
        <router-link
          @click.native="total=577"
          :class="$route.fullPath.indexOf('ask')!=-1?'active':''"
          :to="$publicUrl+'/?tab=ask'"
        >问答</router-link>
      </li>
      <li>
        <router-link
          @click.native="total=30"
          :class="$route.fullPath.indexOf('job')!=-1?'active':''"
          :to="$publicUrl+'/?tab=job'"
        >招聘</router-link>
      </li>
    </ul>
    <ul class="home-topic" v-if="topics.length">
      <li v-for="topic in topics" :key="topic.id" class="topic-list df">
        <router-link :to="`${$publicUrl}/user/${topic.author.loginname}`">
          <img :src="topic.author.avatar_url" alt />
        </router-link>
        <div class="count">
          <span class="reply-count">{{topic.reply_count}}</span>/
          <span class="visit-count">{{topic.visit_count}}</span>
        </div>
        <span
          v-if="$route.fullPath.indexOf('all')!=-1||$route.fullPath==='/'||topic.top||topic.good"
          :class="{tab:true, active:topic.top||topic.good}"
        >{{topic.top?'置顶':topic.good?'精华':topic.tab==='share'?'分享':topic.tab==='job'?'招聘':'weex'}}</span>
        <router-link :to="`${$publicUrl}/topics/${topic.id}`" class="title">{{topic.title}}</router-link>
        <span class="time">{{myMoment(topic.last_reply_at)}}</span>
      </li>
    </ul>

    <div v-else class="gif">
      <img
        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1562737069078&di=f12471a88c45f3039cee29572900ee3c&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F72d27a3ca423fa04ffe641dc659cac33ca9d8d5326f31-oNSSdN_fw658"
        alt
      />
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="20"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "home",
  data() {
    return {
      topics: [],
      total: 860
    };
  },
  watch: {
    "$route.fullPath": {
      immediate: true,

      handler() {
        const tab = this.$route.query.tab || "all";
        const num = Number(this.$route.query.page) || "1";
        console.log(this.$route.query);
        this.topics = [];
        axios
          .get(`https://www.vue-js.com/api/v1/topics/?tab=${tab}&page=${num}`)
          .then(res => {
            this.topics = res.data.data;
            console.log(res.data.data);
          });
      }
    }
  },
  methods: {
    myMoment(time) {
      moment.locale("zh-cn");
      return moment(time).fromNow();
    },
    // 分页器功能 点击获取下一页的内容进行展示， 但是地址没有发生变化
    changePage(num) {
      // console.log(page);
      // const tab = this.$route.query.tab || "all";
      // this.topics = [];
      // axios
      //   .get(`https://www.vue-js.com/api/v1/topics/?tab=${tab}&page=${page}`)
      //   .then(res => {
      //     this.topics = res.data.data;
      //   });
      const tab = this.$route.query.tab || "all";
      this.$router.push(`${this.$publicUrl}/?tab=${tab}&page=${num}`);
    }
  }
};
</script>

<style>
.home {
  width: 90%;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 20px;
  padding-bottom: 10px;
}
.home-nav {
  padding: 10px;
  border-radius: 8px 8px 0 0;
  background-color: #f6f6f6;
}
.home-nav li a {
  margin: 0 10px;
  color: #369219;
}
.home-nav li a.active {
  background-color: #369219;
  color: #fff;
  padding: 3px 4px;
  border-radius: 3px;
}
.gif img {
  width: 100%;
}
.home-topic .topic-list {
  padding: 10px;
  border-bottom: 1px solid #f6f6f6;
}
.home-topic .topic-list:hover {
  background-color: #f5f5f5;
}
.tab {
  background-color: #e5e5e5;
  color: #999;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 12px;
  flex-shrink: 0;
}
.active {
  background: #369219;
  color: #fff;
}
.topic-list img {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}
.topic-list .count {
  width: 70px;
  text-align: center;
  font-size: 10px;
  color: #b4b4b4;
  flex-shrink: 0;
}
.topic-list .reply-count {
  color: #9e78c0;
  font-size: 14px;
}
.topic-list .visit-count {
  color: #b4b4b4;
  font-size: 10px;
}
.topic-list .title {
  padding-left: 5px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.topic-list .title:hover {
  text-decoration: underline;
}
.topic-list .title:visited {
  color: #888;
}
.topic-list .time {
  padding-left: 10px;
  flex-shrink: 0;
  flex-grow: 1;
  text-align: right;
}
.el-pagination {
  margin-top: 5px;
}
</style>
