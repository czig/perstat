import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import AdMan from '@/components/AdMan'
import Officer from '@/components/Officer'
import OfficerManning from '@/components/OfficerManning'
import OfficerPromo from '@/components/OfficerPromo'
import Enlisted from '@/components/Enlisted'
import Civilian from '@/components/Civilian'
import Assignments from '@/components/Assignments'
import Joint from '@/components/Joint'
import Care from '@/components/Care'
import FirstContact from '@/components/FirstContact'
import IT from '@/components/IT'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/ad_manning',
      name: 'adMan',
      component: AdMan 
    },
    {
      path: '/officer',
      name: 'officer',
      component: Officer,
      children: [
        {
            path: 'manning',
            component: OfficerManning
        },
        {
            path: 'promotions',
            component: OfficerPromo
        }
      ]
    },
    {
      path: '/enlisted',
      name: 'enlisted',
      component: Enlisted 
    },
    {
      path: '/civilian',
      name: 'civilian',
      component: Civilian 
    },
    {
      path: '/assignments',
      name: 'assignments',
      component: Assignments 
    },
    {
      path: '/joint',
      name: 'joint',
      component: Joint 
    },
    {
      path: '/care',
      name: 'care',
      component: Care 
    },
    {
      path: '/first_contact',
      name: 'firstContact',
      component: FirstContact 
    },
    {
      path: '/it',
      name: 'it',
      component: IT 
    },
    { path: '*', redirect: '/' }
  ]
})
