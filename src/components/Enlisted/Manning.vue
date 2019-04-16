<template>
    <div>
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
                    <div id="radioSelect" class="col-auto" data-step="3" data-intro="Toggle the radio buttons to change the data element being shown in the charts.">
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio" type="radio" id="radio1" value="percent" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio1">
                                Percentage
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio2" type="radio" id="radio2" value="asgn" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio2">
                                Assigned 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio3" type="radio" id="radio3" value="auth" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio3">
                                Authorized 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input class="custom-control-input" name="radio4" type="radio" id="radio4" value="stp" v-model="selected" @click="radioButton">
                            <label class="custom-control-label" for="radio4">
                                STP 
                            </label>
                            <span class="h3 ml-2">
                                <span data-toggle="tooltip" 
                                      data-placement="top"
                                      title="Student, Trainee, and Personnel Hold.">
                                    <FontAwesomeIcon icon="info-circle"
                                                     style="vertical-align: 3px"
                                                     size="xs"
                                                     >
                                    </FontAwesomeIcon>
                                </span>
                            </span> 
                        </div>
                    </div>
                    <div class="col-auto">                    
                    </div>
                </div>
                <div class="row">
                    <div id="counts" class="row col-auto" data-step="4" data-intro="Summary statistics for the data elements are shown here. These numbers change as filters are applied.">
                        <div class="col-auto">
                            Assigned:
                            <span id="asgn"></span>
                        </div>
                        <div class="col-auto">
                            STP:
                            <span id="stp"></span>
                        </div>
                        <div class="col-auto">
                            Authorized:
                            <span id="auth"></span>
                        </div>
                        <div class="col-auto">
                            Manning Percent:
                            <span id="percent"></span>
                        </div>
                    </div>
                    <div class="col-auto">
                    </div>
                </div>
                <overviewBarChart 
                        :id="'majcom'"
                        :dimension="majcomDim"
                        :aspectRatio="chartSpecs.majcomChart.aspectRatio"
                        :minHeight="chartSpecs.majcomChart.minHeight"
                        :normalToOverviewFactor="1.5"
                        :selected="selected"
                        :ylabel="ylabel"
                        :reducerAdd="manningAdd"
                        :reducerRemove="manningRemove"
                        :accumulator="manningInitial"
                        :numBars="15"
                        :margin="chartSpecs.majcomChart.margins"
                        :colorScale="majcomColorScale"
                        :title="'MAJCOM'"
                        :loaded="loaded">
                </overviewBarChart>

                 <div class="row">
                    <div id="grade" class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                        <div id="dc-grade-rowchart" data-step="5" data-intro="Clicking the bars applies filters to the chart. Click on one of the bars and watch the other charts update!">
                            <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-grade-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="afscGroup" class="col-xl-8 col-lg-8 col-md-8 col-sm-6 col-12">
                        <div id="dc-afscGroup-barchart">
                            <h3>AFSC Group <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-afscGroup-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
                <overviewBarChart :id="'mpf'"
                                    :dimension="mpfDim"
                                    :aspectRatio="chartSpecs.baseChart.aspectRatio"
                                    :minHeight="chartSpecs.baseChart.minHeight"
                                    :normalToOverviewFactor="1.5"
                                    :selected="selected"
                                    :ylabel="ylabel"
                                    :reducerAdd="manningAdd"
                                    :reducerRemove="manningRemove"
                                    :accumulator="manningInitial"
                                    :numBars="15"
                                    :margin="chartSpecs.baseChart.margins"
                                    :colorScale="baseColorScale"
                                    :title="'Servicing MPF'"
                                    :loaded="loaded">
                </overviewBarChart>
            </div>
        </transition-group> 
        <fab
            data-step="2"
            data-intro="Click here to Reset all filters for all charts, Download raw data in tab form, or View current filters applied to all charts."
            :position="position"
            :bg-color="bgColor"
            :actions="fabActions"
            @reset="resetAll"
            @download="fabDownload"
            @demo="startDemo"
            @showMyFilters="fabFilter"
            class="noselect"
        ></fab> 
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import chartSpecs from '@/chartSpecs'
import axios from 'axios'
import formats from '@/store/format'
import Loader from '@/components/Loader'
import { store } from '@/store/store'
import overviewBarChart from '@/components/overviewBarChart'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import toastr from 'toastr'
import fab from '@/components/FAB'  

    export default {
      data() {
        return {
              data: [],
              selected: "percent",
              searchMajcom: "",
              searchBase: "",
              chartSpecs: chartSpecs,
              loaded: false,
              baseColor: chartSpecs.baseChart.color,
              majcomColorScale: d3.scale.ordinal().range([chartSpecs.majcomChart.color]),
              baseColorScale: d3.scale.ordinal().range([chartSpecs.baseChart.color]),
              pageName: 'Enlisted Manning', 
              /* FAB items */
              bgColor: '#333333',
              position: 'bottom-right',  
              iconSize: 'md',        
              fabActions: [{ name: 'reset', icon: 'redo-alt', tooltip: 'Reset All', color: '#FF3547' },
                           { name: 'download', icon: 'download', tooltip: 'Download Raw Data', color: '#2F96B4'},
                           { name: 'demo', icon: 'eye', tooltip: 'Demo the page', color: '#2F96B4'},
                           { name: 'showMyFilters', icon: 'search-filters', tooltip: 'View current Filters', color: '#2F96B4'}],
              mainIcon: 'plus' 
            }
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
          ylabel: function() {
            if (this.selected === "percent") {
                return "% Manning"
            }
            else if (this.selected === "asgn") {
                return "Assigned"
            }
            else if (this.selected === "stp") {
                return "STP"
            }
            else {
                return "Authorized"
            }
          },
          downloadDim: function() {
            return this.ndx.dimension(function(d) {return d;});    
          },      
          majcomDim: function() {
            return this.ndx.dimension(function(d) {return d.MAJCOM;});
          },
          majcomGroup: function() {
            return this.majcomDim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial);
          },
          mpfDim: function() {
            return this.ndx.dimension(function(d) {return d.MPF;});
          },
          mpfGroup: function() {
            return this.mpfDim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial);
          },
          pageLabel: function() {
            return this.pageName
          }

        },
        methods: {
          resetAll: (event)=>{
            dc.filterAll()
            dc.redrawAll()
          },
          startDemo: function() {
            introJs().start()
          },
          resetChart: (id)=>{
            dc.chartRegistry.list().filter(chart=>{
              return chart.anchorName() == id
            }).forEach(chart=>{
              chart.filterAll()
            })
            dc.redrawAll()
          },
          radioButton: () => {
            setTimeout(function() {
                dc.redrawAll()
            },10)
          },
          submit: (text,id) => {
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == id 
            }).forEach(chart=>{
                var mainArray = []
                chart.dimension().group().all().forEach((d) => {
                    mainArray.push(String(d.key))
                })
                var filterArray = mainArray.filter((d) => {
                    var element = d.toUpperCase() 
                    return element.indexOf(text.toUpperCase()) !== -1
                })
                chart.filter(null)
                if (filterArray.length != mainArray.length) {
                    chart.filter([filterArray])
                }
            })
            dc.redrawAll()
          },
            manningAdd: function(p,v) {
                p.asgn = p.asgn + +v.Assigned
                p.auth = p.auth + +v.Authorized
                p.stp = p.stp + +v.STP
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent = p.asgn/p.auth === Infinity ? 0 : Math.round((p.asgn/p.auth)*1000)/10 || 0
                p.stpPercent = p.stp/p.auth === Infinity ? 0 : Math.round((p.stp/p.auth)*1000)/10 || 0
                return p
            },
            manningRemove: function(p,v) {
                p.asgn = p.asgn - +v.Assigned
                p.auth = p.auth - +v.Authorized
                p.stp = p.stp - +v.STP
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent = p.asgn/p.auth === Infinity ? 0 : Math.round((p.asgn/p.auth)*1000)/10 || 0
                p.stpPercent = p.stp/p.auth === Infinity ? 0 : Math.round((p.stp/p.auth)*1000)/10 || 0
                return p
            },
            manningInitial: function() {
                return {
                    asgn: 0,
                    auth: 0,
                    stp: 0,
                    percent: 0,
                    stpPercent: 0,
                }
            },
            manningAddLarge: function(p,v) {
                p.asgn = p.asgn + +v.asgn
                p.auth = p.auth + +v.auth
                p.stp = p.stp + +v.stp
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent = p.asgn/p.auth === Infinity ? 0 : Math.round((p.asgn/p.auth)*1000)/10 || 0
                p.stpPercent = p.stp/p.auth === Infinity ? 0 : Math.round((p.stp/p.auth)*1000)/10 || 0
                return p
            },
            toProperCase: function(s) {
                return s.toLowerCase().replace(/^(.)|\s(.)/g, 
                    function($1) { return $1.toUpperCase(); });
            },
            fabDownload: function(){
                var data = this.downloadDim.top(Infinity)
                var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"})

                var myFilters = ''
                dc.chartRegistry.list().forEach((d)=>{
                    if (d.filters()[0])
                        myFilters += ' (' + d.filters() + ')'
                })

                FileSaver.saveAs(blob, 'PERSTAT ' + this.pageName + ' ' + store.state.asDate + myFilters + ' .csv');
            },
            fabFilter: function(){
                //Curent Filters button
                var myFilters = this.toProperCase(this.pageLabel) + ' filters ';
                dc.chartRegistry.list().forEach((d)=>{                    
                //console.log("d.filter(): "+d.filter())
                if (d.hasFilter() && d.anchor()!='#dc-overviewmajcom-barchart' && d.anchor()!='#dc-overviewmpf-barchart') {
                    //console.log(d.anchor(), d.filters())
                    myFilters += '\n (' + d.filters() + ')'
                } 
                })
                if (myFilters !== undefined) {
                    var myCheckValue = '0';
                    
                    if (this.selected == "asgn") {
                        var asgn = this.ndx.groupAll().reduceSum(function(d) { return +d.Assigned})
                        myCheckValue = asgn.value() };
                    if (this.selected == "stp") { 
                        var stp = this.ndx.groupAll().reduceSum(function(d) { return +d.STP})
                        myCheckValue = stp.value() };
                    if (this.selected == "auth") { 
                        var auth = this.ndx.groupAll().reduceSum(function(d) { return +d.Authorized })
                        myCheckValue = auth.value() };
                    if (this.selected == "percent") { 
                        myCheckValue = percent.innerText.substr(0, percent.innerText.length-1) };
                //console.log("myCheckvalue: "+ myCheckValue );
                // Override global options
                  toastr.options = {
                    "positionClass": "toast-bottom-full-width",
                    "closeButton":"true",
                    "preventDuplicates":"true"
                  }
                  if (myCheckValue == '0.0%' || myCheckValue == 0 ) {
                    toastr.warning('Your ' + this.toProperCase(this.pageLabel) + ' filter(s) returned no results. Please reset and try again.');
                  }
                  else if (myCheckValue == '1') {
                    myFilters += ' return ' + myCheckValue + ' ' + this.ylabel + ' result.'
                    toastr.info(myFilters);                         
                  }
                  else {
                    myFilters += ' return ' + myCheckValue + ' ' + this.ylabel + ' results.'
                    toastr.info(myFilters);  
                  }                      
                }
                if (myFilters == 'undefined' || myFilters == undefined) {
                    toastr.error('Something went wrong. Please reset and try again.')
                }
            }
        },
        components: {
            'loader': Loader,
            FontAwesomeIcon,
            overviewBarChart,
            fab
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')

            //TEST AXIOS CALL:
            axios.post(axios_url_enl_man).then(response => {
                store.state.asDate = response.data.ASOFDATE
                var axiosData = response.data.data
                var objData = makeObject(axiosData)
                this.data = objData
                this.loaded = true
                renderCharts()
            }).catch(console.error)

            var makeObject = (data) => {
                var keys = data.shift()
                var i = 0
                var k = 0
                var obj = null
                var obj2 = null
                var output = [];

                for (i=0; i < data.length; i++) {
                    obj = {};
                    for (k = 0; k < keys.length; k++) {
                        obj[keys[k]] = data[i][k];
                    }
                    obj2 = {};
                    obj2 = formatData(obj)
                    //obj2 = testData(obj2, obj)
                    output.push(obj2);
                }
                return output;
            }

            var formatData = (given) =>{
                var obj = {}

                obj.Grade = formats.gradeFormat[given.GRADE]
                obj.MAJCOM = formats.majFormat[given.MAJCOM_T12C]
                if (given.AFSC_GROUP == '**ERROR**') {
                    obj.AFSC_Group = 'PENDING UPDATE' 
                }  
                else {
                    obj.AFSC_Group = given.AFSC_GROUP
                }
                obj.MPF = formats.mpfFormat[given.MPF]
                obj.Assigned = +given.ASGNCURR
                obj.Authorized = +given.AUTHCURR
                obj.STP = given.STP
                obj.PERCENT_ASSIGNED = obj.Assigned/obj.Authorized === Infinity ? 0 : Math.round((obj.Assigned/obj.Authorized)*1000)/10 || 0;

                return obj;
            }

            var testData = (formatted, original) =>{
                for (var key in formatted) {
                    if (formatted[key] === undefined){
                        console.log('Empty Value of ' + key)
                        console.log(original)
                        formatted[key] = "UNKNOWN"
                    }
                }
                return formatted;
            }

            var renderCharts = () => {
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //remove empty function (es6 syntax to keep correct scope)
                var removeEmptyBins = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.value[this.selected] != 0
                            })
                        }
                    }
                }

                //Number Display for Auth, Asgn, STP - show total for filtered content
                var overallGroup = this.ndx.groupAll().reduce(this.manningAdd,this.manningRemove,this.manningInitial)
                var authND = dc.numberDisplay("#auth")
                authND.group(overallGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d.auth;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var asgnND = dc.numberDisplay("#asgn")
                asgnND.group(overallGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.asgn;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var stpND = dc.numberDisplay("#stp")
                stpND.group(overallGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.stp;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var percentND = dc.numberDisplay("#percent")
                percentND.group(overallGroup)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.percent})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
                    
                //grade
                
                var gradeConfig = {};
                gradeConfig.id = 'grade';
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return d.Grade;
                })
                gradeConfig.group = removeEmptyBins(gradeConfig.dim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial))
                gradeConfig.minHeight = 267
                gradeConfig.aspectRatio = 4
                gradeConfig.margins = {top: 10, left: 50, right: 30, bottom: 20}
                gradeConfig.colors = this.chartSpecs.gradeChartColorScale 
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                gradeChart
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    .colorAccessor((d) => {
                        return d.key;
                    })
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })                                    
                
                //afscGroup
                var afscGroupConfig = {}
                afscGroupConfig.id = 'afscGroup'
                afscGroupConfig.dim = this.ndx.dimension(function(d){return d.AFSC_Group})
                afscGroupConfig.group = removeEmptyBins(afscGroupConfig.dim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial))
                afscGroupConfig.minHeight = chartSpecs.afscGroupChart.minHeight
                afscGroupConfig.aspectRatio = chartSpecs.afscGroupChart.aspectRatio
                afscGroupConfig.margins = chartSpecs.afscGroupChart.margins
                afscGroupConfig.colors = [chartSpecs.afscGroupChart.color]
                var afscGroupChart = dchelpers.getOrdinalBarChart(afscGroupConfig)
                afscGroupChart
                    .elasticX(true)
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            chart.filter(d);
                            dc.redrawAll();
                        })                                     
                    })

                // after DOM updated redraw to make chart widths update
                this.$nextTick(() => {
                    dc.redrawAll()
                })

                //make responsive
                var temp
                window.onresize = function(event) {
                    clearTimeout(temp)
                    temp = setTimeout(dc.redrawAll(), 500)
                }

                //create charts
                dc.renderAll()
                dc.redrawAll()
            }
        },
        beforeUpdate() {
            console.log("beforeupdate")
        },
        beforeDestroy() {
            console.log("beforeDestroy")
            dc.chartRegistry.clear()
            store.state.asDate = 'Undetermined'
        },
        destroyed() {
            console.log("destroyed")
        }
    }
</script>
<style src="../../../node_modules/toastr/build/toastr.css"/>
<style src="../../../node_modules/dc/dc.css"/>
<style>
#majcom, #grade, #afscGroup, #mpf {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
<style scoped>
div[id*="-barchart"] .x.axis text{
    text-anchor: end !important;
    transform: rotate(-45deg);
  }

div[id*="-rowchart"] g.row text{
    fill: black;
}
#radioSelect div,input,label{
    cursor: pointer;
}
.fade-enter-active {
    transition: all 0.5s;
}
.fade-leave-active {
    transition: all 0.2s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
.fade-enter-to, .fade-leave {
    opacity: 1;
}
</style>

