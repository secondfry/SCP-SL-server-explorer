import VueRouter from 'vue-router'

import PageIndex from './pages/index.vue'
import PageLegal from './pages/legal.vue'

const routes = [
  {
    path: '/',
    component: PageIndex,
    name: 'root',
  },
  {
    path: '/legal',
    component: PageLegal,
    name: 'legal',
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
