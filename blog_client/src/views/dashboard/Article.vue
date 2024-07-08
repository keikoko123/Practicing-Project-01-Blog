<template>
  <div>Article</div>

  <n-card title="文章管理" style="margin-bottom: 16px">

    <n-tabs default-value="list" justify-content="start" type="line">

      <n-tab-pane name="list" tab="文章列表" > Wonderwall 
          <div v-for="(blogItem, index) in blogListInfo" style="margin-bottom:15px">

            <n-card :title="blogItem.title" >
                {{ blogItem.content }}


                
                  <template #footer>
                    <n-space align="center">
                      <div>發布時間:{{blogItem.create_time}}</div>
                      <n-button type="primary" @click="edit(blogItem)">編輯</n-button>
                      <n-button type="error" @click="del(blogItem)">刪除</n-button>


                    </n-space>
                </template>
            </n-card>


          </div>

      </n-tab-pane>


      <n-tab-pane name="add" tab="添加文章">  Hey Jude 
        <n-form>

          <n-form-item label="title" >
            <n-input v-model:value="addArticleObj.title"   placeholder="输入標題"   />
          </n-form-item>

          <n-form-item label="分類" >
            <n-select v-model:value="addArticleObj.category_id"  :options="options_category" />
          </n-form-item>


  
          <n-form-item label="content" >
             <rich-text-editor v-model="addArticleObj.content">
             </rich-text-editor>
          </n-form-item>

          
          <n-form-item label="" >
            <n-button type="primary" @click="add">添加文章</n-button>
            <!-- </rich-text-editor> -->
         </n-form-item>

        </n-form>
      </n-tab-pane>



      <n-tab-pane name="jay chou" tab="周杰伦"> 七里香 


      </n-tab-pane>

    </n-tabs>
  </n-card>
  {{ addArticleObj.content }}
</template>

<script setup>
import { ref, reactive, inject, onMounted } from "vue";
const message = inject("message");
const axios = inject("axios");
const dialog = inject("dialog");

import { useAdminStore } from "../../stores/AdminStore";
const adminStore = useAdminStore();

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

import RichTextEditor from "../../components/RichTextEditor.vue";




const showAddModel = ref(false);
const addArticleObj = reactive({
  category_id:0,
  title: "",
  content:"hello",
});




const options_category = ref([]);

const blogListInfo = ref([])

onMounted(()=>{
  loadCategoryList();

  loadBlogList();
})

const loadCategoryList = async () => {
  const res = await axios.get("/category/list");
  console.log(res.data.rows);
  // categoryList.value = res.data;
  options_category.value = res.data.rows.map((item) => {
    return { label: item.name, value: item.id };
  });
  console.log(options_category);
};

const loadBlogList = async () => {
  const res = await axios.get("/blog/search");


  // 
  let temp_rows = res.data.data.rows;

  for(let row of temp_rows){
    row.content += "....";
    let d = new Date(row.create_time);
    // row.create_time = d.toLocaleString();
    row.create_time = `${d.getFullYear()}年-${d.getMonth() + 1}月-${d.getDate()}日 | ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  }
  //  
  blogListInfo.value = res.data.data.rows;
  console.log(res);
  console.log(res.data.data.rows);
};



const add = async () => {
  let result = await axios.post(
    "/blog/_token/add",
    addArticleObj
 );

  console.log(result);
  if(result.data.code == 200){
    message.info("添加成功" , result.data.message);
    
    // addArticleObj.data = { ...initialState}
    addArticleObj.title = "";
    addArticleObj.category_id = 0;
    addArticleObj.content = ""; //雖然有用， 但是textarea 內並沒有清空 
  }else{
    message.error("添加失敗", result.data.message);
  }
  // showAddModel.value = false;
};



</script>

<style lang="scss" scoped></style>
