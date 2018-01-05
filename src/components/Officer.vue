<template>
    <div class="container">
        <div class="row">
            <h1 class="col">Officer</h1>
        </div>
        <ul class="nav nav-tabs">
            <router-link class="nav-item active" to="/officer/manning" tag="li">
                <a class="nav-link" data-toggle="tab">Manning</a>
            </router-link>
            <router-link class="nav-item" to="/officer/promotions" tag="li">
                <a class="nav-link" data-toggle="tab">Promotions</a>
            </router-link>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script></script>

<style></style>
