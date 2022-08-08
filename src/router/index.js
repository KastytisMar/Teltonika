import Vue from 'vue'
import Router from 'vue-router'
import Country from '../views/country.vue'
import City from "../views/city.vue"

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'country',
      component: Country
    },
    {
      path: '/city',
      name: 'city',
      component: City
    },
  ]
})