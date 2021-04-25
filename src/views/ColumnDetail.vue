<template>
  <div class="column-detail-page w-75 mx-auto">
      <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
        <div class="col-3 text-center">
          <img :src="column.avatar && column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100">
        </div>
        <div class="col-9">
          <h4>{{column.title}}</h4>
          <p class="text-muted">{{column.description}}</p>
        </div>
      </div>
      <post-list :list="posts"></post-list>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router' //useRoute 获取路由的信息，是vue-router其中的一个钩子函数
import { useStore } from 'vuex'
import { GlobalDateProps, ColumnProps } from '../store'
import PostList from '../components/PostList.vue'
import { addColumnAvatar } from '../helper'

export default defineComponent({
  components: {
    PostList
  },
  setup() {
    const route = useRoute() //useRoute的调用方法
    const store = useStore<GlobalDateProps>()
    const currentId = route.params.id

    // const column = computed(() => store.state.columns.find(c => c.id == currentId))  
    // const posts = computed(() => store.state.posts.filter(c => c.column == currentId))
    // const column = computed(() => store.getters.getColumnById(currentId)) //使用store里的getters属性（相当于计算属性）
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId) as ColumnProps | undefined
      if (selectColumn) {
        addColumnAvatar(selectColumn, 100, 100)
      }
      return selectColumn
    })
    const posts = computed(() => store.getters.getPostsById(currentId))

    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', currentId)
    })

    return  {
      column,
      posts
    }
  },
})
</script>
