import Vue from 'vue'
import VueRouter from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import EmpleadoView from '../views/EmpleadoView.vue'
import SalariosView from '../views/SalariosView.vue'
import EmpleadoEditView from '../views/EmpleadoEditView.vue'

import VistaLogin from '../views/LoginView.vue'
import AppLayout from '../views/AppLayout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: VistaLogin,
    meta: {redirectIfAuth: true}
  },
  {
    path: '/admin',
    component: AppLayout,
    children: [
      {
        path: 'about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
        meta: {requireAuth: true}
      },
      {
        path: 'home',
        name: 'home',
        component: EmpleadoView,
        meta: {requireAuth: true}
      },
      {
        path: 'salarios',
        name: 'Salarios',
        component: SalariosView,
        meta: {requireAuth: true}
      },
      {
        path: 'empleado/:mode/:id',
        name: 'EmpleadoEditView',
        component: EmpleadoEditView,
        meta: {requireAuth: true}
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Guard
router.beforeEach((to, from, next) =>{
  let token = localStorage.getItem("access_token")

  if(to.meta.requireAuth) {
    if(!token)
      return next({name: 'login'});
    return next()
  }

  if(to.meta.redirectIfAuth && token) {
    return next({name: 'home'})
  }

  return next()
})

export default router
