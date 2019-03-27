<template>
    <div class="container-fluid">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
                    <div class="col"></div>
                    <div class="col-auto">
                        <button type="button" id="demo"
                            class="btn btn-info btn-rounded btn-sm waves-effect"
                            title="Demo"
                            @click="startDemo">
                            <p class="d-none d-md-inline">Demo&nbsp;&nbsp;</p>  
                            <FontAwesomeIcon icon="eye" 
                                            size="lg">
                            </FontAwesomeIcon>
                            
                        </button>
                        <!-- <button type="button" id="showMyFilters"
                                class="btn btn-info btn-rounded btn-sm waves-effect"
                                data-step="7" data-intro="See the currently applied filters here!"
                                title="Filter">
                        <p class="d-none d-md-inline">Filter&nbsp;&nbsp;</p>  
                        <FontAwesomeIcon icon="filter" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button>  -->
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect"
                                data-step="5" data-intro="Download data in tabular form here!"
                                title="Download Raw Data">
                        <p class="d-none d-md-inline">Download&nbsp;&nbsp;</p>
                        <FontAwesomeIcon icon="download" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button>
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect"
                                data-step="4" data-intro="Click here to reset filters on all charts." 
                                title="Reset All"
                                @click="searchCore='';resetAll()">
                        <p class="d-none d-md-inline">Reset All&nbsp;&nbsp;</p>  
                        <FontAwesomeIcon icon="redo-alt" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button>                         
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
                    <div id="grade" class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                        <div id="dc-grade-barchart" data-step="1" data-intro="Clicking the bars applies filters to the chart. Click on one of the bars and watch the other charts update!">
                            <h3 class="mb-0">Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <!--<font-awesome-icon icon="info-circle" data-toggle="tooltip" data-placement="bottom" title="Competitive Category" style="display: inline-block;"></font-awesome-icon>-->
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-grade-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="highestPme" class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                        <div id="dc-highestPme-barchart">
                            <h3 class="mb-0">Highest PME <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-highestPme-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="compCat" class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                        <div id="dc-compCat-rowchart">
                            <h3 class="mb-0">CompCat <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-compCat-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="recommend" class="col-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
                        <div id="dc-recommend-rowchart">
                            <h3 class="mb-0">Recommendation <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                <transition>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-recommend-rowchart')">Reset</button></transition>
                            </h3>
                        </div>
                    </div>
                    <div id="pmeMethod" class="col-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
                        <div id="dc-pmeMethod-rowchart">
                            <h3 class="mb-0">PME Method<span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-pmeMethod-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="us" class="col-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
                        <div id="dc-us-geoChoroplethChart" class="center-block clearfix" data-step="2" data-intro="You can mouse over a state or territory on the maps to see the personnel total or click on it to apply filters and update the other charts!">
                            <h3>US Map <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                class="btn btn-danger btn-sm btn-rounded reset" 
                                style="visibility: hidden"
                                @click="resetChart('dc-us-geoChoroplethChart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
                <largeBarChart :id="'core'"         
                               :dimension="coreDim"
                               :group="coreGroup"
                               :widthFactor="0.90"
                               :aspectRatio="chartSpecs.coreChart.aspectRatio"
                               :minHeight="chartSpecs.coreChart.minHeight"
                               :selected="selected"
                               :ylabel="ylabel"
                               :reducer="promoAdd"
                               :accumulator="promoInitial"
                               :numBars="30"
                               :margin="chartSpecs.coreChart.margins"
                               :colorScale="coreColorScale"
                               :title="'Core'"
                               :loaded="loaded">
                </largeBarChart>
                <largeBarChart :id="'board'"         
                               :dimension="boardDim"
                               :group="boardGroup"
                               :widthFactor="0.90"
                               :aspectRatio="chartSpecs.boardChart.aspectRatio"
                               :minHeight="chartSpecs.boardChart.minHeight"
                               :selected="selected"
                               :ylabel="ylabel"/
                               :reducer="promoAdd"
                               :accumulator="promoInitial"
                               :numBars="30"
                               :margin="chartSpecs.boardChart.margins"
                               :colorScale="boardColorScale"
                               :title="'Board'"
                               :loaded="loaded">
                </largeBarChart>

