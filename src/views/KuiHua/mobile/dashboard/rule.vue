<template>
  <div class="rule-wrapper">
    <el-backtop style="width: 100px;height: 100px; background: rgba(255,255,255,0.6)" :visibility-height="20" :right="30" :top="100" @click="router.back()">
      <el-icon :size="80" ><Back /></el-icon>
    </el-backtop>
  </div>
</template>

<script setup>

import {Back} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
const router = useRouter()
</script>

<style lang="scss" scoped>
.rule-wrapper {
  width: 100%;
  height: 3500px;
  overflow-y: scroll; // 保留垂直滚动
  &::-webkit-scrollbar {
    display: none; // 隐藏滚动条
  }
  background: url("@/assets/images/rule.jpg") no-repeat center center;
  background-size: cover; /* 图片覆盖整个容器 */
}
</style>