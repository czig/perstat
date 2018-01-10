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
        <component :is="dynamicComponent"></component>
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

<style></style>
