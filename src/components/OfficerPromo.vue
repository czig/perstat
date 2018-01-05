<template>
    <div class="container">
        <div class="row pt-2"> 
            <div class="col-auto">
                <button type="button" 
                        class="btn btn-danger btn-rounded btn-sm waves-effect" 
                        @click="resetAll">Reset All</button>
            </div>
        </div>
        <div class="row">
            <div class="col-auto">
            </div>
        </div>
        <div class="row">
            <div id="compCat" class="col-12">
                <div id="dc-compCat-barchart">
                    <h3>CompCat <span style="font-size: 14pt; opacity: 0.87;"></span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-compCat-barchart')">Reset</button>
                    </h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div id="grade" class="col-4">
                <div id="dc-grade-rowchart">
                    <h3>Grade <span style="font-size: 14pt; opacity: 0.87;"></span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-grade-rowchart')">Reset</button>
                    </h3>
                </div>
            </div>
            <!--<div id="afscGroup" class="col-8">-->
                <!--<div id="dc-afscGroup-barchart">-->
                    <!--<h3>AFSC Group <span style="font-size: 14pt; opacity: 0.87;"></span>-->
                    <!--<button type="button" -->
                            <!--class="btn btn-danger btn-sm btn-rounded reset" -->
                            <!--style="display: none"-->
                            <!--@click="resetChart('dc-afscGroup-barchart')">Reset</button>-->
                    <!--</h3>-->
                <!--</div>-->
            <!--</div>-->
        </div>
        <!--<div class="row">-->
            <!--<div id="base" class="col-12">-->
                <!--<div id="dc-base-barchart">-->
                    <!--<h3>Base <span style="font-size: 14pt; opacity: 0.87;"></span>-->
                    <!--<button type="button" -->
                            <!--class="btn btn-danger btn-sm btn-rounded reset" -->
                            <!--style="display: none"-->
                            <!--@click="resetChart('dc-base-barchart')">Reset</button>-->
                    <!--</h3>-->
                    <!--<form class="form-inline">-->
                        <!--<div class="form-group">-->
                            <!--<input id="searchBase" v-model="searchBase" placeholder="Search Installation" @keydown.enter="submit(searchBase,'dc-base-barchart')">-->
                            <!--<button class="btn btn-primary btn-sm" @click="submit(searchBase,'dc-base-barchart')">Submit</button>-->
                        <!--</div>-->
                    <!--</form>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import axios from 'axios'
import formats from '@/store/format'
import AutoComplete from './AutoComplete'

    export default {
        data() {
            return {
                data: []
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
          }
        },
        components: {
            'autocomplete': AutoComplete
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
            axios.post('http://localhost:5005/api/officer_promo').then(response => {
                var promoData = response.data.data
                this.data = promoData
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

                //Compcat
                var compCatConfig = {}
                compCatConfig.id = 'compCat'
                compCatConfig.dim = this.ndx.dimension(function(d){return d.Compcat})
                compCatConfig.group = removeEmptyBins(compCatConfig.dim.group())
                compCatConfig.minHeight = 300
                compCatConfig.aspectRatio = 5
                compCatConfig.margins = {top: 30, left: 40, right: 30, bottom: 100}
                compCatConfig.colors = ["#1976d2"]
                var compCatChart = dchelpers.getOrdinalBarChart(compCatConfig)
                compCatChart
                    .elasticX(true)
                    .ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', function(chart) {
                        chart.selectAll('rect.bar')
                            .classed('stack-deselected', function(d) {
                                //d.x is compCat and d.layer is assigned or stp
                                return chart.filter() && chart.filters().indexOf(d.x) === -1
                            })
                            .on('click', function(d) {
                                chart.filter(d.x)
                                dc.redrawAll()
                            })
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})

                    
                //grade
                var gradeConfig = {};
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return d.Board_ID.substring(1,3);
                })
                gradeConfig.group = gradeConfig.dim.group()
                gradeConfig.minHeight = 200 
                gradeConfig.aspectRatio = 2
                gradeConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                gradeConfig.colors = d3.scale.category10()
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                gradeChart
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })                                    
                
          //      //afscGroup
          //      var afscGroupConfig = {}
          //      afscGroupConfig.id = 'afscGroup'
          //      afscGroupConfig.dim = this.ndx.dimension(function(d){return formats.afscGroupFormat[d.AFSC_GROUP]})
          //      afscGroupConfig.group = afscGroupConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
          //      afscGroupConfig.minHeight = 200 
          //      afscGroupConfig.aspectRatio = 3 
          //      afscGroupConfig.margins = {top: 10, left: 40, right: 30, bottom: 80}
          //      afscGroupConfig.colors = ["#108b52"] 
          //      var afscGroupChart = dchelpers.getOrdinalBarChart(afscGroupConfig)
          //      afscGroupChart
          //          .valueAccessor((d)=> {
          //              return d.value[this.selected];
          //          })
          //          .on('pretransition', function(chart) {
          //              chart.selectAll('g.x text')
          //              .attr('transform', 'translate(-8,0)rotate(-45)')
          //          })

          //      //base(mpf)
          //      var baseConfig = {}
          //      baseConfig.id = 'base'
          //      baseConfig.dim = this.ndx.dimension(function(d){return formats.mpfFormat[d.MPF]})
          //      var basePercent = baseConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
          //      baseConfig.group = removeEmptyBins(basePercent)
          //      baseConfig.minHeight = 400
          //      baseConfig.aspectRatio = 5
          //      baseConfig.margins = {top: 30, left: 110, right: 30, bottom: 200}
          //      baseConfig.colors = ["#1976d2"]
          //      var baseChart = dchelpers.getOrdinalBarChart(baseConfig)
          //      baseChart
          //          .elasticX(true)
          //          .valueAccessor((d) => {
          //              return d.value[this.selected]
          //          })
          //          .ordinalColors(["#1976d2","#ff4500"])
          //          .on('pretransition', function(chart) {
          //              chart.selectAll('g.x text')
          //              .attr('transform', 'translate(-8,0)rotate(-45)')
          //          })


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
