<template>
    <div class="container">
        <div class="row">
            <h1 class="col">Total Force Military</h1>
            <div class="col-4 text-right" style="margin-top:15px;">
                        Data as of: 
                        <span style="font-weight:bold;color:#4d8bf9"> {{asDate}} </span>
            </div>
        </div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'adman'}" 
                    @click="dynamicComponent='adman'" data-toggle="tab">Active Duty</a>
            </li>                    
             <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'ang'}" 
                    @click="dynamicComponent='ang'" data-toggle="tab">ANG</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'afr'}" 
                    @click="dynamicComponent='afr'" data-toggle="tab">AFR</a>
            </li>            
        </ul>
        <transition name="fade" mode="out-in">
            <component :is="dynamicComponent"></component>
        </transition>
    </div>
</template>



<script>
import adman from '@/components/TotalForce/AdMan'
import ang from '@/components/TotalForce/ANGMan'
import afr from '@/components/TotalForce/AFRMan' 
import Construction from '@/components/Construction'

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
                return componentToShow[0] || "adman";
            },
            set: function(newPage) {
                store.commit('changePage',newPage)
            }
        }
    },
    components: {
        adman,
        ang,
        afr,
        Construction 
    }
}
</script>

<style scoped>


.nav-tabs .nav-link{
    color:black;
}
.nav-tabs .nav-link.active{
    font-weight:bold;
    color:teal;
}

</style>

