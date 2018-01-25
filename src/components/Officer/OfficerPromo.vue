<template>
    <div class="container">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
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
                        Eligibles: 
                        <span id="elig"></span>
                    </div>
                    <div class="col-auto">
                        Promotion Rate: 
                        <span id="selRate"></span>
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
                    <div id="recommend" class="col-5">
                        <div id="dc-recommend-rowchart">
                            <h3>Recommendation <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                <transition>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-recommend-rowchart')">Reset</button></transition>
                            </h3>
                        </div>
                    </div>
                    <div id="pmeSelect" class="col-3">
                        <div id="dc-pmeSelect-rowchart">
                            <h3>PME <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-pmeSelect-rowchart')">Reset</button>
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
                <div class="row">
                    <div id="occupGroup" class="col-12">
                        <div id="dc-occupGroup-barchart">
                            <h3>Occupation <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-occupGroup-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import axios from 'axios'
import formats from '@/store/format'
import AutoComplete from '@/components/AutoComplete'
import Loader from '@/components/Loader'

    export default {
        data() {
            return {
                data: [],
                selected: "percent",
                loaded: false 

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
                return "Promotion Rate (%)"
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
            'autocomplete': AutoComplete,
            'loader': Loader
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
            axios.post(axios_url_off_pro).then(response => {
                var promoData = response.data.data
                this.data = promoData
                this.loaded = true
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
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
                    return p
                }
                function promoRemove(p,v) {
                    p.elig = p.elig - +v.num_eligible
                    p.sel = p.sel - +v.num_select
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
                    return p
                }
                function promoInitial() {
                    return {
                        elig: 0,
                        sel: 0,
                        percent: 0,
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

                //Number Display for sel, elig, sel rate - show total for filtered content
                var numberGroup = this.ndx.groupAll().reduce(promoAdd, promoRemove, promoInitial)
                var selND = dc.numberDisplay("#sel")
                selND.group(numberGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d.sel;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var eligND = dc.numberDisplay("#elig")
                eligND.group(numberGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.elig;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var selRateND = dc.numberDisplay("#selRate")
                selRateND.group(numberGroup)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.percent;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })


                //Compcat
                var compCatConfig = {}
                compCatConfig.id = 'compCat'
                compCatConfig.dim = this.ndx.dimension(function(d){
                    return formats.compCatFormat[d.Compcat];
                })
                compCatConfig.group = compCatConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                compCatConfig.minHeight = 260
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
                gradeConfig.minHeight = 150 
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

                //zone
                var zoneConfig = {};
                zoneConfig.id = 'zone'
                zoneConfig.dim = this.ndx.dimension(function (d) {
                    return formats.zoneFormat[d.Zone];
                })
                zoneConfig.group = zoneConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                zoneConfig.minHeight = 150 
                zoneConfig.aspectRatio = 3
                zoneConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                zoneConfig.colors = d3.scale.ordinal().range(["#1b9e77","#7570b3","#d95f02"])
                var zoneChart = dchelpers.getRowChart(zoneConfig)
                zoneChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d){
                      return formats.zoneOrder[d.key]
                    })                                    

                //recommend
                var recommendConfig = {};
                recommendConfig.id = 'recommend'
                recommendConfig.dim = this.ndx.dimension(function (d) {
                    return formats.recommendFormat[d.Promo_Recomendation];
                })
                recommendConfig.group = recommendConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                recommendConfig.minHeight = 150 
                recommendConfig.aspectRatio = 3
                recommendConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                recommendConfig.colors = d3.scale.ordinal().range(["#1a9641","#a6d96a","#fdae61","#d7191c"])
                var recommendChart = dchelpers.getRowChart(recommendConfig)
                recommendChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d) {
                        return formats.recommendOrder[d.key]
                    })

                //pme
                var pmeConfig = {};
                pmeConfig.id = 'pmeSelect'
                pmeConfig.dim = this.ndx.dimension(function (d) {
                    return formats.pmeFormat[d.PME_Complete];
                })
                pmeConfig.group = pmeConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                pmeConfig.minHeight = 150 
                pmeConfig.aspectRatio = 3
                pmeConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                pmeConfig.colors = d3.scale.ordinal().range(["#1a9641","#d7191c"])
                var pmeChart = dchelpers.getRowChart(pmeConfig)
                pmeChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d){
                      return formats.pmeOrder[d.key]
                    })                                    
                
                //occupGroup
                var occupGroupConfig = {}
                occupGroupConfig.id = 'occupGroup'
                occupGroupConfig.dim = this.ndx.dimension(function(d){return d.Occupation})
                occupGroupConfig.group = occupGroupConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                occupGroupConfig.minHeight = 200 
                occupGroupConfig.aspectRatio = 5 
                occupGroupConfig.margins = {top: 10, left: 40, right: 30, bottom: 40}
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
                    .gap(20)

                //board
                var boardConfig = {}
                boardConfig.id = 'board'
                boardConfig.dim = this.ndx.dimension(function(d){return formats.gradeFormat[d.Board_ID.substring(1,3)] + "20" + d.Board_ID.substring(3,6) })
                var boardGroup = boardConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                boardConfig.group = removeEmptyBins(boardGroup)
                boardConfig.minHeight = 250
                boardConfig.aspectRatio = 5
                boardConfig.margins = {top: 30, left: 40, right: 30, bottom: 60}
                boardConfig.colors = ["#1976d2"]
                var boardChart = dchelpers.getOrdinalBarChart(boardConfig)

                boardChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .elasticX(true)
                    .ordinalColors(["#1976d2","#ff4500"])
                    .ordering(function(d) {
                        return formats.gradeOrder[d.key.substring(0,3)] + d.key.substring(3,8)
                    })
                    .on('pretransition', function(chart) {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
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
        },
        destroyed() {
            console.log("destroyed")
        }
    }
</script>

<style src="@/../node_modules/dc/dc.css">
</style>
<style scoped>
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
