<template>
    <div class="container-fluid grey lighten-5">
        <app-navbar></app-navbar>
        <div class="pt-5 mt-3" style="min-height: 800px;">
            <router-view></router-view>
        </div>
        <app-footer></app-footer>
    </div>

</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
export default {
    components: {
        'app-navbar': Navbar,
        'app-footer': Footer
    }
}
</script>

<style>
div[id*="-barchart"] .x.axis text{
    text-anchor: end !important;
    transform: rotate(-45deg);
  }

div[id*="-rowchart"] g.row text{
    fill: black;
}
</style>
