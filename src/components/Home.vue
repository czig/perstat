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
                        <hr>
                        <h6 class="row ml-3">ANG Enlisted and Officer sections have been added.</h6>
                        <br>                         
                        <h6 class="row ml-3">The following buttons have been added to pages with interactive charts:</h6>
                        <h6 class="row ml-5"><span class="fab-main pointer fabulouso" style="background-color: rgb(51, 51, 51);" title="This what the floating action button (fab) looks like. Click on the fab to see the following items: Reset All, Download Raw Data, Demo the page, View current filters. Try clicking on it on the interactive pages to see it in action."><i class="md-24 material-icons main" style="font-size: 14px;"><svg aria-hidden="true" data-prefix="fas" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-plus fa-w-14 fa-sm"><path fill="currentColor" d="M448 294.2v-76.4c0-13.3-10.7-24-24-24H286.2V56c0-13.3-10.7-24-24-24h-76.4c-13.3 0-24 10.7-24 24v137.8H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h137.8V456c0 13.3 10.7 24 24 24h76.4c13.3 0 24-10.7 24-24V318.2H424c13.3 0 24-10.7 24-24z" class=""></path></svg></i></span><span class="d-none d-sm-block">&nbsp;The floating action button (fab)</span></h6>
                        
                        <h6 class="row ml-5"><span class="fab-main pointer fabulouso" style="background-color: rgb(255, 53, 71);" title="This is the Reset All button. The Reset All Button resets all chart selections to a default state. Try it out on the interactive pages after you have applied filters to see it in action."><i class="md-18 material-icons" style="font-size: 14px;"><svg aria-hidden="true" data-prefix="fas" data-icon="redo-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-redo-alt fa-w-16"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z" class=""></path></svg></i></span><span class="d-none d-sm-block">&nbsp;Reset All</span></h6> 

                        <h6 class="row ml-5"><span class="fab-main pointer fabulouso" style="background-color: rgb(47, 150, 180);" title="This is the Download Raw Data button. It allows you to save a file with the raw data we use to build the charts on this page. Try it out on the interactive pages to see it in action."><i class="md-18 material-icons" style="font-size: 14px;"><svg aria-hidden="true" data-prefix="fas" data-icon="download" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-download fa-w-16"><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z" class=""></path></svg></i></span><span class="d-none d-sm-block">&nbsp;
                        Download Raw Data</span></h6>

                        <h6 class="row ml-5"><span class="fab-main pointer fabulouso" style="background-color: rgb(47, 150, 180);" title="This is the Demo button. It allows you to observe important aspects on the particular page. Try it out on the interactive pages if you don't know where to start."><i class="md-18 material-icons" style="font-size: 14px;"><svg aria-hidden="true" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-eye fa-w-18"><path fill="currentColor" d="M569.354 231.631C512.969 135.949 407.81 72 288 72 168.14 72 63.004 135.994 6.646 231.631a47.999 47.999 0 0 0 0 48.739C63.031 376.051 168.19 440 288 440c119.86 0 224.996-63.994 281.354-159.631a47.997 47.997 0 0 0 0-48.738zM288 392c-75.162 0-136-60.827-136-136 0-75.162 60.826-136 136-136 75.162 0 136 60.826 136 136 0 75.162-60.826 136-136 136zm104-136c0 57.438-46.562 104-104 104s-104-46.562-104-104c0-17.708 4.431-34.379 12.236-48.973l-.001.032c0 23.651 19.173 42.823 42.824 42.823s42.824-19.173 42.824-42.823c0-23.651-19.173-42.824-42.824-42.824l-.032.001C253.621 156.431 270.292 152 288 152c57.438 0 104 46.562 104 104z" class=""></path></svg></i></span><span class="d-none d-sm-block">&nbsp;Demo</span></h6>                        
                        <h6 class="row ml-5"><span class="fab-main pointer fabulouso" style="background-color: rgb(47, 150, 180);" title="This is the View current Filters button. It allows you to quickly see all applied filters on the respective page. Try it out on the interactive pages to see what filters are being applied to the dataset."><i class="md-18 material-icons" style="font-size: 14px;"><svg aria-hidden="true" data-prefix="fas" data-icon="search-filters" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-search-filters fa-w-16"><path fill="currentColor" d="M304 142 H112 C110 142 106 143 110 148 L170 202 V282 c0 7 3 15 10 19 l54 25 C235 325 253 324 250 307 V202 l54-54 C305 148 308 143 304 142zm170 365.7L476.7 505c-9.4 9.4-24.6 9.4-33.9 0L343 405.3c-4.5-4.5-7-10.6-7-17V372c-35.3 27.6-79.7 44-128 44C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208c0 48.3-6.4 92.7-44 128h16.3c6.4 0 12.5 2.5 17 7l99.7 99.7c9.3 9.4 9.3 24.6 0 34zM344 208c0-75.2-60.8-136-136-136S72 132.8 72 208s60.8 136 136 136 136-60.8 136-136z" class=""></path></svg></i></span><span class="d-none d-sm-block">&nbsp;View current Filters</span></h6>
                        </h4>
                                        
                    </div>
                </div>
                <!--                         <fab                            
                            :position="position"
                            :bg-color="bgColor"
                            :actions="fabActions"
                            @reset="reset"
                            @download="download"
                            @demo="demo"
                            @showMyFilters="filter"
                            class="noselect"
                        ></fab>   -->  
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
                    <img class="card-img-top" src="../../static/enlisted.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Active Duty</h4>
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
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" style="padding-bottom: 15px;">
                <div id="ANG-card" class="card hoverable click" @click="$router.push('/ANGOfficer')">
                    <img class="card-img-top" src="../../static/ANG.jpg" height="200px">
                    <div class="card-body">
                        <h4 class="card-title">Air National Guard</h4>
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
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import fab from '@/components/FAB'

    export default {
        data() {
            return {
                pageName: 'Total Force Active Duty',
                /* FAB items */
                bgColor: '#333333',
                positionType: 'inherit',
                position: 'bottom-right',  
                iconSize: 'md',        
                // FontAwesomeIcon plus download search-filters eye redo-alt
                // Material Icons add cloud_download filter_list remove_red_eye auto-renew
                fabActions: [{ name: 'reset', icon: 'redo-alt', tooltip: 'Reset All', color: '#FF3547' },
                             { name: 'download', icon: 'download', tooltip: 'Download Raw Data', color: '#2F96B4'},                             
                             { name: 'demo', icon: 'eye', tooltip: 'Demo the page', color: '#2F96B4'},
                             { name: 'showMyFilters', icon: 'search-filters', tooltip: 'View current Filters', color: '#2F96B4'}],
                mainIcon: 'plus'
            }
        },
        components: {
            FontAwesomeIcon,
            fab
        },
        methods:{
            reset(){
                alert('Clicking this button on an Interactive page will Reset All Filters applied to charts on the page.');
            },
            download(){
                alert('Clicking this button on an Interactive page will Download Raw Data from the selections made on the page.');
            },
            demo(){
                alert('Clicking this button on an Interactive page will Demonstrate important aspects of the page.');
            },
            filter(){
                alert('Clicking this button on an Interactive page will pop up a message with the currently selected filters for the page.');
            }
       }
}

