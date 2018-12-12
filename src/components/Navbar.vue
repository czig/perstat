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
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Total Force 
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <router-link class="dropdown-item" to="/totalforce" tag="li" style="cursor: pointer;" @click.native="goToPage('adman')">Active Duty</router-link>
                  <router-link class="dropdown-item" to="/totalforce" tag="li" style="cursor: pointer;" @click.native="goToPage('ang')">ANG</router-link>
                  <router-link class="dropdown-item" to="/totalforce" tag="li" style="cursor: pointer;" @click.native="goToPage('afr')">AFR</router-link>
              </div>
          </li>
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Officer 
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-manning')">Manning</router-link>
                  <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-promo')">Promotions</router-link>
                  <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-edu')">Education</router-link>
              </div>
          </li>
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                 Enlisted 
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('manning')">Manning</router-link>
                  <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('retention')">Retention</router-link>
                  <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('promotions')">Promotions</router-link>
              </div>
          </li>
          <router-link class="nav-item" to="/civilian" tag="li" active-class="active"><a class="nav-link">Civilian</a></router-link>
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                 Assignments 
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <router-link class="dropdown-item" to="/assignments" tag="li" style="cursor: pointer;" @click.native="goToPage('offTOS')">Time on Station</router-link>
                  <router-link class="dropdown-item" to="/assignments" tag="li" style="cursor: pointer;" @click.native="goToPage('join')">Join Spouse</router-link>
                  <router-link class="dropdown-item" to="/assignments" tag="li" style="cursor: pointer;" @click.native="goToPage('efmp')">EFMP/Humi</router-link>
              </div>
          </li>
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                 Education
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <router-link class="dropdown-item" to="/education" tag="li" style="cursor: pointer;" @click.native="goToPage('offHighEd')">Officer</router-link>
                  <router-link class="dropdown-item" to="/education" tag="li" style="cursor: pointer;" @click.native="goToPage('enlHighEd')">Enlisted</router-link>
              </div>
          </li>
          <!-- <router-link class="nav-item" to="/officer" tag="li" active-class="active"><a class="nav-link">ANG Officer</a></router-link>
          <router-link class="nav-item" to="/enlisted" tag="li" active-class="active"><a class="nav-link">ANG Enlisted</a></router-link> -->
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
import { store } from '@/store/store'
export default {
    data() {
        return {
            
        }
    },
    methods: {
        goToPage: function(page) {
            console.log('goto: ',page)
            store.commit('changePage',page)
        }
    }
}
    
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
