<template>

    <nav class="navbar navbar-expand-lg navbar-dark primary-color-dark fixed-top">
      <router-link class="white-text" to="/"><img src="../../static/afpc_log.png" height="30px"></router-link>
      <div class="navbar-brand white-text"><router-link class="white-text" to="/">PERS-STAT</router-link></div>
      <button class="navbar-toggler hoverable" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav mr-auto">
          <router-link class="nav-item" to="/" tag="li" active-class="active" exact><a class="nav-link" data-toggle="collapse" data-target="#navbarNavDropdown">Home</a></router-link>
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Total Force 
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <router-link class="dropdown-item" to="/totalforce" tag="li" style="cursor: pointer;" @click.native="goToPage('adman')" data-toggle="collapse" data-target="#navbarNavDropdown">Active Duty</router-link>
                  <router-link class="dropdown-item" to="/totalforce" tag="li" style="cursor: pointer;" @click.native="goToPage('ang')" data-toggle="collapse" data-target="#navbarNavDropdown">ANG</router-link>
                  <router-link class="dropdown-item" to="/totalforce" tag="li" style="cursor: pointer;" @click.native="goToPage('afr')" data-toggle="collapse" data-target="#navbarNavDropdown">AFR</router-link>
              </div>
          </li>

          <!-- <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Active Duty
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('officer')">Officer</router-link>
                  <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('enlisted')">Enlisted</router-link>
              </div>
          </li> -->

            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Active Duty
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li class="dropdown-submenu"><a class="dropdown-item dropdown-toggle" >Officer</a>
                        <ul class="dropdown-menu">
                            <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-manning')">Manning</router-link>
                            <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-promo')">Promotions</router-link>
                            <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-edu')">Education</router-link>
                        </ul>
                    </li>
                    <li class="dropdown-submenu"><a class="dropdown-item dropdown-toggle" >Enlisted</a>
                        <ul class="dropdown-menu">
                            <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('manning')">Manning</router-link>
                            <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('retention')">Retention</router-link>
                            <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('promotions')">Promotions</router-link>
                        </ul>
                    </li>
                </div>
            </li>



            <!-- <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Active Duty
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <h6 class="dropdown-header dropdown-item-text font-weight-bold" id="officer" aria-haspopup="true" aria-expanded="false">Officer</h6>
                    <div class="dropdown-divider font-weight-bold"></div>
                        <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-manning')">Manning</router-link>
                        <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-promo')">Promotions</router-link>
                        <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-edu')">Education</router-link>
                    <div class="dropdown-divider font-weight-bold"></div>
                    <h6 class="dropdown-header dropdown-item-text font-weight-bold" id="enlisted" aria-haspopup="true" aria-expanded="false">Enlisted</h6>
                    <div class="dropdown-divider font-weight-bold"></div>
                        <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('manning')">Manning</router-link>
                        <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('retention')">Retention</router-link>
                        <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('promotions')">Promotions</router-link>
                </div>
            </li> -->


          <!-- <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Officer 
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-manning')" data-toggle="collapse" data-target="#navbarNavDropdown">Manning</router-link>
                  <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-promo')" data-toggle="collapse" data-target="#navbarNavDropdown">Promotions</router-link>
                  <router-link class="dropdown-item" to="/officer" tag="li" style="cursor: pointer;" @click.native="goToPage('off-edu')" data-toggle="collapse" data-target="#navbarNavDropdown">Education</router-link>
              </div>
          </li>
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                 Enlisted 
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('manning')" data-toggle="collapse" data-target="#navbarNavDropdown">Manning</router-link>
                  <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('retention')" data-toggle="collapse" data-target="#navbarNavDropdown">Retention</router-link>
                  <router-link class="dropdown-item" to="/enlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('promotions')" data-toggle="collapse" data-target="#navbarNavDropdown">Promotions</router-link>
              </div>
          </li> -->
          <router-link class="nav-item" to="/civilian" tag="li" active-class="active"><a class="nav-link">Civilian</a></router-link>
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                 AD Assignments 
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <router-link class="dropdown-item" to="/assignments" tag="li" style="cursor: pointer;" @click.native="goToPage('offTOS')" data-toggle="collapse" data-target="#navbarNavDropdown">Time on Station</router-link>
                  <router-link class="dropdown-item" to="/assignments" tag="li" style="cursor: pointer;" @click.native="goToPage('join')" data-toggle="collapse" data-target="#navbarNavDropdown">Join Spouse</router-link>
                  <router-link class="dropdown-item" to="/assignments" tag="li" style="cursor: pointer;" @click.native="goToPage('efmp')" data-toggle="collapse" data-target="#navbarNavDropdown">EFMP/Humi</router-link>
              </div>
          </li>
          <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                 AD Education
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <router-link class="dropdown-item" to="/education" tag="li" style="cursor: pointer;" @click.native="goToPage('offHighEd')" data-toggle="collapse" data-target="#navbarNavDropdown">Officer</router-link>
                  <router-link class="dropdown-item" to="/education" tag="li" style="cursor: pointer;" @click.native="goToPage('enlHighEd')" data-toggle="collapse" data-target="#navbarNavDropdown">Enlisted</router-link>
              </div>
          </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ANG
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li class="dropdown-submenu"><a class="dropdown-item dropdown-toggle">Officer</a>
                        <ul class="dropdown-menu">
                            <router-link class="dropdown-item" to="/angofficer" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-off-manning')">Manning</router-link>
                            <router-link class="dropdown-item" to="/angofficer" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-off-edu')">Education</router-link>
                        </ul>
                    </li>
                    <li class="dropdown-submenu"><a class="dropdown-item dropdown-toggle">Enlisted</a>
                        <ul class="dropdown-menu">
                            <router-link class="dropdown-item" to="/angenlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-enl-manning')">Manning</router-link>
                            <router-link class="dropdown-item" to="/angenlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-enl-edu')">Education</router-link>                        
                        </ul>
                    </li>
                </div>
            </li>

            <!-- <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ANG
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <h6 class="dropdown-header dropdown-item-text font-weight-bold" id="officer" aria-haspopup="true" aria-expanded="false">Officer</h6>
                    <div class="dropdown-divider font-weight-bold"></div>
                        <router-link class="dropdown-item" to="/angofficer" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-off-manning')">Manning</router-link>
                        <router-link class="dropdown-item" to="/angofficer" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-off-promo')">Promotions</router-link>
                        <router-link class="dropdown-item" to="/angofficer" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-off-edu')">Education</router-link>
                    <div class="dropdown-divider font-weight-bold"></div>
                    <h6 class="dropdown-header dropdown-item-text font-weight-bold" id="enlisted" aria-haspopup="true" aria-expanded="false">Enlisted</h6>
                    <div class="dropdown-divider font-weight-bold"></div>
                        <router-link class="dropdown-item" to="/angenlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-enl-manning')">Manning</router-link>
                        <router-link class="dropdown-item" to="/angenlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-enl-retention')">Retention</router-link>
                        <router-link class="dropdown-item" to="/angenlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-enl-promo')">Promotions</router-link>
                        <router-link class="dropdown-item" to="/angenlisted" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-enl-edu')">Education</router-link>                        
                    <div class="dropdown-divider font-weight-bold"></div>
                        <router-link class="dropdown-item font-weight-bold" to="/angassignments" tag="li" style="cursor: pointer;" @click.native="goToPage('ang-tos')">Assignments</router-link>
                </div>
            </li> -->


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

    .navbar-nav li:hover > ul.dropdown-menu {
        display: block;
    }
    .dropdown-submenu {
        position:relative;
    }
    .dropdown-submenu>.dropdown-menu {
        top:0;
        left:100%;
        margin-top:-6px;
    }

    /* rotate caret on hover */
    .dropdown-menu > li > a:hover:after {
        text-decoration: underline;
        transform: rotate(-90deg);
    } 

    .dropdown-submenu:hover > .dropdown-item {
        color: black !important;
    }
</style>
