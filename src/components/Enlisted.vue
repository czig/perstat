<template>
    <div class="container">
        <div class="row">
            <h1 class="col">Enlisted</h1>
        </div>
        <div class="row pt-2"> 
            <div id="radioSelect" class="col form-group">
                <input name="radio" type="radio" id="radio1" checked="checked" value="percent" v-model="selected" @click="radioButton">
                <label for="radio">Percentage</label>
                <input name="group2" type="radio" id="radio2" value="asgn" v-model="selected" @click="radioButton">
                <label for="radio">Assigned</label>
                <input name="group3" type="radio" id="radio3" value="auth" v-model="selected" @click="radioButton">
                <label for="radio3">Authorized</label>
                <input name="group4" type="radio" id="radio4" value="stp" v-model="selected" @click="radioButton">
                <label for="radio4">STP</label>
            </div>
            <div class="col"></div>
            <div class="col-auto">
                <button type="button" 
                        class="btn btn-danger btn-rounded btn-sm waves-effect" 
                        @click="resetAll">Reset All</button>
            </div>
        </div>
        <div class="row">
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
        <div class="row">
            <div id="majcom" class="col-12">
                <div id="dc-majcom-barchart">
                    <h3>MAJCOM <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-majcom-barchart')">Reset</button>
                    </h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div id="grade" class="col-4">
                <div id="dc-grade-rowchart">
                    <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-grade-rowchart')">Reset</button>
                    </h3>
                </div>
            </div>
            <div id="afscGroup" class="col-8">
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
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import axios from 'axios'

    export default {
        data() {
            return {
                data: [],
                selected: "percent"
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
                return "Manning Percent (%)"
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
          }
        },
        methods: {
          resetAll: (event)=>{
            dc.filterAll()
            dc.redrawAll()
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
          }
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')

            //axios request - can change to a get request and change to the "get" endpoint to see a get request
            
            //PROD AXIOS CALL:  
            /*
                var querystring = require('querystring');
                const formData = {
                    _PROGRAM:"/REN - Dashboard Home V1/makeHTML_collab",
                    nPage:"off"
                }
                var myData = axios.post('', querystring.stringify(formData)).then(response => {
            */
            
            //TEST AXIOS CALL:
            axios.post('http://localhost:5005/api/enlisted_post').then(response => {
                var axiosData = response.data.data
                var objData = makeObject(axiosData)
                this.data = objData
                renderCharts()
            }).catch(console.error)

            var makeObject = (data) => {
                var keys = data.shift()
                var i = 0
                var k = 0
                var obj = null
                var output = [];

                for (i=0; i < data.length; i++) {
                    obj = {};
                    for (k = 0; k < keys.length; k++) {
                        obj[keys[k]] = data[i][k];
                    }
                    output.push(obj);
                }
                return output;
            }

            var renderCharts = () => {
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //reduce functions
                function manningAdd(p,v) {
                    p.asgn = p.asgn + +v.ASGNCURR
                    p.auth = p.auth + +v.AUTHCURR
                    p.stp = p.stp + +v.STP
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.asgn/p.auth === Infinity ? 0 : Math.round((p.asgn/p.auth)*1000)/10 || 0
                    p.stpPercent = p.stp/p.auth === Infinity ? 0 : Math.round((p.stp/p.auth)*1000)/10 || 0
                    return p
                }
                function manningRemove(p,v) {
                    p.asgn = p.asgn - +v.ASGNCURR
                    p.auth = p.auth - +v.AUTHCURR
                    p.stp = p.stp - +v.STP
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.asgn/p.auth === Infinity ? 0 : Math.round((p.asgn/p.auth)*1000)/10 || 0
                    p.stpPercent = p.stp/p.auth === Infinity ? 0 : Math.round((p.stp/p.auth)*1000)/10 || 0
                    return p
                }
                function manningInitial() {
                    return {
                        asgn: 0,
                        auth: 0,
                        stp: 0,
                        percent: 0,
                        stpPercent: 0,
                    }
                }

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

                //MAJCOM
                var majcomConfig = {}
                majcomConfig.id = 'majcom'
                majcomConfig.dim = this.ndx.dimension(function(d){return d.MAJCOM_T12C})
                var majcomPercent = majcomConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                majcomConfig.group = removeEmptyBins(majcomPercent)
                majcomConfig.minHeight = 300
                majcomConfig.aspectRatio = 5
                majcomConfig.margins = {top: 30, left: 40, right: 30, bottom: 100}
                majcomConfig.colors = ["#1976d2"]
                var majcomChart = dchelpers.getOrdinalBarChart(majcomConfig)
                majcomChart
                    .elasticX(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', function(chart) {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })

                //Number Display for Auth, Asgn, STP - show total for filtered content
                var auth = this.ndx.groupAll().reduceSum(function(d) { return +d.AUTHCURR })
                var authND = dc.numberDisplay("#auth")
                authND.group(auth)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var asgn = this.ndx.groupAll().reduceSum(function(d) { return +d.ASGNCURR})
                var asgnND = dc.numberDisplay("#asgn")
                asgnND.group(asgn)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var stp = this.ndx.groupAll().reduceSum(function(d) { return +d.STP})
                var stpND = dc.numberDisplay("#stp")
                stpND.group(stp)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var percentGroup = this.ndx.groupAll().reduce(manningAdd,manningRemove,manningInitial)
                var percentND = dc.numberDisplay("#percent")
                percentND.group(percentGroup)
                    .formatNumber(d3.format("r"))
                    .valueAccessor(function(d) {return d.percent})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
                    
                //grade
                var grdFormat = {
                    "31": "[31-33] AMN",
                    "32": "[31-33] AMN",
                    "33": "[31-33] AMN",
                    "34": "SRA",
                    "35": "SSG",
                    "36": "TSG",
                    "37": "MSG",
                    "38": "SMS",
                    "39": "CMS"
                };
                
                var gradeOrder = {
                    "CMS": 39,
                    "SMS": 38,
                    "MSG": 37,
                    "TSG": 36,
                    "SSG": 35,
                    "SRA": 34,
                    "A1C": 33,
                    "AMN": 32,
                    "AB": 31,
                    "[31-33] AMN": 30
                };
                var gradeConfig = {};
                gradeConfig.id = 'grade';
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return grdFormat[d.GRADE];
                })
                gradeConfig.group = gradeConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                gradeConfig.minHeight = 200 
                gradeConfig.aspectRatio = 2
                gradeConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                gradeConfig.colors = d3.scale.category10()
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                gradeChart
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    .ordering(function(d){
                      return gradeOrder[d.key]
                    })                                    
                
                //afscGroup
                var afscGroupConfig = {}
                afscGroupConfig.id = 'afscGroup'
                afscGroupConfig.dim = this.ndx.dimension(function(d){return d.AFSC_GROUP})
                afscGroupConfig.group = afscGroupConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                afscGroupConfig.minHeight = 200 
                afscGroupConfig.aspectRatio = 3 
                afscGroupConfig.margins = {top: 10, left: 40, right: 30, bottom: 120}
                afscGroupConfig.colors = ["#108b52"] 
                var afscGroupChart = dchelpers.getOrdinalBarChart(afscGroupConfig)
                afscGroupChart
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    .on('pretransition', function(chart) {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
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
        },
        destroyed() {
            console.log("destroyed")
        }
    }
</script>

<style src="../../node_modules/dc/dc.css">
</style>
<style>
div[id*="-barchart"] .x.axis text{
    text-anchor: end !important;
    transform: rotate(-45deg);
  }

div[id*="-rowchart"] g.row text{
    fill: black;
}
</style>
