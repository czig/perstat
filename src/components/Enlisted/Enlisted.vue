<template>
    <div class="container">
        <div class="row">
            <h1 class=col>Enlisted </h1>
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
            <!--<li class="nav-item">-->
                <!--<a class="nav-link" data-toggle="tab" @click="dynamicComponent='promotion'">-->
                    <!--Promotion-->
                <!--</a>-->
            <!--</li>-->
        </ul>
        <transition name="fade" mode="out-in">
            <component :is="dynamicComponent"></component>
        </transition>
    </div>
</template>

<script>
import manning from '@/components/Enlisted/Manning'
import retention from '@/components/Enlisted/Retention'

    export default {
        data() {
            return {
               dynamicComponent: 'manning' ,
            }
        },
        components:{
            manning,
            retention
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
    //background-color:red;
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

