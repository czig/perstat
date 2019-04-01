<template>
    <div class="container-fluid">
        <div class="row">
            <h1 class="col">Assignments</h1>
            <div class="col-4 text-right" style="margin-top:15px;">
                <span data-step="5" data-intro="The data on this page is current as of the date shown here.">
                        Data as of: 
                        <span style="font-weight:bold;color:#4d8bf9"> {{asDate}} </span>
                </span>
            </div>
        </div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'offTOS'}" 
                    @click="dynamicComponent='offTOS'" data-toggle="tab">Average TOS</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'join'}" 
                    @click="dynamicComponent='join'" data-toggle="tab">Join Spouse</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'efmp'}" 
                    @click="dynamicComponent='efmp'" data-toggle="tab">EFMP/Humi</a>
            </li>
        </ul>
        <transition name="fade" mode="out-in">
            <component :is="dynamicComponent"></component>
        </transition>
    </div>
</template>

<script>
import offTOS from '@/components/Assignments/OfficerTos'
import enlTOS from '@/components/Assignments/EnlistedTos'
import join from '@/components/Assignments/Joint'
import efmp from '@/components/Assignments/EFMP'

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
                return componentToShow[0] || "offTOS";
            },
            set: function(newPage) {
                store.commit('changePage',newPage)
            }
        }
    },
    components: {
        offTOS,
        enlTOS,
        join,
        efmp
    }
}
</script>

<style scoped>

.custom-control.custom-radio{
    padding-left:20px;
    padding-right:10px;
    margin-right: 0;
    cursor:pointer;
}

#radioSelect{
    margin-bottom: 0px;
}

.active{
    border-color:red;
}
.padded{
    margin-left: 10px;
    margin-top: 10px;
}
.centered{
    float: none;
    margin: 0 auto;
}
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
.custom-control-description{
    font-weight: bold;
}
</style>
