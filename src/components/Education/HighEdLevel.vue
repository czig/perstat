<template>
    <div class="container">
        <div class="row" v-if="dynamicComponent=='offHighEd' || dynamicComponent=='enlHighEd'">
            <div class="padded">
                <div id="category" class="col form-group">
                    <label class="custom-control custom-radio" >
                        <input class="custom-control-input" name="radioType" type="radio" id="radio1" value="offHighEd" v-model="dynamicComponent">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Officer</span>
                    </label>
                    <label class="custom-control custom-radio" >
                        <input class="custom-control-input" name="radioType" type="radio" id="radio2" value="enlHighEd" v-model="dynamicComponent">
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
