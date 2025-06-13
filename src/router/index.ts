import { createRouter, createWebHistory } from 'vue-router'
import BillView from '../components/BillView.vue'
import TableOfContents from '../components/TableOfContents.vue'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

const stripQuery = (to: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (Object.keys(to.query).length) {
    next({ query: {} });
  } else {
    next();
  }
}

const routes = [
  {
    path: '/:title([IVX]{1,4})?/:subtitle(.{1})?',
    name: 'bill',
    component: BillView,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      console.log('to', to, to.params.subtitle, to.params.title);
      if (to.params.subtitle && !to.params.title) {
        next({ path: '/toc' });
      }

      stripQuery(to, next);
    }
  },
  {
    path: '/toc',
    name: 'toc',
    component: TableOfContents,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      stripQuery(to, next);
    }
  },
  {
    path: '/',
    redirect: '/toc'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/toc'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 