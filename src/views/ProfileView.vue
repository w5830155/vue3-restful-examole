<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  try {
    await authStore.fetchUser()
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})
</script>

<template>
  <div class="profile-container">
    <h1>用户资料</h1>
    <div v-if="authStore.user">
      <p>ID: {{ authStore.user.id }}</p>
      <p>姓名: {{ authStore.user.name }}</p>
      <p>邮箱: {{ authStore.user.email }}</p>
    </div>
    <button @click="authStore.logout">退出登录</button>
  </div>
</template>
