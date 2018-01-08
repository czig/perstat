<template>
    <div class="container">
        <div class="row pt-2"> 
            <div id="radioSelect" class="col form-group">
                <input name="radio" type="radio" id="radio1" checked="checked" value="percent" v-model="selected" @click="radioButton">
                <label for="radio">Select Rate</label>
                <input name="radio2" type="radio" id="radio2" value="sel" v-model="selected" @click="radioButton">
                <label for="radio2">Selects</label>
                <input name="radio3" type="radio" id="radio3" value="elig" v-model="selected" @click="radioButton">
                <label for="radio3">Eligible</label>
                <input name="radio4" type="radio" id="radio4" value="pmePercent" v-model="selected" @click="radioButton">
                <label for="radio4">PME Rate</label>
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
            </div>
        </div>
        <div class="row">
            <div class="col-auto">
                Selects:        
                <span id="sel"></span>
            </div>
            <div class="col-auto">
                PME Complete:
                <span id="pme"></span>
            </div>
            <div class="col-auto">
                Eligibles: 
                <span id="elig"></span>
            </div>
            <div class="col-auto">
                Select Rate: 
                <span id="selRate"></span>
            </div>
            <div class="col-auto">
                PME Complete Rate:
                <span id="pmeRate"></span>
            </div>
        </div>
        <div class="row">
            <div id="zone" class="col-4">
                <div id="dc-zone-rowchart">
                    <h3>Zone <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-zone-rowchart')">Reset</button>
                    </h3>
                </div>
            </div>
            <div id="compCat" class="col-8">
                <div id="dc-compCat-barchart">
                    <h3>CompCat <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-compCat-barchart')">Reset</button>
                    </h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div id="occupGroup" class="col-6">
                <div id="dc-occupGroup-barchart">
                    <h3>Occupation <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-occupGroup-barchart')">Reset</button>
                    </h3>
                </div>
            </div>
            <div id="grade" class="col-3">
                <div id="dc-grade-rowchart">
                    <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-grade-rowchart')">Reset</button>
                    </h3>
                </div>
            </div>
            <div id="recommend" class="col-3">
                <div id="dc-recommend-rowchart">
                    <h3>Recommendation <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-recommend-rowchart')">Reset</button>
                    </h3>
                </div>
            </div>
        </div>
        <div class="row">
            <div id="board" class="col-12">
                <div id="dc-board-barchart">
                    <h3>Board <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-board-barchart')">Reset</button>
                    </h3>
                </div>
            </div>
        </div>
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
                return "Select Rate (%)"
            }
            else if (this.selected === "sel") {
                return "Selects"
            }
            else if (this.selected === "elig") {
                return "Eligibles"
            }
            else {
                return "PME Complete Rate (%)"
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
                function promoAdd(p,v) {
                    p.elig = p.elig + +v.num_eligible
                    p.sel = p.sel + +v.num_select
                    p.pme = p.pme + +v.num_pme
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
                    p.pmePercent = p.pme/p.elig === Infinity ? 0 : Math.round((p.pme/p.elig)*1000)/10 || 0
                    return p
                }
                function promoRemove(p,v) {
                    p.elig = p.elig - +v.num_eligible
                    p.sel = p.sel - +v.num_select
                    p.pme = p.pme - +v.num_pme
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
                    p.pmePercent = p.pme/p.elig === Infinity ? 0 : Math.round((p.pme/p.elig)*1000)/10 || 0
                    return p
                }
                function promoInitial() {
                    return {
                        elig: 0,
                        sel: 0,
                        pme: 0,
                        percent: 0,
                        pmePercent: 0
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

                //Number Display for sel, elig, sel rate, pme, pme rate - show total for filtered content
                var sel = this.ndx.groupAll().reduceSum(function(d) { return +d.num_select })
                var selND = dc.numberDisplay("#sel")
                selND.group(sel)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var elig = this.ndx.groupAll().reduceSum(function(d) { return +d.num_eligible})
                var eligND = dc.numberDisplay("#elig")
                eligND.group(elig)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var selRate = this.ndx.groupAll().reduce(promoAdd, promoRemove, promoInitial)
                var selRateND = dc.numberDisplay("#selRate")
                selRateND.group(selRate)
                    .formatNumber(d3.format("r"))
                    .valueAccessor(function(d) {return d.percent;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
                var pme = this.ndx.groupAll().reduceSum(function(d) {return +d.num_pme})
                var pmeND = dc.numberDisplay("#pme")
                pmeND.group(pme)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var pmeRate = this.ndx.groupAll().reduce(promoAdd, promoRemove, promoInitial)
                var pmeRateND = dc.numberDisplay("#pmeRate")
                pmeRateND.group(pmeRate)
                    .formatNumber(d3.format("r"))
                    .valueAccessor(function(d) {return d.pmePercent;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })

                //zone
                var zoneConfig = {};
                zoneConfig.id = 'zone'
                zoneConfig.dim = this.ndx.dimension(function (d) {
                    return formats.zoneFormat[d.Zone];
                })
                zoneConfig.group = zoneConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                zoneConfig.minHeight = 200 
                zoneConfig.aspectRatio = 2
                zoneConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                zoneConfig.colors = d3.scale.category10()
                var zoneChart = dchelpers.getRowChart(zoneConfig)
                zoneChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d){
                      return formats.zoneOrder[d.key]
                    })                                    

                //Compcat
                var compCatConfig = {}
                compCatConfig.id = 'compCat'
                compCatConfig.dim = this.ndx.dimension(function(d){return d.Compcat})
                compCatConfig.group = compCatConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                compCatConfig.minHeight = 300
                compCatConfig.aspectRatio = 5
                compCatConfig.margins = {top: 30, left: 40, right: 30, bottom: 100}
                compCatConfig.colors = ["#1976d2"]
                var compCatChart = dchelpers.getOrdinalBarChart(compCatConfig)
                compCatChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .elasticX(true)
                    .ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', function(chart) {
                        chart.selectAll('rect.bar')
                            .classed('stack-deselected', function(d) {
                                //d.x is compCat and d.layer is assigned or selRate
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
                    return formats.gradeFormat[d.Board_ID.substring(1,3)];
                })
                gradeConfig.group = gradeConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                gradeConfig.minHeight = 200 
                gradeConfig.aspectRatio = 2
                gradeConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                gradeConfig.colors = d3.scale.category10()
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                gradeChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })                                    

                //recommend
                var recommendConfig = {};
                recommendConfig.id = 'recommend'
                recommendConfig.dim = this.ndx.dimension(function (d) {
                    return d.Promo_Recomendation;
                })
                recommendConfig.group = recommendConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                recommendConfig.minHeight = 200 
                recommendConfig.aspectRatio = 2
                recommendConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                recommendConfig.colors = d3.scale.category10()
                var recommendChart = dchelpers.getRowChart(recommendConfig)
                recommendChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                
                //occupGroup
                var occupGroupConfig = {}
                occupGroupConfig.id = 'occupGroup'
                occupGroupConfig.dim = this.ndx.dimension(function(d){return d.Occupation})
                occupGroupConfig.group = occupGroupConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                occupGroupConfig.minHeight = 200 
                occupGroupConfig.aspectRatio = 3 
                occupGroupConfig.margins = {top: 10, left: 40, right: 30, bottom: 80}
                occupGroupConfig.colors = ["#108b52"] 
                var occupGroupChart = dchelpers.getOrdinalBarChart(occupGroupConfig)
                occupGroupChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .on('pretransition', function(chart) {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })

          //      //board(mpf)
                var boardConfig = {}
                boardConfig.id = 'board'
                boardConfig.dim = this.ndx.dimension(function(d){return d.Board_ID})
                var boardGroup = boardConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                boardConfig.group = removeEmptyBins(boardGroup)
                boardConfig.minHeight = 400
                boardConfig.aspectRatio = 5
                boardConfig.margins = {top: 30, left: 40, right: 30, bottom: 200}
                boardConfig.colors = ["#1976d2"]
                var boardChart = dchelpers.getOrdinalBarChart(boardConfig)
                boardChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .elasticX(true)
                    .ordinalColors(["#1976d2","#ff4500"])
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
