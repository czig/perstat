<template>
    <div class="container-fluid">
        <app-navbar></app-navbar>
        <div>
            <router-view></router-view>
        </div>
    </div>

</template>

<script>
import Navbar from '@/components/Navbar'
export default {
    components: {
        'app-navbar': Navbar
    }
}
</script>

<style>
</style>
