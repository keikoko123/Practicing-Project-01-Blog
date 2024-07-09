
<template>
    <div class="container">
        <!-- <n-button @click='()=>{ router.push("/")}'>返回</n-button> -->
        <n-button @click='()=>{ router.push("/")}'>返回</n-button>
        
        <!-- title -->
        <n-h1>{{blogInfo.title}}</n-h1>


        <!-- content -->
         <div class="blog-content">
         <div v-html="blogInfo.content"> </div>

        </div>




    </div>
</template>


<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";


import { useAdminStore } from "../stores/AdminStore";

import { useRouter, useRoute } from "vue-router";
const adminStore = useAdminStore();

const router = useRouter();
const route = useRoute();

const message = inject("message");
const axios = inject("axios");
const dialog = inject("dialog");

onMounted(() => {
    loadBlogDetail()
});

// const blogInfo = reactive({
//     id: 0,
//     title: "",
//     content: "",
//     category_id: 0,
// });
const blogInfo = ref({})


const loadBlogDetail = async () => {
    console.log(route)
    console.log(route.query.id)

    const result = await axios.get("/blog/serachOneForView?id=" + route.query.id,);
    console.log(result);


    console.log(result.data.rows[0]);
    blogInfo.value = result.data.rows[0]
    console.log(blogInfo)
}

</script>





<style  >
    .blog-content img{
        max-width: 100% !important;  
    }
</style>


<style lang='scss' scoped>
    .container{
        width: 1200px;
        margin:0 auto;
    }



</style>
