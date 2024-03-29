import { createStore, Commit } from 'vuex'
import axios from 'axios'

export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}

export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}

export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}

export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export interface GlobalDateProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
  loading: boolean;
  token: string;
  error: GlobalErrorProps;
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
//登录请求
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}

const store = createStore<GlobalDateProps>({
  state: {
    columns: [],
    posts: [],
    user: {isLogin: false},
    loading: false,
    token: localStorage.getItem('token') || '',
    error: { status: false }
  },

  mutations: {
    // login(state) {
    //   state.user = {...state.user, isLogin: true, name: 'Ming'}  //新对象替换旧对象，可以使用展开运算符
    // },
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns(state, newData) {
      state.columns = newData.data.list
    },
    fetchColumn(state, newData) {
      state.columns = [newData.data]
    },
    fetchPosts(state, newData) {
      state.posts = newData.data.list
    },
    fetchPost(state, rawData) {
      state.posts = [rawData.data]
    },
    //添加 loding 加载功能
    setLoading(state, status) {
      state.loading = status
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    fetchCurrentUser(state, newData) {
      state.user = { isLogin: true, ...newData.data }
    },
    login(state, newData) {
      const tokens = newData.data.tokenreturn 
      state.token = tokens
      localStorage.setItem('token', tokens)
      axios.defaults.headers.common.Authorization = `Bearer ${tokens}`
    },
    //退出登录
    logout(state) {
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },

  actions: {
    // //获取异步axios数据
    // fecthColumns({ commit }) {
    //   const res = await axios.get('/columns')
    //   commit('fecthColumns', res.data)
    // },
    // fecthColumn({ commit }, id) {
    //   const res = await axios.get(`/columns/${id}`)
    //   commit('fecthColumn', res.data)
    // },
    // fecthPosts({ commit }, id) {
    //   const res = await axios.get(`/columns/${id}/posts`)
    //   commit('fecthPosts', res.data) 
    // },

    fetchColumns({ commit }) {
      return getAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn({ commit }, id) {
      return getAndCommit(`/columns/${id}`, 'fetchColumn', commit)
    },
    fetchPosts({ commit }, id) {
      return getAndCommit(`/columns/${id}/posts`, 'fetchPosts', commit)
    },
    fetchPost({ commit }, id) {
      return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
    },
    fetchCurrentUser({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    createPost({ commit }, payload) {
        return postAndCommit('/posts', 'createPost', commit, payload)
    },
    //登录和获取 同时绑定两个dispatch到一个函数上
    loginAndFecth({ dispatch }, payload) {
      return dispatch('login', payload).then(() => {
        return dispatch('fecthCurrentUser')
      })
    }
  },

  getters: {
    getColumnById: (state) => function(id: string) {
      return state.columns.find(c => c._id === id)
    },
    getPostsById: (state) => function (id: string) {
      return state.posts.filter(c => c.column === id)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.find(post => post._id === id)
    }
  }
})

export default store
