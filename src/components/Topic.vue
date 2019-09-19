<template>
  <div v-if="topic" class="topic inner">
    <article>
      <div class="article-head">
        <div class="article-head-top">
          <div>
            <span :v-if="topic.top||topic.good" class="tab active">{{topic.top?'置顶':'精华'}}</span>
          </div>
          <h2>{{topic.title}}</h2>
          <div v-if="token">
            <span @click="changeCollect" class="collect">{{isCollect?'取消收藏':'加入收藏'}}</span>
          </div>
        </div>
        <p class="changes">
          <span>
            <b>·</b>
            发布于{{myMoment(topic.create_at)}}
          </span>
          <span>
            <b>·</b>
            作者 {{topic.author.loginname}}
          </span>
          <span>
            <b>·</b>
            {{topic.visit_count}} 次浏览
          </span>
          <span>
            <b>·</b>
            来自 {{topic.tab==="share"?'分享':topic.tab==="ask"?'问答':topic.tab==="job"?'招聘':'weex'}}
          </span>
        </p>
      </div>
      <div class="topic_content" v-html="topic.content"></div>
    </article>
    <div class="panel">
      <div class="head">{{topic.replies.length}}回复</div>
      <div
        class="cell comment df"
        v-for="comment in topic.replies"
        :key="comment.id"
        :style="{backgroundColor:isUped(comment.id)?'#f4fcf0':''}"
      >
        <router-link :to="`${$publicUrl}/user/${comment.author.loginname}`">
          <img :src="comment.author.avatar_url" alt />
        </router-link>

        <div>
          <span class="loginname">{{comment.author.loginname}}</span>
          <span v-html="comment.content"></span>
        </div>
        <div class="up-callback">
          <span>
            <span
              @click="up(comment.id)"
              class="cup iconfont icon-zan"
              :style="{color:isUped(comment.id)?'red':''}"
              :class="comment.ups.length?'':'kong'"
            ></span>
            {{comment.ups.length?comment.ups.length:''}}
          </span>
          <span class="cup iconfont icon-huifu" @click="addReply(comment.author.loginname)"></span>
        </div>
      </div>
    </div>
    <div class="panel position">
      <div class="head">添加回复</div>
      <textarea cols="30" rows="10" v-model="text" class="textarea"></textarea>
      <button @click="addComment">回复</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
export default {
  name: "topic",
  data() {
    return {
      topic: null,
      isCollect: false,
      text: "",
      token: ""
    };
  },
  created() {
    const { id } = this.$route.params;
    axios.get(`https://www.vue-js.com/api/v1/topic/${id}`).then(res => {
      this.topic = res.data.data;
      this.token = sessionStorage.getItem("token");
      // console.log(this.topic.replies);
      // console.log(Boolean(this.token));
    });
  },
  methods: {
    // 取消收藏  加入收藏
    changeCollect() {
      const obj = {
        accesstoken: sessionStorage.getItem("token"),
        topic_id: this.$route.params.id
      };
      if (!this.isCollect) {
        axios
          .post("https://www.vue-js.com/api/v1/topic/collect", obj)
          .then(res => {
            if (res.data.success) {
              this.isCollect = true;
            }
          });
      } else {
        axios
          .post("https://www.vue-js.com/api/v1/topic/de_collect", obj)
          .then(res => {
            if (res.data.success) {
              this.isCollect = false;
            }
          });
      }
    },
    myMoment(time) {
      moment.locale("zh-cn");
      return moment(time).fromNow();
    },
    addComment() {
      //  添加 话题回复
      axios
        .post(`https://www.vue-js.com/api/v1/topic/${this.topic.id}/replies`, {
          accesstoken: sessionStorage.getItem("token"),
          content: this.text
        })
        .then(res => {
          const { id } = this.$route.params;
          axios.get(`https://www.vue-js.com/api/v1/topic/${id}`).then(res => {
            this.topic = res.data.data;
            this.text = "";
          });
        });
    },
    // 点赞操作
    up(id) {
      axios
        .post(`https://www.vue-js.com/api/v1/reply/${id}/ups`, {
          accesstoken: sessionStorage.getItem("token")
        })
        .then(res => {
          console.log(res.data.action);
          //  更新本地数据
          if (res.data.action === "up") {
            this.topic.replies
              .find(item => item.id === id)
              .ups.push(sessionStorage.getItem("user_id"));
            console.log(this.topic.replies);
          } else {
            this.topic.replies.find(
              item => item.id === id
            ).ups = this.topic.replies
              .find(item => item.id === id)
              .ups.filter(item => item != sessionStorage.getItem("user_id"));
          }
        });
    },
    // 是否显示 用户点过赞
    isUped(id) {
      return (
        this.topic.replies
          .find(item => item.id === id)
          .ups.indexOf(sessionStorage.getItem("user_id")) != -1
      );
    },
    // 给 某个特定用户添加回复
    addReply(loginname) {
      this.text = `@${loginname} `;
      // 原生获取焦点  获取光标
      document.querySelector(".textarea").focus();
    }
  }
};
</script>

