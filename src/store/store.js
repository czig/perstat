import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store =  new Vuex.Store({
	state:{
		sanity: 'SANE',
		resetAfsc: false,
		startAfsc:false,
	}
});
