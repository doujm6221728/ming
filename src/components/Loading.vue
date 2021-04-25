<template>
  <teleport to="#back"> 
    <div
      class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
      :style="{backgroundColor: background || ''}"
    >
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ text || 'loading'}}</span>
        </div>
        <p v-if="text" class="text-primary small">{{text}}</p>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String
    },
    background : {
      type: String
    }
  },

  setup() {
    // Teleport (瞬移组件的位置)  
    // 为防止父元素影响 loading，移动组件到新的 div元素下
    const node = document.createElement('div')
    node.id = 'back'
    document.body.appendChild(node)

    // 跳转后删除该节点
    onUnmounted(() => {
      document.body.removeChild(node)
    })
  }
})
</script>

<style scoped>
.loading-container {
  background: rgba(255, 255, 255, .5);
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
}
.loading-content {
  text-align: center;
}
</style>
