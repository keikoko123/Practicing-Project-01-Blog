<template>
  <div>
    dashboard
    {{ adminStore }}
    <hr />
  </div>

  <div class="main-panel">
    <div class="menus">
      <!-- <div v-for="(menu, index) in menus" :key="menu.name" @click="router.push(menu.path)"> -->
      <div
        v-for="(menu, index) in menus"
        :key="menu.name"
        @click="toPage(menu)"
      >
        {{ menu.name }}
        <!-- <n-icon :name="menu.icon"></n-icon> -->
      </div>
    </div>

    <div style="padding: 20px; width: 90%">
      <router-view></router-view>
    </div>

    <div class="title">後台管理系統</div>
  </div>

  <div></div>
  <div></div>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
const message = inject("message");
const axios = inject("axios");

import { useAdminStore } from "../../stores/AdminStore";
const adminStore = useAdminStore();

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();



let menus = [
  // { name: "分類管理", icon: "el-icon-s-data", path: "/category" },
  { name: "文章管理", icon: "el-icon-s-order", href: "/dashboard/article" },
  { name: "分類管理", icon: "el-icon-s-data", href: "/dashboard/category" },
  { name: "退出", icon: "el-icon-s-data", href: "/logout" },
];

const toPage = (menu) => {
  if (menu.href == "/logout") {
    router.push("/login");
  } else {
    console.log(menu);
    router.push(menu.href);
  }
};
</script>

<style lang="scss" scoped>
.main-panel {
  display: flex;
  color: #ab2d2d;
  max-width: 1500px;
  margin: 0;
}

.menus {
  width: 180px;
  height: 95vh;
  padding: 20px;
  line-height: 55px;
  box-sizing: border-box;
  border-right: #ab2d2d 1px solid;

  div {
    cursor: pointer;
    &:hover {
      background-color: #ab2d2d;
      color: blue;
    }
  }
}

.title {
  font-size: 65px;
  font-weight: bold;
  bottom: 20px;
  text-align: right;
  position: fixed;
  color: #837d7d;
  right: calc((100vw - 1500px) / 2);
  bottom: 20px;
}
</style>
