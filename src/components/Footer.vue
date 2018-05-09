<template>
    <footer class="page-footer primary-color-dark center-on-small-only">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <h5 class="title mb-2 mt-3 font-bold">AFPC PERS-STAT</h5>
                    <!-- <p class='no-marg'>For more information, questions or concerns please contact:</p>
                    <h5 class="title mb-2 mt-3 font-bold">AFPC DSYD</h5>
                    <div class="row">
                    <div class="col-2">
                       <p class='no-marg'>Email: </p>
                       <p class='no-marg'>DSN:  </p>
                       <p class='no-marg'>COM:  </p>
                    </div>
                    <div class="col">
                    <p class='no-marg'> 
                        <a class='font-bold' href="mailto:DSYD.WorkFlow@us.af.mil?Subject=PERS_STAT Assistance">DSYD.WorkFlow@us.af.mil</a>
                    </p>
                    <p class='no-marg'>312-665-3540</p>
                    <p class='no-marg'>210-565-3540</p>
                    </div>
                    </div> -->
                </div>
                <div class="col-md-4">
                    <h5 class="title mb-2 mt-3 font-bold">Links</h5>
                    <ul>
                      <router-link class="footer-link" to="/" tag="li"><a class="nav-link">Home</a></router-link>
                      <router-link class="footer-link" to="/tf_inv" tag="li"><a class="nav-link">TF Inventory</a></router-link>
                      <router-link class="footer-link" to="/officer" tag="li"><a class="nav-link">Officer</a></router-link>
                    
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5 class="title mb-2 mt-3 font-bold"> Additional Links</h5>
                    <ul>
                      <router-link class="footer-link" to="/enlisted" tag="li"><a class="nav-link">Enlisted</a></router-link>
                      <router-link class="footer-link" to="/civilian" tag="li"><a class="nav-link">Civilian</a></router-link>
                      <!-- <router-link class="footer-link" to="/assignments" tag="li"><a class="nav-link">Assignments</a></router-link> -->
                      <!-- 
                      <router-link class="footer-link" to="/joint" tag="li"><a class="nav-link">Joint</a></router-link>
                      <router-link class="footer-link" to="/care" tag="li"><a class="nav-link">Care</a></router-link>
                      <router-link class="footer-link" to="/first_contact" tag="li"><a class="nav-link">First Contact</a></router-link>
                      <router-link class="footer-link" to="/it" tag="li"><a class="nav-link">IT</a></router-link> -->
                    </ul>
                </div>
                <div class="footer-copyright">
                    <div class="container-fluid">
                        © 2017-2018 Copyright: United States Air Force
                    </div>
                </div>
            </div>
        </div>
    </footer>
    
</template>

<script></script>

<style>
    a, a:active, a:focus, button, button:active, button:focus {
        outline: none;
    }
    .footer-link {
        height: 30px;
    }
    .no-marg{
      margin: 0 0;
    }
</style>