<!--                 <div class="row">
                    <div id="board" class="col-12">
                        <div id="dc-board-barchart">
                            <h3>Board <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-board-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
 -->            </div>
        </transition-group>
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import chartSpecs from '@/chartSpecs'
import axios from 'axios'
import formats from '@/store/format'
import AutoComplete from '@/components/AutoComplete'
import Loader from '@/components/Loader'
import { store } from '@/store/store'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import largeBarChart from '@/components/largeBarChart'

    export default {
        data() {
            return {
                data: [],
                selected: "percent",
                loaded: false,
                showAlert: true,
                width: document.documentElement.clientWidth,
                chartSpecs: chartSpecs,
                coreColorScale: d3.scale.ordinal().range([chartSpecs.coreChart.color]),
                boardColorScale: d3.scale.ordinal().range([chartSpecs.boardChart.color]),
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
                return "(%)"
            }
            else if (this.selected === "sel") {
                return "Selects"
            }
            else if (this.selected === "elig") {
                return "Eligibles"
            }
          },
          downloadDim: function() {
            return this.ndx.dimension(function(d) {return d;});    
          },      
          coreDim: function() {
            return this.ndx.dimension(function(d) {return d.Core;});
          },
          coreGroup: function() {
            return this.coreDim.group().reduce(this.promoAdd,this.promoRemove,this.promoInitial);
          },
          boardDim: function() {
            return this.ndx.dimension(function(d) {return d.Board;});
          },
          boardGroup: function() {
            return this.boardDim.group().reduce(this.promoAdd,this.promoRemove,this.promoInitial);
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
          promoAdd: function(p,v) {
              p.elig = p.elig + +v.elig
              p.sel = p.sel + +v.sel
              //if divide by 0, set to 0, and if NaN, set to zero
              p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
              return p
          },
          promoRemove: function(p,v) {
              p.elig = p.elig - +v.elig
              p.sel = p.sel - +v.sel
              //if divide by 0, set to 0, and if NaN, set to zero
              p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
              return p
          },
          promoInitial: function() {
              return {
                  elig: 0,
                  sel: 0,
                  percent: 0,
              }
          }
        },
        components: {
            'autocomplete': AutoComplete,
            'loader': Loader,
            FontAwesomeIcon,
            largeBarChart
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')

            
            //TEST AXIOS CALL:
            axios.post(axios_url_off_promo_ang).then(response => {
                store.state.asDate = response.data.ASOFDATE
                var promoData = response.data.data
                console.log(promoData);
                var objData = makeObject(promoData)
                console.log(objData);                
                this.data = objData 
                this.loaded = true
                renderCharts()
            }).catch(console.error)

            //TODO: import makeObject function and add new data
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
                    output.push(obj2);
                }
                return output;
            }

            var pmeMethodDecode = {
                'RES': 'Residence',
                'DES': 'Designee',
                'COR': 'Correspondence',
                'COM': 'Correspondence',
                'N/A': 'N/A'
            }
            var pmeMethodOrder = {
                'Residence': 0,
                'Designee': 1,
                'Correspondence': 2,
                'N/A': 3
            }
            var highestPmeOrder = {
                'SDE': 3,
                'IDE': 2,
                'PDE': 1,
                'NONE': 0
            }

            var formatData = (given) =>{
                var obj = {}
                //console.log("B1=" + given.grade)

                obj.Grade = formats.gradeFormat[given.Board_ID.substring(1,3)]
                obj.Competitive_Category = formats.compCatFormat[given.Compcat]
                obj.Recomendation = formats.recommendFormat[given.Promo_Recomendation];
                obj.PME = formats.pmeFormat[given.PME_Complete]
                obj.HighestPME = given.highpme.trim().split(" ")[0];
                obj.pmeMethod = pmeMethodDecode[given.highpme.trim().split(" ")[1] || 'N/A'];
                obj.Board = formats.gradeFormat[given.Board_ID.substring(1,3)] + "20" + given.Board_ID.substring(3,6)
                //console.log("state=" + given.ANG_State)
                obj.Core = given.Core
                obj.sel = +given.num_select
                obj.elig = +given.num_eligible
                obj.state = given.ANG_State  
                obj.Percent =  obj.sel/obj.elig === Infinity ? 0 : Math.round((obj.sel/obj.elig)*1000)/10 || 0;

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

                //reduce functions
                function promoAdd(p,v) {
                    p.elig = p.elig + +v.elig
                    p.sel = p.sel + +v.sel
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
                    return p
                }
                function promoRemove(p,v) {
                    p.elig = p.elig - +v.elig
                    p.sel = p.sel - +v.sel
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
                    
                //remove empty function (es6 syntax to keep correct scope)
                var removeError = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.key != "**ERROR**"
                            })
                        }
                    }
                }     
                    
                //grade
                var gradeConfig = {};
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return d.Grade;
                })
                gradeConfig.group = removeEmptyBins(gradeConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial))
                gradeConfig.minHeight = 260 
                gradeConfig.aspectRatio = 5 
                gradeConfig.margins = {top: 10, left: 30, right: 10, bottom: 40}
                gradeConfig.colors = chartSpecs.gradeChartColorScale 
                var gradeChart = dchelpers.getOrdinalBarChart(gradeConfig)
                gradeChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d){
                        return formats.gradeOrder[d.key]
                    })                                    
                    .colorAccessor(function(d) {
                        return d.key;
                    })
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })

                //highestPme
                var highestPmeConfig = {}
                highestPmeConfig.id = 'highestPme'
                highestPmeConfig.dim = this.ndx.dimension(function(d){
                    return d.HighestPME;
                })
                highestPmeConfig.group = removeEmptyBins(highestPmeConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial))
                highestPmeConfig.minHeight = 260 
                highestPmeConfig.aspectRatio = 5
                highestPmeConfig.margins = {top: 10, left: 30, right: 10, bottom: 40}
                highestPmeConfig.colors = ["#fe9929"]
                var highestPmeChart = dchelpers.getOrdinalBarChart(highestPmeConfig)
                highestPmeChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering((d) => {
                        return highestPmeOrder[d.key]
                    })
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})


                //Compcat
                //TODO: lighter blue
                var compCatConfig = {}
                compCatConfig.id = 'compCat'
                compCatConfig.dim = this.ndx.dimension(function(d){
                    return d.Competitive_Category;
                })
                compCatConfig.group = compCatConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                compCatConfig.minHeight = 260
                compCatConfig.aspectRatio = 3
                compCatConfig.margins = {top: 10, left: 30, right: 10, bottom: 20}
                compCatConfig.colors = d3.scale.ordinal().range(["#6baed6"])
                var compCatChart = dchelpers.getRowChart(compCatConfig)
                compCatChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })

                //recommend
                var recommendConfig = {};
                recommendConfig.id = 'recommend'
                recommendConfig.dim = this.ndx.dimension(function (d) {
                    return d.Recomendation;
                })
                recommendConfig.group = recommendConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                recommendConfig.minHeight = 150 
                recommendConfig.aspectRatio = 2
                recommendConfig.margins = {top: 10, left: 30, right: 10, bottom: 20}
                recommendConfig.colors = d3.scale.ordinal().range(["#1a9641","#a6d96a","#fdae61","#d7191c"])
                var recommendChart = dchelpers.getRowChart(recommendConfig)
                recommendChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d) {
                        return formats.recommendOrder[d.key]
                    })

                //pme
                var pmeMethodConfig = {};
                pmeMethodConfig.id = 'pmeMethod'
                pmeMethodConfig.dim = this.ndx.dimension(function (d) {
                    return d.pmeMethod;
                })
                pmeMethodConfig.group = pmeMethodConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                pmeMethodConfig.minHeight = 150 
                pmeMethodConfig.aspectRatio = 2
                pmeMethodConfig.margins = {top: 10, left: 30, right: 10, bottom: 20}
                pmeMethodConfig.colors = d3.scale.ordinal().range(["#1a9850","#91cf60","#d9ef8b","#fee08b"])
                var pmeMethodChart = dchelpers.getRowChart(pmeMethodConfig)
                pmeMethodChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d){
                      return pmeMethodOrder[d.key]
                    })                                    
                
                //CONUS 
                var usConfig = {}
                usConfig.id = 'us';
                usConfig.dim = this.ndx.dimension(function(d){
                    return d.state;
                })

                // var dimData = usConfig.dim.top(10);
                //     dimData.forEach(function (x) {
                //     console.log(JSON.stringify(x));
                // });
                usConfig.group = removeError(usConfig.dim.group().reduce(this.promoAdd,this.promoRemove,this.promoInitial))
                usConfig.scale = 1
                usConfig.minHeight = 200
                usConfig.aspectRatio = 2.1 
                usConfig.xRatio = 2.0
                usConfig.yRatio = 2.0
                //default color scale from #E2F2FF to #0061B5.
                usConfig.colors = d3.scale.quantize().range(["#E2F2FF","#d4eafc","#C4E4FF","#badefc","#a6d4fc","#9ED2FF","#81C5FF","#75bfff","#6BBAFF","#51AEFF","#40a4f9","#36A2FF","#2798f9","#1E96FF","#0089FF","#0061B5"])
                
                usConfig.valueAccessor = (d) => {
                    if (d) {                        
                        return d.value[this.selected];
                    }
                }
                usConfig.colorAccessor = function(d) {
                    if (d) {
                        return d;   
                    } else {
                        return 0;
                    }
                }
            
                var tfJson = require('../../assets/geoUS.json')
                usConfig.json = tfJson
                usConfig.geoName = "state"
                usConfig.propName = 'name' 
                usConfig.projection = d3.geo.albersUsa()

                var guText = ''
                var viText = ''
                var prText = ''

                var usChart = dchelpers.getGeoChart(usConfig)                
                usChart.title(function(d) {
                    if (d.value == undefined){ d.value = '0';}
                    if (d.key == 'GU') {guText = formats.geoCS[formats.stateFormat[d.key]] + ": " + d.value }
                    if (d.key == 'VI') {viText = formats.geoCS[formats.stateFormat[d.key]] + ": " + d.value }
                    if (d.key == 'PR') {prText = formats.geoCS[formats.stateFormat[d.key]] + ": " + d.value }
                    return formats.geoCS[formats.stateFormat[d.key]] + ": " + d.value ;
                });
                
                usChart.on('pretransition', (chart)=> {
                                            
                    var color = '#555'
                    chart.select('svg').attr("class", "border shadow p-1 mt-3 bg-white rounded")
                    chart.select('svg').select(".textLabels").remove()
                    chart.select('svg .layer0').append('g').attr("class", "textLabels")

                    var textLabels = chart.select('.textLabels')
                    textLabels.attr("cursor","pointer")

                    var textStroke = 2
                    textLabels
                        .append("text")
                        .attr("x", usConfig.width * 0.12)
                        .attr("y", usConfig.height * 0.63)
                        .attr("fill", color) 
                        .attr("font-size", '0.7vw')
                        .attr("font-weight", 'bold')  
                        .text('Guam')
                        .on('click', ()=>{
                            chart.filter([["GU"]]);
                            dc.redrawAll();
                        })
                        .append("title")                        
                        .text(guText)

                    textLabels
                        .append("text")
                        .attr("x", usConfig.width * 0.54)
                        .attr("y", usConfig.height * 0.93)
                        .attr("fill", color)  
                        .attr("font-size", '0.7vw')
                        .attr("font-weight", 'bold') 
                        .text('Puerto Rico')
                        .on('click', ()=>{
                            chart.filter([["PR"]]);
                            dc.redrawAll();                            
                        })
                        .append("title")                        
                        .text(prText)
                    
                    textLabels
                        .append("text")
                        .attr("x", usConfig.width * 0.61)
                        .attr("y", usConfig.height * 0.87)
                        .attr("fill", color)  
                        .attr("font-size", '0.7vw')
                        .attr("font-weight", 'bold') 
                        .text('US Virgin Islands')
                        .on('click', ()=>{
                            chart.filter([["VI"]]);
                            dc.redrawAll();                            
                        })
                        .append("title")                        
                        .text(viText)
                    // set viewport for svg
                    chart.maxWidth = 950
                    chart.maxHeight = 450

                    var mapZoom = usChart.select('svg .layer0')
                    mapZoom                        
                        .attr("width", chart.maxWidth)
                        .attr("height", chart.maxHeight)                        
                        .call(d3.behavior.zoom()
                            .scaleExtent([1, 10])
                            .on("zoom", function () {                             
                            var t = d3.event.translate,
                                s = d3.event.scale;
                            
                            t[0] = Math.min(chart.maxWidth / 2 * (s - 1) + 400 * s, Math.max(chart.maxWidth / 2 * (1 - s) - 400 * s, t[0]));
                            t[1] = Math.min(chart.maxHeight / 2 * (s - 1) + 250 * s, Math.max(chart.maxHeight / 2 * (1 - s) - 250 * s, t[1]));

                            mapZoom.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")" + " scale(" + s + ")")
                        }))
                })
                                
                usChart.controlsUseVisibility(true)

                //Download Raw Data button
                d3.select('#download')
                .on('click', ()=>{
                    var data = this.downloadDim.top(Infinity);
                    var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});

                    var myFilters = '';
                    dc.chartRegistry.list().forEach((d)=>{
                        if (d.filters()[0])
                            myFilters += ' (' + d.filters() + ')'
                    })

                    FileSaver.saveAs(blob, 'PERSTAT Officer_Promotion' + ' ' + store.state.asDate + myFilters + ' .csv');
                });

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

<style src="@/../node_modules/dc/dc.css">
</style>
<style>  /*should be scoped*/
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
