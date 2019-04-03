// babel-polyfill allows use of Promises in IE
import "babel-polyfill";
//import bootstrap styles
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/mdbootstrap/css/mdb.min.css'

//intro.js styles
import '../node_modules/intro.js/introjs.css'

// import Material Icons font
import 'Material Icons' from '../../static/fonts/Material-Icons.d7e60f9.woff2'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
//UNCOMMENT baseURL to run in PRODUCTION
//axios.defaults.baseURL = 'https://starsraw.afpc.randolph.af.mil/SASStoredProcess/do'
axios.defaults.headers.get['Accepts'] = 'application/json'

import fontawesome from '@fortawesome/fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import faFilter from '@fortawesome/fontawesome-free-solid/faFilter'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'
import faRedoAlt from '@fortawesome/fontawesome-free-solid/faRedoAlt'
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle'
import faExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'
import faTimesCircle from '@fortawesome/fontawesome-free-solid/faTimesCircle'
import faEye from '@fortawesome/fontawesome-free-solid/faEye'
import faSearchFilters from '../src/assets/faSearchFilters'

fontawesome.library.add(faSpinner,faQuestionCircle, faInfoCircle, faFilter, faDownload, faRedoAlt, faCheckCircle, faExclamationTriangle, faTimesCircle, faEye, faSearchFilters)

import { store } from '@/store/store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

