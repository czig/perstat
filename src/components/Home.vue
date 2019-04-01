<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="card">
                    <img class="card-img-top col-lg-12" style="position: relative; max-height: 500px; padding: 0; flex: none;" src="../../static/F-16Falcon.jpg">
                    <span class="white-text d-none d-sm-block" style="position: absolute; bottom: 0; left: 20px;"><h1>Welcome!</h1></span>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <div class="card">
                    <div class="card-body row">
                        <img class="ml-3 d-none d-md-block card-img-left" src="../../static/afpc_log.png" width="150px" height="150px">
                        <h4 class="col-lg-9 col-md-8 col-sm-12 pl-3">AFPC's Personnel Statistics
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

        <div role="alert" class="row mt-3">
<!-- light secondary success info warning danger -->
            <div class="col">
                <div class="card alert alert-dismissible alert-success">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="card-body row">
                        <h4 class="col-lg-12 col-md-12 col-sm-12 pl-3">New PERS-STAT Items
                        <br>
                        <h6>New items have been added to the PERS-STAT website.  </h6>
                        <hr>
                        <h6>On pages with interactive charts, there are two new buttons at the top one titled "Demo", and another titled "View Filters."</h6>
                        <br>
                        <h6>The "Demo" Button allows you to observe important aspects on the page.</h6>
                        <h6>The "View Filter" Button allows you to quickly see all applied filters on the respective page.</h6>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
        

        <div class="row mt-3">
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" style="padding-bottom: 15px;">
                <div id="tf-card" class="card hoverable click" @click="$router.push('/totalforce')">
                    <img class="card-img-top" src="../../static/admanning.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Total Force</h4>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" style="padding-bottom: 15px;">
                <div id="officer-card" class="card hoverable click" @click="$router.push('/officer')">
                    <img class="card-img-top" src="../../static/officer.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Officer</h4>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" style="padding-bottom: 15px;">
                <div id="enlisted-card" class="card hoverable click" @click="$router.push('/enlisted')">
                    <img class="card-img-top" src="../../static/enlisted.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Enlisted</h4>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" style="padding-bottom: 15px;">
                <div id="civilian-card" class="card hoverable click" @click="$router.push('/civilian')">
                    <img class="card-img-top" src="../../static/civilian.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Civilian</h4>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" style="padding-bottom: 15px;">
                <div id="assignments-card" class="card hoverable click" @click="$router.push('/assignments')">
                    <img class="card-img-top" src="../../static/assignments.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Assignments</h4>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" style="padding-bottom: 15px;">
                <div class="card hoverable click" @click="$router.push('/education')">
                    <img class="card-img-top" src="../../static/education.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Education</h4>
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

<style scoped>
.click { 
    cursor: pointer;
}
.elevate-2 {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0px 3px 6px rgba(0,0,0,0.23);
}
    
</style>
