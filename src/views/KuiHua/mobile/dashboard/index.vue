<template>
  <div class="dashboard-wrapper">
    <div class="banner"></div>
    <div class="btn-group">
      <div class="btn">参与规则</div>
      <div class="btn">奖品展示</div>
    </div>
    <div class="leaderboard">
      <div class="item" v-for="(item,index) in leaderboard" :key="index">
        <div>{{ item.sortIndex }}</div>
        <div>{{ item.teamName }}</div>
        <div>{{ item.score }}</div>
      </div>
    </div>
    <div class="join" @click="handleOnClickJoin">参与活动</div>


    <KhLogin v-model="visible"></KhLogin>
  </div>
</template>

<script setup>
import {listLeaderboard} from "@/api/KuiHua/team.js";
import KhLogin from "@/views/KuiHua/mobile/components/KhLogin.vue";
import {getToken} from "@/utils/auth.js";

const leaderboard = ref([])
const visible = ref(false)

function handleOnClickJoin() {
  if (getToken()){
    console.log("用户已登录")
  }else {
    visible.value = true;
  }

}

function getLeaderboard() {
  listLeaderboard().then(res => {
    leaderboard.value = res.rows
  })
}

getLeaderboard()
</script>

<style lang="scss" scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  .banner {
    width: 100%;
    height: 230px;
    background: url("@/assets/images/kuihua-dashboard-banner.png") no-repeat center center;
    background-size: cover; /* 图片覆盖整个容器 */
  }

  .btn-group {
    display: flex;
    width: 100%;
    flex-direction: row;
    padding: 10px 20px;
    justify-content: space-between;

    .btn {
      border: #1ab394 solid 1px;
      width: 180px;
      height: 45px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
  }

  .leaderboard {
    height: 450px;
    width: 100%;
    border: #1ab394 solid 1px;
    margin: 10px 20px;
    padding: 5px 5px;

    .item {
      width: 100%;
      border: #1ab394 solid 1px;
      height: 45px;
      margin-bottom: 5px;

      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: row;
    }
  }

  .join {
    border: #1ab394 solid 1px;
    width: 180px;
    height: 45px;
    cursor: pointer;
    text-align: center;
    line-height: 40px;
  }
}
</style>