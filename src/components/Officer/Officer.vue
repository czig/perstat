<template>
    <div class="container">
        <div class="row">
            <h1 class="col">Officer</h1>
        </div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link active" @click="dynamicComponent='off-manning'" data-toggle="tab">Manning</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" @click="dynamicComponent='off-promo'" data-toggle="tab">Promotions</a>
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
export default {
    data() {
        return {
           dynamicComponent: "off-manning" 
        }
    },
    components: {
        'off-manning': OfficerManning,
        'off-promo': OfficerPromo
    }
}
</script>

<style>
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
