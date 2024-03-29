<template>
  <div class="validate-input-container pb-3">
    <input type="text"
      v-if="tag !== 'textarea'"
      class="form-control"
      :value="inputRef.val"
      @input="updateValue"
      @blur="validateInput"
      :class="{'is-invalid': inputRef.error}"
      v-bind="$attrs" 
    >
    <textarea type="text"
      v-else
      class="form-control"
      :value="inputRef.val"
      @input="updateValue"
      @blur="validateInput"
      :class="{'is-invalid': inputRef.error}"
      v-bind="$attrs" 
    />
    <span class="invalid-feedback" v-if="inputRef.error">{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted } from 'vue'
import {emitter} from './ValidateForm.vue'

const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

interface RuleProp {
  type: 'required' | 'email' | 'custom';
  message: string;
  validator?: () => boolean;
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'

export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  //禁止组件的根元素继承到Attribute
  inheritAttrs: false,

  setup(props, context) {

    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })

    const updateValue = (e: KeyboardEvent) => {
      const targetValue =  (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }

    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed  = (inputRef.val.trim() !== '')
              break 
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'custom':
              passed = rule.validator ? rule.validator() : true
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }

    const clearInput = () => {
      inputRef.val = ''
      emitter.emit('update:modelValue', '')
    }
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
      emitter.on('clearInput', clearInput)
    })
    
    return {
      inputRef,
      validateInput,
      updateValue,
      clearInput
    }
  },
})
</script>
