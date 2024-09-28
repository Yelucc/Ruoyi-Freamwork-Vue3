<template>
  <div class="dashboard-wrapper">
    <div class="banner"></div>

    <div class="content-wrapper">
      <div class="btn-group">
        <div class="btn" @click="router.push('/rule')"></div>
      </div>
      <div class="leaderboard">
        <div class="content">
          <div class="item" v-for="(item,index) in leaderboard" :key="index">
            <div class="left">
              <div class="index" v-if="index <=2"></div>
              <div class="index" v-else>{{ item.sortIndex }}</div>
              <div>{{ item.teamName }}</div>
            </div>
            <div class="right">
              <div>{{ item.score }}</div>
              <span class="point">
              分
            </span>
            </div>
          </div>
        </div>


      </div>
      <div class="join" @click="handleOnClickJoin"></div>

    </div>


    <KhLogin v-model="loginVisible"/>
    <KhsubmitSharedDialog v-model="sharedVisiable" @callback="getLeaderboard"/>
  </div>
</template>

<script setup>
import {listLeaderboard} from "@/api/KuiHua/team.js";
import KhLogin from "@/views/KuiHua/mobile/components/KhLogin.vue";
import {getToken} from "@/utils/auth.js";
import KhsubmitSharedDialog from "@/views/KuiHua/mobile/components/KhsubmitSharedDialog.vue";
import {useRouter} from "vue-router";

const router = useRouter()
const leaderboard = ref([])
const loginVisible = ref(false)
const sharedVisiable = ref(false)

function handleOnClickJoin() {
  if (getToken()) {
    sharedVisiable.value = true;
  } else {
    loginVisible.value = true;
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
    background: url("@/assets/images/banner.png") no-repeat center center;
    background-size: cover; /* 图片覆盖整个容器 */
  }

  .content-wrapper {
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .btn-group {
      display: flex;
      width: 100%;
      flex-direction: row;

      justify-content: center;

      .btn {
        //border: #1ab394 solid 1px;
        background: url("@/assets/images/rule-btn.png") no-repeat center center;
        background-size: cover; /* 图片覆盖整个容器 */
        width: 100%;
        height: 62px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
      }
    }

    .leaderboard {
      height: 400px;
      width: 100%;
      //border: #1ab394 solid 1px;
      background: url("@/assets/images/leaderboard.png") no-repeat top center;
      background-size: contain;
      margin: 15px 20px;
      padding: 10% 20px;

      .content {
        height: 350px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          display: none; // 隐藏滚动条
        }

        .item:nth-child(1) {
          .left {
            .index {
              background: url('src/assets/images/leaderboard_1.png') no-repeat center center;
              background-size: cover;
            }
          }

        }

        .item:nth-child(2) {
          .left {
            .index {
              background: url('src/assets/images/leaderboard_2.png') no-repeat center center;
              background-size: cover;
            }
          }

        }

        .item:nth-child(3) {
          .left {
            .index {
              background: url('src/assets/images/leaderboard_3.png') no-repeat center center;
              background-size: cover;
            }
          }

        }

        .item {
          width: 100%;
          background-color: rgba(235, 242, 252, 1);
          border-radius: 8px;
          height: 55px;
          margin-bottom: 5px;

          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: row;

          padding: 0 10px;

          font-family: "HuaKang Yuan W7A", serif;
          font-size: 20px;
          color: #0A3279;
          font-weight: 800;

          .left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            width: 80%;

            .index {
              margin-right: 20px;
              width: 50px;
              height: 50px;
              text-align: center;
              line-height: 50px;
            }
          }

          .right {
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .point {
              font-size: 14px;
              margin-left: 5px;
            }
          }

        }
      }


    }

    .join {
      background: url("@/assets/images/join-btn.png") no-repeat center center;
      background-size: cover; /* 图片覆盖整个容器 */
      width: 100%;
      height: 62px;
      cursor: pointer;
      text-align: center;
      line-height: 40px;
    }
  }


}
</style>