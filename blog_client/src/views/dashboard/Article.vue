<template>
  <div>Article</div>

  <n-card title="文章管理" style="margin-bottom: 16px">

    <!-- <n-tabs default-value="list" justify-content="start" type="line"> -->
    <n-tabs  v-model:value="tabValue" justify-content="start" type="line">

      <n-tab-pane name="list" tab="文章列表" > 
        <!-- 文章列表 CONTENT...... -->
          <div v-for="(blogItem, index) in blogListInfo" style="margin-bottom:15px">

            <n-card :title="blogItem.title" >
                {{ blogItem.content }}


                
                  <template #footer>
                    <n-space align="center">
                      <div>發布時間:{{blogItem.create_time}}</div>
                      <n-button type="primary" @click="toEdit(blogItem)">EDIT</n-button>
                      <n-button type="error" @click="toDelete(blogItem)">DELETE</n-button>
                    </n-space>
                </template>
            </n-card>


          </div>

          <n-space>
            <div @click="toPage(pageNum)" v-for="pageNum in pageInfo.pageCount" >
              <n-button type="primary" size="small" >
                <div :style="'color:' + (pageNum===pageInfo.page? 'FloralWhite' : 'DimGrey') ">{{pageNum}}</div> 
              </n-button>
            </div>
          </n-space>

      </n-tab-pane>


      <n-tab-pane name="add" tab="添加文章">   
        <!-- 添加文章" CONTENT...... -->

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
            <n-button type="primary" @click="toAdd">添加文章</n-button>
            <!-- </rich-text-editor> -->
         </n-form-item>

        </n-form>

      </n-tab-pane>






      <n-tab-pane name="update" tab="修改文章"> 
          <!-- 修改文章ContentXXXXX -->
        <n-form>

          <n-form-item label="title" >
            <n-input v-model:value="updateArticleObj.title"   placeholder="输入標題"   />
          </n-form-item>

          <n-form-item label="分類" >
            <n-select v-model:value="updateArticleObj.category_id"  :options="options_category" />
          </n-form-item>


  
          <n-form-item label="content" >
             <rich-text-editor v-model="updateArticleObj.content">
             </rich-text-editor>
          </n-form-item>

          
          <n-form-item label="" >
            <n-button type="primary" @click="updateOne">更新文章</n-button>
            <!-- </rich-text-editor> -->
         </n-form-item>

        </n-form>

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

const pageInfo = reactive({
  page: 1,
  pageSize: 3,
  pageCount: 0,
  count: 0,
});

const toPage = async (pageNum) => {
  pageInfo.page = pageNum
  loadBlogList();
}

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
  const res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`);

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



const toAdd = async () => {
  let result = await axios.post(
    "/blog/_token/add",  // url
    addArticleObj // post.body
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

  loadBlogList();

  // showAddModel.value = false;
};





// PART 3 FUNCTION ---------------------
const updateArticleObj = reactive({
  id:0,
  title:"",
  category_id:0,
  content:"",
  category_idXXX:0,
  category_idXSADASSXX:0,
  category_idXASDASDSADASSXX:0,

})

const tabValue = ref("list");

const toEdit = async (blogItem) => {
  tabValue.value = "update";

  const result = await axios.get("/blog/_token/serachOne?id=" + blogItem.id,);
  console.log(result);
  updateArticleObj.id = blogItem.id;
                          //data.data.rows[0]
  updateArticleObj.title = result.data.rows[0].title;
  updateArticleObj.content = result.data.rows[0].content;
  updateArticleObj.category_id = result.data.rows[0].category_id;
  loadBlogList();
}

const updateOne = async()=>{
  let result = await axios.put( //　 axios.put　！＝　axios.post
    "/blog/_token/update",  // url
    updateArticleObj  // post.body
                  //     {
                  //     "title": "zxzcx", 
                  //      "content": "<p>hellozxcxc</p>",
                  //     "id" : 584105169047621,
                  //      "category_id": 0,
                  //      "idsdads": "dsaasddsa",
                  //      "catdadasd_id": 9867876,
                  //      "corasdasdy_id": 3123
                  //      }
 );

  console.log(result);
  if(result.data.code == 200){
    message.info("更新成功" , result.data.message);
    
    // addArticleObj.data = { ...initialState}
    addArticleObj.title = "";
    addArticleObj.category_id = 0;
    addArticleObj.content = ""; //雖然有用， 但是textarea 內並沒有清空 

    loadBlogList();
    tabValue.value = "list";

  }else{
    message.error("更新失敗", result.data.message);
  }
  
}



const toDelete = async(blogItem)=>{


  dialog.warning({
          title: '警告',
          content: '刪除後則不能復原 你确定要刪除？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            message.success('确定')

            const result = await axios.delete("/blog/_token/delete?id=" + blogItem.id,);

            console.log(result);
            if(result.data.code == 200){
              message.info("更新成功" , result.data.message);
              loadBlogList();

            }else{
              message.error("更新失敗", result.data.message);
            }

          },
          onNegativeClick: () => {
            // message.error('不确定')
          }
        }
  )












}






</script>

<style lang="scss" scoped></style>
