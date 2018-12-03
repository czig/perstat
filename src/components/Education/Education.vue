<template>
    <div class="container">
        <div class="row">
            <h1 class="col">Education</h1>
            <div class="col-4 text-right" style="margin-top:15px;">
                        Data as of: 
                        <span style="font-weight:bold;color:#4d8bf9"> {{asDate}} </span>
            </div>
        </div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link active" @click="dynamicComponent='offHighEd'" data-toggle="tab">Officer</a>
            </li>            
            <li class="nav-item">
                <a class="nav-link" @click="dynamicComponent='enlHighEd'" data-toggle="tab">Enlisted</a>
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
           dynamicComponent: "offHighEd" 
        }
    },
    computed:{
        asDate: function(){
            return store.state.asDate;
        },
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
