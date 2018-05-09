<template>
    <div class="container">
        <div class="row pt-2 col-md-6"> 
            <div id="radioSelect" class="col form-group">
                <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="radio" type="radio" id="radio1" value="offStem" v-model="dynamicComponent">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Officer</span>
                </label>
                <label class="custom-control custom-radio" >
                    <input class="custom-control-input" name="radio" type="radio" id="radio2" value="enlStem" v-model="dynamicComponent">
                    <span class="custom-control-indicator"></span>
                    <span class="custom-control-description">Enlisted</span>
                </label>
            </div>
        </div>  
        
        <transition name="fade" mode="out-in">
            <component :is="dynamicComponent"></component>
        </transition>             
    </div> 
</template>

<script>
import offStem from '@/components/Assignments/OfficerStem'
import enlStem from '@/components/Assignments/EnlistedStem'
import { store } from '@/store/store'


	export default {
		data() {
			return {
                dynamicComponent: "offStem"  
			}
		},
    computed:{
        asDate: function(){
            return store.state.asDate;
        },
    },
    components: {
        offStem,
        enlStem
    }
}

</script>

<style src="@/../node_modules/dc/dc.css">
</style>
<style scoped>
.custom-control.custom-radio{
    padding-left:20px;
    padding-right:10px;
    margin-right: 0;
    cursor:pointer;
}
.fade-enter-active {
    transition: all 0.5s; }
.fade-leave-active {
    transition: all 0.2s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
.fade-enter-to, .fade-leave {
    opacity: 1;
}
</style>            dc.chartRegistry.clear()
            store.state.asDate = 'Undetermined'
        },
        destroyed() {
            console.log("destroyed")
        }

	}
