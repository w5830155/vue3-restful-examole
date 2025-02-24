<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errors = ref<string[]>([])

const handleSubmit = async () => {
  try {
    await authStore.login(email.value, password.value)
    router.push('/profile')
  } catch (error: any) {
    errors.value = []
    if (error.response?.status === 422) {
      errors.value = Object.values(error.response.data.errors).flat()
    } else {
      errors.value = ['登录失败，请检查网络连接']
    }
  }
}
</script>

<template>
  <div class="login-container">
    <h1>用户登录</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>邮箱:</label>
        <input v-model="email" type="email" required />
      </div>
      <div>
        <label>密码:</label>
        <input v-model="password" type="password" required />
      </div>
      <div v-if="errors.length" class="error-messages">
        <div v-for="(error, index) in errors" :key="index">{{ error }}</div>
      </div>
      <button type="submit">登录</button>
    </form>
  </div>
</template>
