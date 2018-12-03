import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store =  new Vuex.Store({
	state:{
		asDate: 'Undetermined',
		resetAfsc: false,
		startAfsc:false,
        page: "" 
	},
    getters : {
        getPage (state) {
            //return current page, and if none, check localStorage 
            // (check localStorage to maintain state after reload)
            return state.page || localStorage.getItem('perstatPage')
        }
    },
    mutations: {
        changePage (state, newPage) {
            //update state and set localStorage
            state.page = newPage
            localStorage.setItem('perstatPage',newPage)
        }
    }
});