</script>
<style scoped>
.click { 
    cursor: pointer;
}
.elevate-2 {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0px 3px 6px rgba(0,0,0,0.23);
}
#bottom-right-wrapper {
    float: right;
    position: inherit !important;
}
    
</style>
 <style>
 /*@font-face{font-family:Material;src:url(/Material-Icons.woff2) format("woff2");font-weight:400}*/
.fabulouso {
    padding: 10px !important;
    top: -9px;
}

.fabuloso i {
  height: 14px;
  width: 14px;    
}
.material-icons {
  /*font-family: Material;*/
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -moz-font-feature-settings: 'liga';
  -moz-osx-font-smoothing: grayscale;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
</style> 
<style>
    .fab-tooltip.tooltip {
        display: block !important;
        padding: 4px;
        z-index: 10000;
    }

    .fab-tooltip.tooltip .tooltip-inner {
        background: #333333;
        color: white;
        border-radius: 0px;
        padding: 5px 10px 4px;
    }

    .fab-tooltip.tooltip tooltip-arrow {
        display: none;
    }

    .fab-tooltip.tooltip[aria-hidden='true'] {
        visibility: hidden;
        opacity: 0;
        transition: opacity .15s, visibility .15s;
    }

    .fab-tooltip.tooltip[aria-hidden='false'] {
        visibility: visible;
        opacity: 1;
        transition: opacity .15s;
    }
</style>

<style scoped>
    .animated.quick {
        -webkit-animation-duration: .7s !important;
        animation-duration: .7s !important;
    }

    .fab-wrapper {
        z-index: 999;
    }

    .fab-main {
        border-radius: 100px;
        width: 40px;/* this is where the small icons are sized */
        height: 40px;/* this is where the small icons are sized */
        padding: 30px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.20), 0 4px 4px rgba(0, 0, 0, 0.15);
        z-index: 2;
        justify-content: center;
    }

    .fab-main .material-icons {
        color: white;
        -webkit-transition: .4s all;
        -moz-transition: .4s all;
        transition: .4s all;
        margin: 0px auto;
    }

    .fab-main, .fab-list li{
        opacity: 0.6;
    }

    .fab-main:hover, .fab-list li:hover {
        opacity: 1;
    }

    .fab-main .material-icons.main {
        opacity: 1;
        position: absolute;
    }

    .fab-main .material-icons.close {
        opacity: 0;
        position: absolute;
    }

    .fab-main .material-icons.main.rotate {
        -ms-transform: rotate(315deg); /* IE 9 */
        -webkit-transform: rotate(315deg); /* Chrome, Safari, Opera */
        transform: rotate(315deg);
        opacity: 0;
        -webkit-transition: opacity .3s ease-in, -webkit-transform .4s; /* Safari */
        transition: opacity .3s ease-in, transform .4s;
    }

    .fab-main .material-icons.close.rotate {
        -ms-transform: rotate(315deg); /* IE 9 */
        -webkit-transform: rotate(315deg); /* Chrome, Safari, Opera */
        transform: rotate(315deg);
        opacity: 1;
        -webkit-transition: opacity .3s ease-in, -webkit-transform .4s; /* Safari */
        transition: opacity .3s ease-in, transform .4s;
    }

    .fab-list {
        position: relative;
        z-index: 1;
        margin: 2vh 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .fab-list li {
        /*width: 50px;*/
        /*height: 50px;*/
        padding: 10px;
        margin-top: 2vh;
        display: flex;
        align-items: center;
        border-radius: 100px;
        box-shadow: 0 10px 10px rgba(0, 0, 0, 0.20), 0 4px 4px rgba(0, 0, 0, 0.15);
    }

    .fab-list li .material-icons {
        color: white;
        margin: 0px auto;
    }

    .pointer {
        cursor: pointer;
    }

    ul {
        list-style-type: none;
        padding: 0 !important;
    }

    .fab-wrapper .actions-container {
        overflow: hidden;
        z-index: 0;
        position: relative;
    }

    /* Rules for sizing the icon. */
    .material-icons.md-18 {
        font-size: 18px;
    }

    .material-icons.md-24 {
        font-size: 24px;
    }

    .material-icons.md-36 {
        font-size: 36px;
    }

    .material-icons.md-48 {
        font-size: 48px;
    }

    /* Rules for using icons as black on a light background. */
    .material-icons.md-dark {
        color: rgba(0, 0, 0, 0.54);
    }

    .material-icons.md-dark.md-inactive {
        color: rgba(0, 0, 0, 0.26);
    }

    /* Rules for using icons as white on a dark background. */
    .material-icons.md-light {
        color: rgba(255, 255, 255, 1);
    }

    .material-icons.md-light.md-inactive {
        color: rgba(255, 255, 255, 0.3);
    }

    @media screen and (max-width: 768px) {
        .fab-list {
            margin: 2vh 0;
        }

        .fab-list li {
            /*width: 40px;*/
            /*height: 40px;*/
            /*padding: .6rem;*/
        }

        .fab-list li i {
            /*font-size: 24px !important;*/
        }

        .fab-main {
            /*width: 55px;*/
            /*height: 55px;*/
            /*padding: 1.5rem;*/
        }

        .fab-main i {
            /*font-size: 34px !important;*/
        }

    }
</style>