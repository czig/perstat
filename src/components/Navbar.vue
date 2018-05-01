<template>

    <nav class="navbar navbar-expand-lg navbar-dark primary-color-dark fixed-top">
      <img src="../../static/afpc_log.png" height="30px">
      <div class="navbar-brand white-text"><router-link class="white-text" to="/">PERS-STAT</router-link></div>
      <button class="navbar-toggler hoverable" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav mr-auto">
          <router-link class="nav-item" to="/" tag="li" active-class="active" exact><a class="nav-link">Home</a></router-link>
        <router-link class="nav-item" to="/tf_inv" tag="li" active-class="active"><a class="nav-link">TF Inventory</a></router-link>
          <router-link class="nav-item" to="/officer" tag="li" active-class="active"><a class="nav-link">Officer</a></router-link>
          <router-link class="nav-item" to="/enlisted" tag="li" active-class="active"><a class="nav-link">Enlisted</a></router-link>
          <router-link class="nav-item" to="/civilian" tag="li" active-class="active"><a class="nav-link">Civilian</a></router-link>
          <!-- <router-link class="nav-item" to="/assignments" tag="li" active-class="active"><a class="nav-link">Assignments</a></router-link> -->
         <!-- 
          <router-link class="nav-item" to="/joint" tag="li" active-class="active"><a class="nav-link">Joint</a></router-link>
          <router-link class="nav-item" to="/care" tag="li" active-class="active"><a class="nav-link">Care</a></router-link>
          <router-link class="nav-item" to="/first_contact" tag="li" active-class="active"><a class="nav-link" >First Contact</a></router-link>
          <router-link class="nav-item" to="/it" tag="li" active-class="active"><a class="nav-link">IT</a></router-link> -->
        </ul>
      </div>
    </nav>
    
</template>

<script>
    
</script>

<style scoped>
    .elevate-3 {
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0px 6px 6px rgba(0,0,0,0.23);
    }

    button:hover {
        background-color: #4285F4;
    }
    button:active {
        background-color: #0d47a1;
    }
</style>
