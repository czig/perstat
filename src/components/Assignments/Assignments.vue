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
            <div class="padded">
                <div id="radioSelect" class="col form-group">
                    <label class="custom-control custom-radio" >
                        <input class="custom-control-input" name="radio" type="radio" id="radio1" value="offTOS" v-model="dynamicComponent">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Officer</span>
                    </label>
                    <label class="custom-control custom-radio" >
                        <input class="custom-control-input" name="radio" type="radio" id="radio2" value="enlTOS" v-model="dynamicComponent">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Enlisted</span>
                    </label>
                </div>
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
    //font-weight: bold;
}
</style>
