<template>

    <nav class="navbar navbar-expand-lg navbar-dark bg-primary elevate-3 mb-3">
      <a class="navbar-brand" style="color: white;">PERS-STAT</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
              <router-link to="/" tag="li"><a class="nav-link">Home</a></router-link>
          </li>
          <router-link to="/ad_manning" tag="li"><a class="nav-link">AD Manning</a></router-link>
          <li class="nav-item">
          </li>
          <li class="nav-item">
              <router-link to="/officer" tag="li"><a class="nav-link">Officer</a></router-link>
          </li>
          <li class="nav-item">
              <router-link to="/enlisted" tag="li"><a class="nav-link">Enlisted</a></router-link>
          </li>
          <li class="nav-item">
              <router-link to="/civilian" tag="li"><a class="nav-link">Civilian</a></router-link>
          </li>
          <li class="nav-item">
              <router-link to="/assignments" tag="li"><a class="nav-link">Assignments</a></router-link>
          </li>
          <li class="nav-item">
              <router-link to="/joint" tag="li"><a class="nav-link">Joint</a></router-link>
          </li>
          <li class="nav-item">
              <router-link to="/care" tag="li"><a class="nav-link">Care</a></router-link>
          </li>
          <li class="nav-item">
              <router-link to="/first_contact" tag="li"><a class="nav-link">First Contact</a></router-link>
          </li>
          <li class="nav-item">
              <router-link to="/it" tag="li"><a class="nav-link">IT</a></router-link>
          </li>
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

    a, a:active, a:focus, button, button:active, button:focus {
        outline: none;
    }
</style>
