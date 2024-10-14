<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="auto">
      <el-form-item label="用户手机号" prop="nickName">
        <el-input
            v-model="queryParams.nickName"
            placeholder="请输入用户手机号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="团队名称" prop="teamName">
        <el-input
            v-model="queryParams.teamName"
            placeholder="请输入团队名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" style="width: 180px;" placeholder="请选择状态" clearable>
          <el-option
              v-for="dict in kh_shared_check"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="积分" prop="score">
        <el-input
            v-model="queryParams.score"
            placeholder="请输入积分"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="primary"-->
      <!--            plain-->
      <!--            icon="Plus"-->
      <!--            @click="handleAdd"-->
      <!--            v-hasPermi="['KuiHua:scoreRecord:add']"-->
      <!--        >新增-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="success"-->
      <!--            plain-->
      <!--            icon="Edit"-->
      <!--            :disabled="single"-->
      <!--            @click="handleUpdate"-->
      <!--            v-hasPermi="['KuiHua:scoreRecord:edit']"-->
      <!--        >修改-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--            type="danger"-->
      <!--            plain-->
      <!--            icon="Delete"-->
      <!--            :disabled="multiple"-->
      <!--            @click="handleDelete"-->
      <!--            v-hasPermi="['KuiHua:scoreRecord:remove']"-->
      <!--        >删除-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['KuiHua:scoreRecord:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">

        <el-popover :visible="cdpOpen" placement="bottom-end" :width="400" style="padding: 20px;">
          <el-input v-model="cdpForm.clientId" style="margin-bottom: 10px" placeholder="开发者key"></el-input>
          <el-input v-model="cdpForm.clientSecret" style="margin-bottom: 10px" placeholder="开发者秘钥"></el-input>
          <div style="text-align: right; margin: 0">
            <el-button size="small" type="primary" @click="handlePut2Cdp">
              推送
            </el-button>
          </div>
          <template #reference>
            <el-button
                type="warning"
                plain
                icon="Upload"
                @click="cdpOpen = !cdpOpen"
                v-hasPermi="['KuiHua:scoreRecord:export']"
            >推送到CDP
            </el-button>
          </template>
        </el-popover>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="scoreRecordList" @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="序号" width="60" align="center" prop="recordId"/>
      <el-table-column label="用户手机号" align="center" prop="nickName"/>
      <el-table-column label="团队名称" align="center" prop="teamName"/>

      <el-table-column label="积分" align="center" prop="score"/>
      <el-table-column label="上传时间" align="center" prop="createTime"/>
      <el-table-column label="种草链接" align="center" prop="sharedLink">
        <template #default="scope">
          <el-link :href="scope.row.sharedLink" type="primary" target="_blank">检查链接</el-link>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
<!--          <dict-tag :options="kh_shared_check" :value="scope.row.status"/>-->
          <el-switch
              v-model="scope.row.status"
              active-value="Normal"
              inactive-value="Invalid"
              @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="updateTime"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['KuiHua:scoreRecord:edit']">审核
          </el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['KuiHua:scoreRecord:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改葵花分数记录对话框 -->
    <el-dialog title="种草审核" v-model="open" width="1200px" append-to-body>
      <el-descriptions :column="2">
        <el-descriptions-item label="用户手机号">{{ form.nickName }}</el-descriptions-item>
        <el-descriptions-item label="团队名称">{{ form.teamName }}</el-descriptions-item>
        <el-descriptions-item label="种草链接" :span="2">
          <el-link :href="form.sharedLink" type="primary" target="_blank">检查链接</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="种草图片" :span="2">
          <div class="shared-imgs">
            <el-image class="img" v-for="img in form.sharedPicture"
                      :src="'/oss-api'+img"
                      @click="handleOnPreview('/oss-api'+img)"
                      fit="cover"/>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <el-dialog v-model="dialogVisible" width="1200px">
        <img style="width: 100%;" :src="dialogImageUrl" alt="Preview Image"/>
      </el-dialog>
      <el-form ref="scoreRecordRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in kh_shared_check"
                :key="dict.value"
                :label="dict.value"

            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup name="ScoreRecord">
import {
  listScoreRecord,
  getScoreRecord,
  delScoreRecord,
  addScoreRecord,
  updateScoreRecord, put2Cdp
} from "@/api/KuiHua/scoreRecord";

const {proxy} = getCurrentInstance();
const {kh_shared_check} = proxy.useDict('kh_shared_check');
const prifix = ref(import.meta.env.VITE_APP_BASE_API)
const scoreRecordList = ref([]);
const open = ref(false);
const cdpOpen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null,
    teamName: null,
    status: null,
    score: null,
  },
  rules: {
    status: [
      {required: true, message: "状态不能为空", trigger: "change"}
    ],
  }
});

const cdpForm = ref({
  clientId: null,
  clientSecret: null
})

const {queryParams, form, rules} = toRefs(data);

function handlePut2Cdp() {
  if (cdpForm.value.clientId && cdpForm.value.clientSecret) {
    put2Cdp(cdpForm.value.clientId, cdpForm.value.clientSecret).then(res => {
      proxy.$modal.msgSuccess("推送成功", res.msg);
    })
  }

}

function handleStatusChange(row) {
  form.value = row;
  submitForm()
}

/** 查询葵花分数记录列表 */
function getList() {
  loading.value = true;
  listScoreRecord(queryParams.value).then(response => {
    scoreRecordList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

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

function handleOnPreview(url) {
  dialogVisible.value = true;
  dialogImageUrl.value = url;
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.recordId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加葵花分数记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _recordId = row.recordId || ids.value
  getScoreRecord(_recordId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改葵花分数记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["scoreRecordRef"].validate(valid => {
    if (valid) {
      if (form.value.recordId != null) {
        updateScoreRecord(form.value).then(response => {
          proxy.$modal.msgSuccess("审核成功");
          open.value = false;
          getList();
        });
      } else {
        addScoreRecord(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _recordIds = row.recordId || ids.value;
  proxy.$modal.confirm('是否确认删除葵花分数记录编号为"' + _recordIds + '"的数据项？').then(function () {
    return delScoreRecord(_recordIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('KuiHua/scoreRecord/export', {
    ...queryParams.value
  }, `种草记录导出_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style lang="scss" scoped>
.shared-imgs {
  display: grid;
  grid-template-columns: repeat(
        auto-fill,
          minmax(25%, 1fr)
      );
  gap: 20px;

  .img {
    width: 250px;
    height: 250px;
    cursor: pointer;
  }
}
</style>