import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from '../stores/auth'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  const authStore = useAuthStore()

  Router.beforeEach((to, from, next) => {
    const requiresAuth = to.meta.requiresAuth

    if (requiresAuth && !authStore.token) {
      // Se a rota requer autenticação e não há token, redireciona para a página de login
      next({ name: 'login' })
    } else if (requiresAuth && authStore.token) {
      // Se a rota requer autenticação e há um token
      try {
        const token = authStore.token
        const tokenData = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Math.floor(Date.now() / 1000)

        if (tokenData.exp < currentTime) {
          // Token expirado, redireciona para a página de login e limpa os dados de autenticação
          authStore.clearAuthData()
          next({ name: 'login' })
        } else {
          // Token válido, permite a navegação
          next()
        }
      } catch (error) {
        // Erro ao decodificar o token, redireciona para a página de login e limpa os dados de autenticação
        authStore.clearAuthData()
        next({ name: 'login' })
      }
    } else if (to.name === 'login' && authStore.token) {
      // Se o usuário já está autenticado e tenta acessar a página de login, redireciona para a página de dashboard
      next({ name: 'DashboardPage' })
    } else {
      // Se a rota não requer autenticação, permite a navegação
      next()
    }
  })

  return Router
})
