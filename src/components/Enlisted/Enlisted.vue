<template>
    <div class="container">
        <div class="row">
            <h1 class=col-2>Enlisted </h1>
            <ul class="col-8 nav nav-tabs nav-justified " role="tablist">
                <li class="nav-item">
                    <a :class="mClass" data-toggle="tab" role="tab" @click.stop.prevent="current=0">
                        Manning
                    </a>
                </li>
                <li class="nav-item">
                    <a :class="rClass" data-toggle="tab" role="tab" @click.stop.prevent="current=1">
                        Retention
                    </a>
                </li>
                <li class="nav-item">
                    <a :class="pClass" data-toggle="tab" role="tab" @click.stop.prevent="current=2">
                        Promotion
                    </a>
                </li>
            </ul>
        </div>
        <manning v-if="current==0"></manning>
        <retention v-if="current==1"></retention>
    </div>
</template>

<script>
import manning from './Manning'
import retention from './Retention'

    export default {
        data() {
            return {
                current:0,
            }
        },
        computed:{
            mClass(){
                if (this.current == 0)
                    return 'nav-link active';
                else return 'nav-link';
            },
            rClass(){
                if (this.current == 1)
                    return 'nav-link active';
                else return 'nav-link';
            },
            pClass(){
                if (this.current == 2)
                    return 'nav-link active';
                else return 'nav-link';
            }

        },
        methods:{
            
        },
        components:{
            manning,
            retention
        }
    }
</script>

<style src="../../../node_modules/dc/dc.css">
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

