import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/gpios',
      name: 'gpios',
      component: () => import('./views/Gpios.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue'),
    },
    {
      path: '/',
      redirect: {
        name: 'gpios',
      },
    },
  ],
});
