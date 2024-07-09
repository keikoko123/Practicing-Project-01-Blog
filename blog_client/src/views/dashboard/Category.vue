<template>
  <div>category</div>
  <hr />

  <div>
    <n-button type="primary" @click="showAddModel = true">添加分類</n-button>

    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>編號</th>
          <th>名稱</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(categoryItem, index) in categoryList">
          <td>{{ categoryItem.id }}</td>
          <td>{{ categoryItem.name }}</td>
          <td>
            <n-space>
              <n-button type="primary" size="small" @click="toUpdate(categoryItem)">編輯</n-button>
              <n-button
                type="error"
                size="small"
                @click="deleteCategory(categoryItem)"
                >刪除</n-button
              >
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>
<!-- ---------------------------------------------------------------------- -->
    <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
      <template #header>
        <div>添加分類</div>
      </template>
      <div>
        <n-input
          v-model:value="addCategory.name"
          type="text"
          placeholder="input here"
        />
      </div>
      <template #action>
        <div><n-button @click="add">提交</n-button></div>
      </template>
    </n-modal>
<!-- ---------------------------------------------------------------------- -->

    <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
      <template #header>
        <div>修改分類</div>
      </template>
      <div>
        <n-input
          v-model:value="updateModel.name"
          type="text"
          placeholder="input here"
        />
      </div>
      <template #action>
        <div><n-button @click="update">提交</n-button></div>
      </template>
    </n-modal>


  </div>
</template>

<!-- step 1: DO A REQUEST TO BACKEND FOR FETCHING DATA   -->
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

const showAddModel = ref(false);

const categoryList = ref([]);
const addCategory = reactive({
  name: "",
});

//init的動作 mounted的動作
onMounted(async () => {
  loadDatas();
});

const loadDatas = async () => {
  let result = await axios.get("/category/list");
  categoryList.value = result.data.rows;
  console.log(categoryList);
  console.log(categoryList.value);
};

const add = async () => {
  // console.log(adminStore.token);
  let result = await axios.post(
    "/category/_token/add",
  {  name: addCategory.name, }
  // { headers :  { token : adminStore.token } }
 );

  console.log(result);
  if(result.data.code == 200){
    message.info("添加成功" , result.data.message);
    loadDatas();
  }else{
    message.error("添加失敗", result.data.message);
  }
  showAddModel.value = false;

};


// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

const showUpdateModel = ref(false);

const updateModel = reactive({
  id:0,
  name: ""
});

const toUpdate = async (categoryItem) => {
  showUpdateModel.value = true;
  updateModel.id = categoryItem.id;
  updateModel.name = categoryItem.name;
};

const update = async () => {
  let result = await axios.put(
    "/category/_token/update",
  { id:updateModel.id, name: updateModel.name , } );

  console.log(result);
  if(result.data.code == 200){
    message.info("添加成功" , result.data.message);
    loadDatas();
  }else{
    message.error("添加失敗", result.data.message);
  }
  showUpdateModel.value = false;


};


// ----------------------------------------------------------------------

const deleteCategory = async (categoryItem) => {

  dialog.warning({
          title: '警告',
          content: '刪除後則不能復原 你确定要刪除？',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            message.success('确定')
            let result = await axios.delete(
              `/category/_token/delete?id=${categoryItem.id}`
            );

            console.log(result);
            if(result.data.code == 200){
              message.info("刪除成功" , result.data.message);
              loadDatas();
            }else{
              message.error("刪除失敗", result.data.message);
            }
          },
          onNegativeClick: () => {
            // message.error('不确定')
          }
        }
  )
};


</script>

<style lang="scss" scoped></style>
