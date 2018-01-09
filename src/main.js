//Import polyfill so IE can use Promise & Axios
import {polyfill} from 'es6-promise'; polyfill();
var ES6Promise = require("es6-promise");
ES6Promise.polyfill();
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
//UNCOMMENT baseURL to run in PRODUCTION
//axios.defaults.baseURL = 'https://starsraw.afpc.randolph.af.mil/SASStoredProcess/do'
axios.defaults.headers.get['Accepts'] = 'application/json'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/mdbootstrap/css/mdb.min.css'

import { store } from '@/store/store'

//Upon Route entry, Check that we have access to the data
//If access is granted, then save state in vuex and do not call again
//Else if no data access -> Redirect to the Portal
//TODO: Redirect page to display "An Error Occurred"
router.beforeEach((to, from, next) => {
	 //PROD:
   //       if (store.state.sanity == "SANE"){
	 if (store.state.sanity != check_portal){
	 	  var querystring = require('querystring');
          const formData = {
            _PROGRAM:"/REN - Dashboard Home V1/makeHTML_collab",
            nPage:"sanity"
          }
          var myData = axios.post('', querystring.stringify(formData))
          .then(function(response){
            var mySanity = response.data.sanity;
            if (mySanity != 'INSANE'){
              window.location.href = 'https://starsraw.afpc.randolph.af.mil';
            } else {
              store.state.sanity = 'INSANE'
              next();
              //alert('AUTHENTICATED')
            }
          }).catch(function(error){
            console.log(error)
            window.location.href = 'https://starsraw.afpc.randolph.af.mil';
          })
        } else {
          next();
        }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
