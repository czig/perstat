<template>
    <div class="loader"></div> 
</template>

<script></script>

<style scoped>
.loader {
    border: 16px solid #d3d3d3;
    border-top: 16px solid #3498db;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    position: fixed;
    margin: auto;
    top: 40%;
    left: 45%;
    animation: spin 2s linear infinite;
}
@keyframes spin{
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
    
</style>
