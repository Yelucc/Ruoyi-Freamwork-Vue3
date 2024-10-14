<template>
  <el-dialog
      class="shared-dialog-wrapper"
      v-model="visible"
      width="90%"
      :fullscreen="true"
      style="padding: 0;background-color: #005adb;color: #ffffff"
      append-to-body
      :show-close="true"
      :before-close="cancel"
  >
    <template #header>
      <div class="header">
        <div class="avatar-wrapper">
          <img :src="userStore.avatar" class="user-avatar"/>
        </div>
        <div class="nickName">
          {{ userStore.name }}
        </div>
        <div class="dept">
          {{ userStore.deptName }}
        </div>
      </div>
    </template>
    <div class="shared-content">
      <el-form ref="scoreRecordRef" label-position="top" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="种草链接" prop="sharedLink">
          <template #label>
            <span class="form-label">
              种草链接
            </span>
          </template>
          <el-input v-model="form.sharedLink" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="种草图片" prop="sharedPicture">
          <template #label>
            <span class="form-label">
              种草图片(限9张)
            </span>
          </template>
          <el-upload
              v-model:file-list="fileList"
              action="#"
              ref="uploadRef"
              multiple
              :limit="9"
              :data="form"
              accept="image/*"
              list-type="picture-card"
              :auto-upload="false"
          >
            <el-icon>
              <Plus/>
            </el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image"/>
          </el-dialog>
        </el-form-item>
      </el-form>

    </div>
    <div class="bg-img">
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div class="submit-btn" v-loading.fullscreen.lock="loading" @click="submitForm"></div>
        <!--        <el-button @click="cancel">取 消</el-button>-->
      </div>
    </template>

  </el-dialog>
</template>

<script setup>

import {submitScoreRecord} from "@/api/KuiHua/scoreRecord.js";

const visible = defineModel()
import {CaretBottom, Plus} from '@element-plus/icons-vue'
import useUserStore from "@/store/modules/user.js";


const loading = ref(false)
const userStore = useUserStore()
const uploadRef = ref(null)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref([])
const {proxy} = getCurrentInstance();
const data = reactive({
  form: {},
  rules: {
    sharedLink: [
      {required: true, message: "种草链接不能为空", trigger: "blur"},
      {
        pattern: /.*(http|https).*/, // 匹配包含 http 或 https 的字符串
        message: '种草链接无效',
        trigger: 'blur'
      }
    ],
    sharedPicture: [
      {required: true, message: "种草图片不能为空", trigger: "blur"}
    ],
  }
});
const emit = defineEmits(['callback'])
const {form, rules} = toRefs(data);

// 表单重置
function reset() {
  form.value = {
    recordId: null,
    userId: null,
    teamId: null,
    teamName: null,
    status: null,
    score: null,
    sharedLink: null,
    sharedPicture: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("scoreRecordRef");
}

// 取消按钮
function cancel() {
  visible.value = false;
  reset();
}

/** 提交按钮 */
function submitForm() {
  loading.value = true
  form.value.sharedPicture = fileList.value.map(meta => meta.raw)

  const urlPattern = /https?:\/\/[^\s]+/;
  const match = form.value.sharedLink.match(urlPattern);
  const url = match ? match[0] : null;
  if (!url) {
    proxy.$modal.msgError("种草链接校验失败，请检查");
    loading.value = false
    return
  }

  proxy.$refs["scoreRecordRef"].validate(valid => {
    if (valid) {
      const formData = new FormData()
      // 将所有文件添加到 FormData
      formData.append("sharedLink", url)
      fileList.value.forEach(file => {
        formData.append('sharedPicture', file.raw);
      });
      submitScoreRecord(formData).then(res => {
        proxy.$modal.msgSuccess("提交成功");
        cancel()
        emit('callback')
        loading.value = false
      })
    }
  });
}

</script>

<style lang="scss" scoped>

:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 80px;
}

:deep(.el-dialog__footer) {
  position: relative;
  z-index: 1;
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 58px;
  background: url("@/assets/images/img-load-btn.png") no-repeat center center;
  background-size: cover; /* 图片覆盖整个容器 */
  width: 90vw;
  height: 58px;
}

.form-label {
  color: #ffffff;
}

.bg-img {
  position: absolute;
  bottom: 0;
  background: url("@/assets/images/common.png") no-repeat center center;
  background-size: cover; /* 图片覆盖整个容器 */
  width: 100%;
  height: 260px;

}

.shared-content {
  padding: 0 20px;
  font-family: "HuaKang Yuan W7A", serif;
}

.dialog-footer {
  //margin-top: 40%;
  position: relative;
  z-index: 1;
  padding: 0 20px;
  font-family: "HuaKang Yuan W7A", serif;
}

.submit-btn {
  background: url("@/assets/images/submit-shared.png") no-repeat center center;
  background-size: cover; /* 图片覆盖整个容器 */
  width: 100%;

  height: 58px;
}

.header {
  margin-right: 40px;
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-family: "HuaKang Yuan W7A", serif;


  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 60px;
      height: 60px;
      border-radius: 30px;
    }

    i {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
</style>