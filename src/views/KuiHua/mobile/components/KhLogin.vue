<template>
  <el-dialog
      class="login-dialog-wrapper"
      v-model="visible"
      width="90%"
      append-to-body
      style="padding: 0;background-color: transparent;margin-top: 30vh !important;"
      :show-close="false"
  >
    <!--    <template #header>-->
    <!--      <div class="header">-->
    <!--        注册并参与活动-->
    <!--      </div>-->
    <!--    </template>-->

    <el-form v-if="model === 'register'" ref="registerRef" :model="registerForm" :rules="registerRules"
             class="register-form">
      <el-form-item prop="phone">
        <el-input
            input-style="kuihua-input"
            v-model="registerForm.phone"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="手机号"
        >
        </el-input>
      </el-form-item>
      <!--      <el-form-item prop="wechatNumber">-->
      <!--        <el-input-->
      <!--            v-model="registerForm.wechatNumber"-->
      <!--            type="text"-->
      <!--            size="large"-->
      <!--            auto-complete="off"-->
      <!--            placeholder="微信号"-->
      <!--        >-->
      <!--          <template #prefix>-->
      <!--            <svg-icon icon-class="user" class="el-input__icon input-icon"/>-->
      <!--          </template>-->
      <!--        </el-input>-->
      <!--      </el-form-item>-->
      <el-form-item prop="teamCode">
        <el-input
            v-model="registerForm.teamCode"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="团队邀请码"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            v-model="registerForm.password"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="确认密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
            size="large"
            v-model="registerForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
        >
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img"/>
        </div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
            color="#005adb"
            :loading="loading"
            size="large"
            type="primary"
            style="width:100%;height: 50px;font-family: 'HuaKang Yuan W7A',serif;"
            @click="handleRegister"
        >
          <span v-if="!loading">注册并登录</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right;">
          <el-button class="link-type" style="font-family: 'HuaKang Yuan W7A',serif;" type="text"
                     @click="model='login';getCode()">使用已有账户登录
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-form v-if="model === 'login'" ref="loginRef" :model="loginForm" :rules="loginRules" class="register-form">
      <el-form-item prop="username">
        <el-input
            v-model="loginForm.username"
            type="text"
            size="large"
            auto-complete="off"
            placeholder="手机号"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            auto-complete="off"
            placeholder="密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
            v-model="loginForm.code"
            size="large"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter="handleLogin"
        >
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img"/>
        </div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
            :loading="loading"
            color="#005adb"
            size="large"
            type="primary"
            style="width:100%;height: 50px;font-family: 'HuaKang Yuan W7A',serif;"
            @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;">
          <el-button class="link-type" style="font-family: 'HuaKang Yuan W7A',serif;" type="text"
                     @click="model='register';getCode()">立即注册
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import {getCodeImg} from "@/api/login.js";
import {ElMessageBox} from "element-plus";
import {khRegister} from "@/api/KuiHua/khuser.js";
import Cookies from "js-cookie";
import {decrypt, encrypt} from "@/utils/jsencrypt.js";
import useUserStore from "@/store/modules/user.js";
import {getToken, setToken} from "@/utils/auth.js";

const {proxy} = getCurrentInstance();
const visible = defineModel()
const props = defineProps({
  model: {
    type: String,
    default: "register"
  },
})
const model = ref("register")
const userStore = useUserStore()

