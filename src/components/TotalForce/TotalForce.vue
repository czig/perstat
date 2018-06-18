<template>
    <div class="container">
        <div class="row">
            <h1 class="col">Total Force</h1>
            <div class="col-4 text-right" style="margin-top:15px;">
                        Data as of: 
                        <span style="font-weight:bold;color:#4d8bf9"> {{asDate}} </span>
            </div>
        </div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link active" @click="dynamicComponent='adman'" data-toggle="tab">Active Duty</a>
            </li>                    
            <li class="nav-item">
                <a class="nav-link" @click="dynamicComponent='ang'" data-toggle="tab">ANG</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" @click="dynamicComponent='afr'" data-toggle="tab">AFR</a>
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

import { store } from '@/store/store'

export default {
    data() {
        return {
           dynamicComponent: "adman" 
        }
    },
    computed:{
        asDate: function(){
            return store.state.asDate;
        },
    },
    components: {
         adman,
        ang,
        afr 
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

