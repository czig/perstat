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
                <a class="nav-link" @click="dynamicComponent='offStem'" data-toggle="tab">STEM</a>
            </li>
        </ul>
        <div class="row" v-if="dynamicComponent=='offStem' || dynamicComponent=='enlStem'">
            <div class="padded">
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
        </div>
        <transition name="fade" mode="out-in">
            <component :is="dynamicComponent"></component>
        </transition>
    </div>
</template>

<script>
import offStem from '@/components/Education/OfficerStem'
import enlStem from '@/components/Education/EnlistedStem' 
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
