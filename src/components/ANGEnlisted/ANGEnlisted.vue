<template>
    <div class="container-fluid">
        <div class="row">
            <h1 class=col>ANG Enlisted</h1>
            <div class="col-4 text-right" style="margin-top:15px;">
                <span data-step="1" data-intro="The data on this page is current as of the date shown here.">
                    Data as of: 
                    <span style="font-weight:bold;color:#4d8bf9"> {{asDate}} </span>
                </span>
            </div>
        </div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'ang-enl-manning'}" 
                    data-toggle="tab" @click="dynamicComponent='ang-enl-manning'">
                    Manning
                </a>
            </li>
            <!-- <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'ang-enl-retention'}" 
                    data-toggle="tab" @click="dynamicComponent='ang-enl-retention'">
                    Retention
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'ang-enl-promo'}" 
                    data-toggle="tab" @click="dynamicComponent='ang-enl-promo'">
                    Promotions
                </a>
            </li> -->
            <li class="nav-item">
                <a class="nav-link" 
                   :class="{ active: dynamicComponent == 'ang-enl-edu'}" 
                    @click="dynamicComponent='ang-enl-edu'" data-toggle="tab">Education</a>
            </li>
        </ul>
        <transition name="fade" mode="out-in">
            <component :is="dynamicComponent"></component>
        </transition>
    </div>
</template>

<script>
import ANGEnlistedManning from '@/components/ANGEnlisted/ANGEnlistedManning'
import ANGRetention from '@/components/ANGEnlisted/ANGRetention'
import ANGEnlistedPromo from '@/components/ANGEnlisted/ANGEnlistedPromo'
import ANGEnlistedHighEd from '@/components/ANGEnlisted/ANGEnlistedHighEd'
import { store } from '@/store/store'

    export default {
        data() {
            return {
            }
        },
        computed:{
            asDate: function(){
                return store.state.asDate;
            },
            dynamicComponent: {
                get: function() {
                    //check if page in store refers to a component on this page,
                    //and if so, show that page, else show the manning page
                    var components = Object.keys(this.$options.components)
                    var page = store.getters.getPage
                    //returns array
                    var componentToShow = components.filter((d) => {
                        return d === page;
                    })
                    return componentToShow[0] || "ang-enl-manning";
                },
                set: function(newPage) {
                    store.commit('changePage',newPage)
                }
            }
        },
        components:{
        'ang-enl-manning': ANGEnlistedManning,
        'ang-enl-promo': ANGEnlistedPromo,
        'ang-enl-retention': ANGRetention,
        'ang-enl-edu': ANGEnlistedHighEd
        },
        created() {
            console.log('created')
            console.log(store.state.page)
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

