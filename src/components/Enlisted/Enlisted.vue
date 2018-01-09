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
        <component :is="dynamicComponent"></component>
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

<style src="@/../node_modules/dc/dc.css">
</style>
<style>
.nav-tabs .nav-link{
    color:black;
}
.nav-tabs .nav-link.active{
    font-weight:bold;
    color:teal;
    //background-color:red;
}
</style>

