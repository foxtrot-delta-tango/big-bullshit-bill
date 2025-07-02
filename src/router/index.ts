import { createRouter, createWebHistory } from 'vue-router'
import BillView from '../components/BillView.vue'
import TableOfContents from '../components/TableOfContents.vue'
import About from '../components/About.vue'
import WhatsNext from '../components/WhatsNext.vue'
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
    path: '/bill/:title([IVX]{1,4})?/:subtitle([A-Z]{1})?',
    name: 'bill',
    query: { section: '' },
    component: BillView,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      if (to.params.subtitle && !to.params.title) {
        next({ path: '/toc', query: {} });
        return;
      }

      const queryParams = Object.keys(to.query);
      if (queryParams.length && (queryParams.length > 1 || queryParams[0] !== 'section')) {
        const query = to.query.section ? { section: to.query.section } : {};
        next({ query });
      } else {
        next();
      }
    }
  },
  {
    path: '/',
    name: 'toc',
    component: TableOfContents,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      stripQuery(to, next);
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/fightback',
    name: 'fightback',
    component: WhatsNext
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory('/big-bullshit-bill/'),
  routes
})

export default router