<template>
  <div>Father | APP.VUE</div>
  <hr />
  <n-message-provider>
    Children | <router-view></router-view>
    <!-- { path: '/test123',  component: () => import('../views/Test.vue') },  -->
  </n-message-provider>
  <hr />

  <!-- <n-space>
      <n-button>Default</n-button>
    </n-space> -->
</template>

<script setup>
// import HelloWorld from './components/HelloWorld.vue'
</script>

<style scoped></style>
