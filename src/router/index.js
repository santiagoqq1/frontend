import { createRouter, createWebHistory } from 'vue-router'
import LoginVista from '@/vistas/loginvista.vue'
import PanelVista from '@/vistas/panelvista.vue'
import { useAuthStore } from '@/almacenes/autenticacion'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginVista,
    },
    {
      path: '/panel',
      name: 'panel',
      component: PanelVista,
      meta: {
        requiereAutenticacion: true,
      },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiereAutenticacion && !authStore.estaAutenticado) {
    return '/'
  }

  if (to.path === '/' && authStore.estaAutenticado) {
    return '/panel'
  }
})

export default router