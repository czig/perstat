<template>
    <footer class="page-footer primary-color-dark center-on-small-only">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4">
                    <h5 class="title mb-2 mt-3 font-bold">AFPC</h5>
                    <p>Include info about AFPC and/or contact us block</p>
                </div>
                <div class="col-md-4">
                    <h5 class="title mb-2 mt-3 font-bold">Links</h5>
                    <ul>
                      <router-link class="footer-link" to="/" tag="li"><a class="nav-link">Home</a></router-link>
                      <router-link class="footer-link" to="/ad_manning" tag="li"><a class="nav-link">AD Manning</a></router-link>
                      <router-link class="footer-link" to="/officer" tag="li"><a class="nav-link">Officer</a></router-link>
                      <router-link class="footer-link" to="/enlisted" tag="li"><a class="nav-link">Enlisted</a></router-link>
                      <router-link class="footer-link" to="/civilian" tag="li"><a class="nav-link">Civilian</a></router-link>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5 class="title mb-2 mt-3 font-bold"> Additional Links</h5>
                    <ul>
                      <router-link class="footer-link" to="/assignments" tag="li"><a class="nav-link">Assignments</a></router-link>
                      <router-link class="footer-link" to="/joint" tag="li"><a class="nav-link">Joint</a></router-link>
                      <router-link class="footer-link" to="/care" tag="li"><a class="nav-link">Care</a></router-link>
                      <router-link class="footer-link" to="/first_contact" tag="li"><a class="nav-link">First Contact</a></router-link>
                      <router-link class="footer-link" to="/it" tag="li"><a class="nav-link">IT</a></router-link>
                    </ul>
                </div>
                <div class="footer-copyright">
                    <div class="container-fluid">
                        © 2017 Copyright: United States Air Force
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
</style>
