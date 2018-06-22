<template>
    <div class="container">
        <div class="row" v-if="dynamicComponent=='offStem' || dynamicComponent=='enlStem'">
            <div class="padded">
                <div id="category" class="col form-group">
                    <label class="custom-control custom-radio" >
                        <input class="custom-control-input" name="radioType" type="radio" id="radio1" value="offStem" v-model="dynamicComponent">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Officer</span>
                    </label>
                    <label class="custom-control custom-radio" >
                        <input class="custom-control-input" name="radioType" type="radio" id="radio2" value="enlStem" v-model="dynamicComponent">
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
//import allDeg from '@/components/Education/OfficerDeg'
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

#category .custom-control-input:checked~.custom-control-indicator {
    background-color: rgb(18, 153, 60);
}

#category .custom-control-input:focus~.custom-control-indicator {
    box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(18, 153, 60,.25);
}

#category{
    margin-top: .5rem;
}

.form-group {
    margin-bottom: 0;
}
</style>
