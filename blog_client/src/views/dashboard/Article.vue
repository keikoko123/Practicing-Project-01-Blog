<template>
  <div>Article</div>

  <n-card title="歌曲" style="margin-bottom: 16px">

    <n-tabs default-value="oasis" justify-content="start" type="line">

      <n-tab-pane name="oasis" tab="Oasis"> Wonderwall 


      </n-tab-pane>


      <n-tab-pane name="add" tab="添加文章">  Hey Jude 
        <n-form>

          <n-form-item label="title" >
            <n-input v-model:value="addArticle.title"   placeholder="输入標題"   />
          </n-form-item>
  
          <n-form-item label="content" >
            <rich-text-editor v-model="addArticle.content">

             </rich-text-editor>
          </n-form-item>

          

        </n-form>
      </n-tab-pane>



      <n-tab-pane name="jay chou" tab="周杰伦"> 七里香 


      </n-tab-pane>

    </n-tabs>
  </n-card>
  {{ addArticle.content }}
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

const categoryList = ref([]);
const addArticle = reactive({
  category_id:0,
  title: "",
  content:"hello",
});


</script>

<style lang="scss" scoped></style>
