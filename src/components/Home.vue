<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="card">
                    <img class="card-img-top" style="position: relative;" src="../../static/welcome_tight.jpg">
                    <span class="white-text" style="position: absolute; bottom: 0; left: 20px;"><h1>Welcome!</h1></span>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <div class="card">
                    <div class="card-body row">
                        <img class="card-img-left" src="../../static/afpc_log.png" width="150px" height="150px">
                        <h4 class="pl-3">AFPC's Personnel Statistics
                            <br>
                            <br>
                            <h6>The purpose is to drive internal AFPC performance and awareness, and to provide the field data and education.</h6>
                            <h6>Click the links in the navigation bar above or the tiles below to see the respective statistics!</h6>
                            <h6>Each page contains "interactive" charts that you may use to display and filter data.</h6>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-4">
                <div class="card hoverable click" @click="$router.push('/tf_inv')">
                    <img class="card-img-top" src="../../static/ad_manning.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">TF Inventory</h4>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card hoverable click" @click="$router.push('/officer')">
                    <img class="card-img-top" src="../../static/officer.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Officer</h4>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card hoverable click" @click="$router.push('/enlisted')">
                    <img class="card-img-top" src="../../static/enlisted.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Enlisted</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-4">
                <div class="card hoverable click" @click="$router.push('/civilian')">
                    <img class="card-img-top" src="../../static/civilian.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Civilian</h4>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card hoverable click" @click="$router.push('/assignments')">
                    <img class="card-img-top" src="../../static/assignments.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Assignments</h4>
                    </div>
                </div>
            </div>
            <!-- <div class="col-4">
                <div class="card hoverable click" @click="$router.push('/assignments')">
                    <img class="card-img-top" src="../../static/assignments.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Assignments</h4>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card hoverable click" @click="$router.push('/joint')">
                    <img class="card-img-top" src="../../static/joint.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Joint</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-4">
                <div class="card hoverable click" @click="$router.push('/care')">
                    <img class="card-img-top" src="../../static/careww.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Care / WW</h4>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card hoverable click" @click="$router.push('/first_contact')">
                    <img class="card-img-top" src="../../static/firstcontact.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">First Contact</h4>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card hoverable click" @click="$router.push('/it')">
                    <img class="card-img-top" src="../../static/it.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">IT</h4>
                    </div>
                </div>
            </div> -->
        </div>
    </div> 
</template>

<script>
    
</script>

<style scoped>
.click { 
    cursor: pointer;
}
.elevate-2 {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0px 3px 6px rgba(0,0,0,0.23);
}
    
</style>
