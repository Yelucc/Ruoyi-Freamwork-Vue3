<template>
  <el-dialog
      class="shared-dialog-wrapper"
      v-model="visible"
      width="90%"
      :show-close="false"
  >
    <template #header>
      <div class="header">
        提交种草
      </div>
    </template>
    <el-form ref="scoreRecordRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="种草链接" prop="sharedLink">
        <el-input v-model="form.sharedLink" type="textarea" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="种草图片" prop="sharedPicture">
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
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>

  </el-dialog>
</template>

<script setup>

import {submitScoreRecord} from "@/api/KuiHua/scoreRecord.js";

const visible = defineModel()
import {Plus} from '@element-plus/icons-vue'

const uploadRef = ref(null)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref([])
const {proxy} = getCurrentInstance();
const data = reactive({
  form: {},
  rules: {
    sharedLink: [
      {required: true, message: "种草链接不能为空", trigger: "blur"}
    ],
    sharedPicture: [
      {required: true, message: "种草链接不能为空", trigger: "blur"}
    ],
  }
});

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
  form.value.sharedPicture = fileList.value.map(meta => meta.raw)
  proxy.$refs["scoreRecordRef"].validate(valid => {
    if (valid) {
      const formData = new FormData()
      // 将所有文件添加到 FormData
      formData.append("sharedLink", form.value.sharedLink)
      fileList.value.forEach(file => {
        formData.append('sharedPicture', file.raw);
      });
      submitScoreRecord(formData).then(res => {
        proxy.$modal.msgSuccess("提交成功");
        visible.value = false;
      })
    }
  });
}

</script>

<style lang="scss" scoped>

:deep(.el-upload-list--picture-card) {
  --el-upload-list-picture-card-size: 80px
}

:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 80px
}
</style>