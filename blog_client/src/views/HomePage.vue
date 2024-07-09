
<template>
<div class="container">

    <div class="nav">
        <div @click="homePage">首頁</div> |


        <div>
            <n-popselect  v-model:value="selectedCategory" :options="categoryOptions" trigger="click" @update:value="searchByCategory">
                分類     
            </n-popselect>
            <span>{{categoryName}}</span>
              

        </div>

        

        | <div @click="dashboard">後台</div>
    </div>





    <n-divider />


      <n-space class="search">
        <n-input v-model:value="pageInfo.keyword"  :style="{ width : '350px'}"     placeholder="輸入關鍵字" />
          <n-button type="primary"  ghost  @click="loadForSearch" >Search     </n-button>
      </n-space>


           <!-- 文章列表 CONTENT...... -->
          <div v-for="(blogItem, index) in blogListInfo" style="margin-bottom:15px">

            <n-card :title="blogItem.title"  @click="toDetail(blogItem)"  style="margin-bottom:15px; cursor: pointer">
                {{ blogItem.content }}
                  <template #footer>
                    <n-space align="center">
                      <div>發布時間:{{blogItem.create_time}}</div>
                    </n-space>
                </template>
            </n-card>


          </div>



          <n-pagination v-model:page="pageInfo.page" :page-count="pageInfo.pageCount"  @update:page="loadBlogList" />



          <hr>
          <!-- <n-space>
            <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount" >
              <n-button type="primary" size="small" >
                <div :style="'color:' + (pageNum===pageInfo.page? 'FloralWhite' : 'DimGrey') ">{{pageNum}}</div> 
              </n-button>
            </div>
          </n-space> -->
          
    <n-divider />





    <hr>
    <div class="footer">
        <div>Power by LIU CHUN CHOENG</div>
        <div>HKBU CST 2023-2025</div>
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


const selectedCategory = ref(0)

const categoryOptions  = ref([]);

const categoryName = computed(()=>{
    let selectedOption =  categoryOptions.value.find( (option)=>{ return option.value === selectedCategory.value})
    return selectedOption ? selectedOption.label : ""
}
)

const loadCategory = async () => {
  let result = await axios.get("/category/list");

  categoryOptions.value = result.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  console.log(categoryOptions.value);
};


const homePage = () => {
  router.push("/");
};

const dashboard = () => {
  router.push("/login");
};


onMounted(() => {
  loadCategory();
  loadBlogList();
});

// ------------------------- MAIN PAGE
const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
  keyword:"",
  category_id:0
});
const blogListInfo = ref([])


const loadForSearch = async ()=>{
    pageInfo.page = 1;
    loadBlogList()
}


const loadBlogList = async ( ) => {
    

  const res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&category_id=${pageInfo.category_id}`);

  let temp_rows = res.data.data.rows;

  for(let row of temp_rows){
    row.content += "....";
    let d = new Date(row.create_time);
    // row.create_time = d.toLocaleString();
    row.create_time = `${d.getFullYear()}年-${d.getMonth() + 1}月-${d.getDate()}日 | ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  }
  //  
  blogListInfo.value = res.data.data.rows;
  pageInfo.count = res.data.data.countTotal;
  pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize);
  console.log(res);
  console.log(pageInfo)

};

const toPage = async (pageNum) => {
  pageInfo.page = pageNum
  loadBlogList();
}

const toDetail = (blogItem) => {
  // router.push(`/detail/${blogItem.id}`);
  console.log(blogItem.id)
  router.push( { path:'/detail',   query: { id: blogItem.id }      }  )
};



// const toDetail = (blog)=>{
//     router.push({path:"/detail",query:{id:blog.id}})
// }


const searchByCategory = (category_id) => {
  console.log(category_id)
  pageInfo.category_id = category_id;

  loadBlogList();
};


</script>












<style lang='scss' scoped>
    .container{
        width: 1200px;
        margin:0 auto;
    }

    .footer{
        text-align: center;
        line-height: 25px;
        padding-top: 20px;
        color: #646743;
    }

    .search{
        margin-bottom: 15px ;
    }

    .nav{
        display: flex;
        font-size: 20px;
        padding-top: 20px;
        color: #646743;

        width: 100%;
        div{
            cursor: pointer;
            margin-right: 15px;
            &:hover{
                color: #f60;
            }

            span{
                font-size: small;
            }
        }

    }


</style>
