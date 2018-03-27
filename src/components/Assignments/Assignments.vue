<template>
    <div class="container">
        <div class="row">
            <h1 class="col">Assignments</h1>
            <div class="col-4 text-right" style="margin-top:15px;">
                        Data as of: 
                        <span style="font-weight:bold;color:#4d8bf9"> {{asDate}} </span>
            </div>
        </div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link active" @click="dynamicComponent='offTOS'" data-toggle="tab">Average TOS</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" @click="dynamicComponent='join'" data-toggle="tab">Join Spouse</a>
            </li>
        </ul>
        <div class="row" v-if="dynamicComponent=='offTOS' || dynamicComponent=='enlTOS'">
            <div class="centered">
                <button :class="['btn',
                        dynamicComponent=='offTOS'?'btn-dark-green':'btn-mdb-color','btn-md','myBtn']"
                        @click.prevent.cancel="dynamicComponent='offTOS'">
                        Officer 
                </button>
                <button :class="['btn',
                        dynamicComponent=='enlTOS'?'btn-dark-green':'btn-mdb-color','btn-md','myBtn']"
                        @click.prevent.cancel="dynamicComponent='enlTOS'">
                        Enlisted  
                </button>
            </div>
        </div>
        <transition name="fade" mode="out-in">
            <component :is="dynamicComponent"></component>
        </transition>
    </div>
</template>

<script>
import offTOS from '@/components/Assignments/OfficerTos'
import enlTOS from '@/components/Assignments/OfficerTos'
import Join from '@/components/Assignments/Joint'
import { store } from '@/store/store'

export default {
    data() {
        return {
           dynamicComponent: "offTOS" 
        }
    },
    computed:{
        asDate: function(){
            return store.state.asDate;
        },
    },
    components: {
        offTOS,
        enlTOS,
        Join
    }
}
</script>

<style scoped>
.active{
    border-color:red;
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
</style>
