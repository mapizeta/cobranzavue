import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Perfiles from '../views/Perfiles.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Usuarios',
    name: 'Usuarios',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Usuarios.vue')
  }
  ,
  {
    path: '/Perfiles',
    name: 'Perfiles',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Perfiles
  }
  ,
  {
    path: '/rut',
    name: 'RutTest',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/RutTest.vue')
  }
  ,
  {
    path: '/Documentos',
    name: 'Documentos',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Documentos.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
