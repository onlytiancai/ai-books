import { createRouter, createWebHistory } from 'vue-router'
import Reader from '../components/Reader.vue'
import Favorites from '../components/Favorites.vue'
import AdminUsers from '../components/admin/Users.vue'

const routes = [
  {
    path: '/',
    name: 'reader',
    component: Reader
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: Favorites
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminUsers
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
