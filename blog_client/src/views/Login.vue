<template>
  <div class="login-panel">
    <n-card title="管理後台登陸">
      <n-form ref="formRef" :rules="rules" :model="admin">
        <n-form-item :span="12" label="Account" path="account">
          <n-input v-model:value="admin.account" placeholder="Input Account" />
        </n-form-item>

        <n-form-item :span="12" label="Password" path="password">
          <n-input
            v-model:value="admin.password"
            placeholder="Input Password"
          />
        </n-form-item>
      </n-form>

      <!-- <template> -->
        <n-checkbox v-model:checked="admin.remember">Remember Me</n-checkbox>
        <n-button @click="login">Login</n-button>
      <!-- </template> -->

    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import {useAdminStore} from "../stores/AdminStore";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

// import { useMessage } from 'naive-ui'
// const message = useMessage()
const message = inject("message");

const axios = inject("axios");
const adminStore = useAdminStore();

let rules = {
  account: [
    { required: true, message: "Please input account", trigger: "blur" },
    {
      min: 3,
      max: 10,
      message: "account Length should be 3 to 10",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "Please input password", trigger: "blur" },
    {
      min: 3,
      max: 10,
      message: "password Length should be 6 to 12",
      trigger: "blur",
    },
  ],
};

const admin = reactive({
  account:  localStorage.getItem("accountInLocal") || "",
  password: localStorage.getItem("passwordInLocal") || "",
  remember: localStorage.getItem("rememberInLocal") === "1" ? true : false,
});

const login = async () => {
  // console.log(admin);
  let result = await axios.post("/admin/login", {
    account: admin.account,
    password: admin.password,
  });

  if(result.data.code === 200){
    console.log(adminStore.token, ' --- ' ,adminStore.account ,' --- ' , adminStore.id);
    adminStore.token = result.data.data.token
    adminStore.account = result.data.data.account
    adminStore.id = result.data.data.id
    console.log(adminStore.token, ' --- ' ,adminStore.account ,' --- ' , adminStore.id);
    message.info(" 登陸-太陽-成功");

    if(admin.remember){
      localStorage.setItem("accountInLocal", admin.account);
      localStorage.setItem("passwordInLocal", admin.password);
      localStorage.setItem("rememberInLocal",  admin.remember?1:0);
    }

    router.push("/dashboard");

  }else{
    // console.log(result.data.message);
    // message.error(result.data.message);
    message.error(" 登陸-失敗");


  }

  console.log(result);
//   data
// : 
// code
// : 
// 200
// data
// : 
// {id: 1, account: 'admin123', password: '', token: '734d11a6-a8ac-42e5-81d6-f8cfac237f23'}
// msg
// : 
// "Login succeed"
// [[Prototype]]
// : 
// Object


};
</script>

<style lang="scss" scoped>
.login-panel {
  width: 500px;
  margin: 0 auto;
  margin-top: 130px;
  display: flex;
}
</style>
