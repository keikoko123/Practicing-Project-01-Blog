<template>
  RichTextEditor
  <div style="border: 1px solid #ccc; margin-top: 10px">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #ccc"
    />

    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      style="height: 400px; overflow-y: hidden"
      @onCreated="handleCreated"
      @onChange="handleChange"
      @onDestroyed="handleDestroyed"
    />
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css";
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  reactive,
  inject,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
const server_url = inject("server_url");

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

const toolbarConfig = { excludeKeys : ['uploadVideo'] };

const mode = ref("default");

const editorConfig = { placeholder: "请输入内容..." };
editorConfig.MENU_CONF = {};
// editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF["uploadImage"] = {
  base64LimitSize: 10 * 1024, // 10kb
  server: server_url + "/upload/rich_editor_upload",
};

// https://www.diffchecker.com/text-compare/
editorConfig.MENU_CONF["insertImage"] = {
  parseImageSrc: (src) => {  //  typo ---> praseImageSrc
    if (src.indexOf("http") !== 0) {
      return `${server_url}${src}`;
    }
    return src;
  },
};


const valueHtml = ref("");

// -------------------

// const props = defineProps<{
//   value: string;
// }>();

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
// -------------------
let initFinish = false;
// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = props.modelValue;
    // valueHtml.value = '<p></p>';
    initFinish = true;
  }, 10);
});

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
  console.log("created", editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  if(initFinish){
      //   console.log('change:', editor.getHtml());
      emit('update:modelValue', valueHtml.value);
  }
};
const handleDestroyed = (editor) => {
  console.log("destroyed", editor);
};
</script>

<style lang="scss" scoped></style>
