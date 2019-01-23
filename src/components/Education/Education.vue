<template>
    <div class="container-fluid">
        <div class="row">
            <h1 class="col">Education</h1>
            <div class="col-4 text-right" style="margin-top:15px;">
                        Data as of: 
                        <span style="font-weight:bold;color:#4d8bf9"> {{asDate}} </span>
            </div>
        </div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'offHighEd'}" 
                    @click="dynamicComponent='offHighEd'" data-toggle="tab">Officer</a>
            </li>            
            <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'enlHighEd'}" 
                    @click="dynamicComponent='enlHighEd'" data-toggle="tab">Enlisted</a>
            </li>            
        </ul>
        <transition name="fade" mode="out-in">
            <component :is="dynamicComponent"></component>
        </transition>
    </div>
</template>

<script>
import offHighEd from '@/components/Education/OfficerHighEd'
import enlHighEd from '@/components/Education/EnlistedHighEd'
import { store } from '@/store/store'

export default {
    data() {
        return {
        }
    },
    computed:{
        asDate: function(){
            return store.state.asDate;
        },
        dynamicComponent: {
            get: function() {
                //check if page in store refers to a component on this page,
                //and if so, show that page, else show the manning page
                var components = Object.keys(this.$options.components)
                var page = store.getters.getPage
                //returns array
                var componentToShow = components.filter((d) => {
                    return d === page;
                })
                return componentToShow[0] || "offHighEd";
            },
            set: function(newPage) {
                store.commit('changePage',newPage)
            }
        }
    },
    components: {
        offHighEd,
        enlHighEd

    }
}
</script>

<style src="../../../node_modules/dc/dc.css">
</style>
<style scoped>

.active{
    border-color:red;}
    
.nav-tabs .nav-link{
    color:black;
}
.nav-tabs .nav-link.active{
    font-weight:bold;
    color:teal;
}
.fade-enter{
    opacity: 0;
}
.fade-enter-active, .fade-leave-active{
    transition: all 0.5s;
}
.fade-leave-to{
    opacity: 0;
}

</style>
