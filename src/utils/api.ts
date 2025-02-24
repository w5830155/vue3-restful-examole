import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dev.178778.xyz',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-CSRF-TOKEN',
})

let isCsrfFetching = false
let csrfQueue: Array<() => void> = []

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase()
  if (method && ['post', 'put', 'patch', 'delete'].includes(method)) {
    if (!document.cookie.includes('XSRF-TOKEN=')) {
      if (!isCsrfFetching) {
        isCsrfFetching = true
        try {
          await api.get('/api/csrf-cookie')
        } finally {
          isCsrfFetching = false
          processCsrfQueue()
        }
      }
      return new Promise((resolve) => {
        csrfQueue.push(() => resolve(api(config)))
      })
    }
  }
  return config
})

function processCsrfQueue() {
  csrfQueue.forEach((resolve) => resolve())
  csrfQueue = []
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error
    if (response?.status === 401) {
      useAuthStore().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
