<template>
    <div class="container">
        <div class="row">
            <h1 class="col">Officer</h1>
            <div class="col-4 text-right" style="margin-top:15px;">
                        Data as of: 
                        <span style="font-weight:bold;color:#4d8bf9"> {{asDate}} </span>
            </div>
        </div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link active" @click="dynamicComponent='off-manning'" data-toggle="tab">Manning</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" @click="dynamicComponent='off-promo'" data-toggle="tab">Promotions</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" @click="dynamicComponent='off-yrgp'" data-toggle="tab">Education</a>
            </li>
        </ul>
        <transition name="fade" mode="out-in">
            <component :is="dynamicComponent"></component>
        </transition>
    </div>
</template>

<script>
import OfficerManning from '@/components/Officer/OfficerManning'
import OfficerPromo from '@/components/Officer/OfficerPromo'
import OfficerPromYRGP from '@/components/Officer/OfficerPromYRGP'
import { store } from '@/store/store'

export default {
    data() {
        return {
           dynamicComponent: "off-manning" 
        }
    },
    computed:{
        asDate: function(){
            return store.state.asDate;
        },
    },
    components: {
        'off-manning': OfficerManning,
        'off-promo': OfficerPromo,
        'off-yrgp': OfficerPromYRGP
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
