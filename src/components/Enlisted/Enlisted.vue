<template>
    <div class="container">
        <div class="row">
            <h1 class=col>Enlisted</h1>
            <div class="col-4 text-right" style="margin-top:15px;">
                        Data as of: 
                        <span style="font-weight:bold;color:#4d8bf9"> {{asDate}} </span>
            </div>
        </div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" @click="dynamicComponent='manning'">
                    Manning
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" @click="dynamicComponent='retention'">
                    Retention
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="tab" @click="dynamicComponent='promotions'">
                    Promotions
                </a>
            </li>
        </ul>
        <transition name="fade" mode="out-in">
            <component :is="dynamicComponent"></component>
        </transition>
    </div>
</template>

<script>
import manning from '@/components/Enlisted/Manning'
import retention from '@/components/Enlisted/Retention'
import promotions from '@/components/Enlisted/EnlistedPromo'
import { store } from '@/store/store'

    export default {
        data() {
            return {
               dynamicComponent: 'manning' ,
            }
        },
        computed:{
            asDate: function(){
                return store.state.asDate;
            },
        },
        components:{
            manning,
            retention,
            promotions
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

