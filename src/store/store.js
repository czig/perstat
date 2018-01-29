import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store =  new Vuex.Store({
	state:{
		resetAfsc: false,
		startAfsc:false,
	}
});
