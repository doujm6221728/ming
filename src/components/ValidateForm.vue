<template>
  <form class="validate-form-container">
    <slot></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <button class="btn btn-primary" type="submit">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import mitt from 'mitt'
export const emitter = mitt()
type validateFunc = () => boolean   //类型定义

export default defineComponent({
  emits: ['form-submit'],
  setup(props, context) {
    const submitForm = () => {
      const result = funcArr.map(func => func()).every(result => result)
      if(result) {
        context.emit("form-submit", result)
      } else {
        emitter.emit('clearInput')
      }
    }

    let funcArr: validateFunc[] = []
    //mitt（第三方事件监听器），监听子组件validateinput.vue
    const callback = (func?: validateFunc) => {
      if(func) {
        funcArr.push(func)
      }
    }

    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })

    return {
      submitForm
    }
  }
})
</script>