<style>
.topic {
  width: 90%;
  margin: 0 auto;
  border-radius: 5px;
  margin-top: 15px;
}
.topic .article-head {
  border-bottom: 1px solid #ccc;
  padding: 10px;
}
.topic .article-head-top {
  display: flex;
  align-items: flex-end;
}
.topic .article-head h2 {
  flex-grow: 1;
  margin: 0;
}
article {
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  margin-top: 15px;
  margin-bottom: 13px;
}
.inner .changes {
  font-size: 12px;
  color: #838383;
}
.topic_content {
  margin: 0 10px;
}
.topic .collect {
  background: #369219;
  color: #fff;
  padding: 5px;
  cursor: pointer;
  border-radius: 3px;
}
.panel .inner.post,
.panel .inner.reply,
.panel .inner.topic,
.panel .inner.userinfo {
  padding: 10px;
  border-top: 1px solid #e5e5e5;
}
.panel .inner.post,
.panel .inner.reply,
.panel .inner.topic,
.panel .inner.userinfo {
  padding: 10px;
  border-top: 1px solid #e5e5e5;
}
.markdown-text > :first-child,
.preview > :first-child {
  margin-top: 0;
  margin-bottom: 0;
  /* padding: 5px 0; */
}
.preview h1,
.preview h2,
.preview h3,
.preview h4,
.preview h5,
.preview h6,
.reply_area h1,
.reply_area h2,
.reply_area h3,
.reply_area h4,
.reply_area h5,
.reply_area h6,
.topic_content h1,
.topic_content h2,
.topic_content h3,
.topic_content h4,
.topic_content h5,
.topic_content h6 {
  margin: 30px 0 15px;
  border-bottom: 1px solid #eee;
}
.preview p,
.reply_content p,
.reply_form p,
.topic_content p {
  font-size: 15px;
  line-height: 1.7em;
  overflow: auto;
}
.topic_content strong {
  font-weight: 700;
}
.topic_content img {
  width: auto\9;
  height: auto;
  max-width: 100%;
  vertical-align: middle;
  border: 0;
  -ms-interpolation-mode: bicubic;
}
.topic_content h4 {
  font-size: 17.5px;
  padding: 5px 0;
}
.topic_content h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 10px 0;
  font-family: inherit;
  font-weight: 700;
  line-height: 20px;
  color: inherit;
  text-rendering: optimizelegibility;
}
.markdown-text p,
.preview p {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  line-height: 2em;
  margin: 1em 0;
}
.inner li {
  list-style: disc;
  list-style-position: inside;
}
.comment img {
  width: 30px;
  vertical-align: middle;
}
.comment .loginname {
  color: #666;
  font-size: 12px;
}
.comment > div {
  margin-left: 10px;
}
.panel textarea {
  width: 100%;
  border: 0;
  resize: none;
  height: 300px;
  padding: 15px;
  outline: none;
}
.position {
  position: relative;
}
.panel button {
  padding: 3px 10px;
  border: 0;
  margin: 0;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  letter-spacing: 2px;
  box-shadow: none;
  border-radius: 3px;
  line-height: 2em;
  vertical-align: middle;
  color: #fff;
  background-color: #3374de;
  outline: none;
  position: absolute;
  bottom: 15px;
  left: 15px;
}
.comment .up-callback {
  flex-shrink: 0;
  flex-grow: 1;
  text-align: right;
}
.comment .kong {
  color: #fff;
}
.comment .cup {
  cursor: pointer;
}
.comment:hover .kong {
  color: black;
}
</style>