const loginForm = ref({
  username: "",
  password: "",
  code: "",
  uuid: ""
});
const registerForm = ref({
  phone: "",
  wechatNumber: "",
  teamCode: "",
  password: "",
  confirmPassword: "",
  code: "",
  uuid: ""
});
const codeUrl = ref("");
const loading = ref(false);
const captchaEnabled = ref(true);
const equalToPassword = (rule, value, callback) => {
  if (registerForm.value.password !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const loginRules = {
  username: [{required: true, trigger: "blur", message: "请输入您的手机号"}],
  password: [{required: true, trigger: "blur", message: "请输入您的密码"}],
  code: [{required: true, trigger: "change", message: "请输入验证码"}]
};
const registerRules = {
  phone: [
    {required: true, trigger: "blur", message: "请输入您的手机号"},
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur'
    }
  ],
  // wechatNumber: [
  //   {required: true, trigger: "blur", message: "请输入您的微信号"},
  //   {min: 2, max: 20, message: "微信号长度必须介于 2 和 20 之间", trigger: "blur"}
  // ],
  teamCode: [
    {required: true, trigger: "blur", message: "请输入您的团队邀请码"},
    {min: 2, max: 20, message: "团队邀请码长度必须介于 2 和 20 之间", trigger: "blur"}
  ],
  password: [
    {required: true, trigger: "blur", message: "请输入您的密码"},
    {min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur"},
    {pattern: /^[^<>"'|\\]+$/, message: "不能包含非法字符：< > \" ' \\\ |", trigger: "blur"}
  ],
  confirmPassword: [
    {required: true, trigger: "blur", message: "请再次输入您的密码"},
    {required: true, validator: equalToPassword, trigger: "blur"}
  ],
  code: [{required: true, trigger: "change", message: "请输入验证码"}]
};

function getCode() {
  getCodeImg().then(res => {
    captchaEnabled.value = res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      registerForm.value.uuid = res.uuid;
    }
  });
}

function handleRegister() {
  proxy.$refs.registerRef.validate(valid => {
    if (valid) {
      loading.value = true;
      khRegister(registerForm.value).then(res => {
        const username = registerForm.value.phone;
        loading.value = false;
        setToken(res.token)
        userStore.token = res.token;
        ElMessageBox.alert("<font color='red'>恭喜你，您的账号 " + username + " 注册成功！</font>", "系统提示", {
          dangerouslyUseHTMLString: true,
          type: "success",
        }).then(() => {
          loading.value = false;
          visible.value = false
        }).catch(() => {
        });
      }).catch(() => {
        loading.value = false;
        if (captchaEnabled) {
          getCode();
        }
      });
    }
  });
}

function handleLogin() {
  proxy.$refs.loginRef.validate(valid => {
    if (valid) {
      loading.value = true;
      Cookies.set("username", loginForm.value.username, {expires: 30});
      Cookies.set("password", encrypt(loginForm.value.password), {expires: 30});
      Cookies.set("rememberMe", loginForm.value.rememberMe, {expires: 30});
      // 调用action的登录方法
      userStore.khlogin(loginForm.value).then(() => {
        visible.value = false
        loading.value = false;
      }).catch(() => {
        loading.value = false
        // 重新获取验证码
        if (captchaEnabled.value) {
          getCode();
        }
      });
    }
  });
}

function cookieLogin() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  if (username && !getToken()) {
    loginForm.value = {
      username: username,
      password: decrypt(password),
    };
    userStore.khlogin(loginForm.value).then(() => {
      visible.value = false
      console.log("cookies 登录成功")
    }).catch(() => {
      Cookies.remove("username");
      Cookies.remove("password");
    })
  }
}

cookieLogin();
getCode();
</script>

<style lang="scss" scoped>

:deep(.el-overlay) {
  .el-dialog:not(.is-fullscreen) {
    margin-top: 30vh !important;
  }
}
.login-dialog-wrapper {
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


  .header {
    text-align: center;

  }

  .register-form {
    border-radius: 8px;
    padding: 40px 20px;
    background: #ffffff;
    width: 100%;
    height: 480px;
    background: url("@/assets/images/login-background.png") no-repeat top center;
    background-size: cover; /* 图片覆盖整个容器 */
    .el-input {
      height: 50px;
      border: 2px #0A3279 solid;
      border-radius: 8px;

      :deep(input) {
        font-family: "HuaKang Yuan W7A", serif;
        font-size: 18px;
        text-align: center;
      }
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 0px;
    }
  }

  .register-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
  }

  .register-code {
    width: 33%;
    height: 40px;
    float: right;

    img {
      cursor: pointer;
      vertical-align: middle;
    }
  }

  .register-code-img {
    height: 40px;
    padding-left: 12px;
  }
}
</style>