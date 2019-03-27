<template>
    <div class="container-fluid">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
                    <div id="radioSelect" class="col form-group" data-step="1" data-intro="Toggle the radio buttons to change the data element being shown in the charts.">
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio" type="radio" id="radio1" value="percent" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio1">
                                Promotion Rate
                            </label>
                        </div>
                    </div>
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
                                data-step="8" data-intro="See the currently applied filters here!"
                                title="Filter">
                        <p class="d-none d-md-inline">Filter&nbsp;&nbsp;</p>  
                        <FontAwesomeIcon icon="filter" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button>  -->
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect"
                                data-step="7" data-intro="Download data in tabular form here!"
                                title="Download Raw Data">
                        <p class="d-none d-md-inline">Download&nbsp;&nbsp;</p>
                        <FontAwesomeIcon icon="download" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button>
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect"
                                data-step="5" data-intro="Click here to reset filters on all charts." 
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
                <div class="row" data-step="2" data-intro="Summary statistics for the data elements are shown here. These numbers change as filters are applied.">
                    <div class="col-auto">
                        Selects:        
                        <span id="Selects"></span>
                    </div>
                    <div class="col-auto">
                        Eligibles: 
                        <span id="Eligible"></span>
                    </div>
                    <div class="col-auto">
                        Promotion Rate: 
                        <span id="SelectsRate"></span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div id="grade" class="col-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                <div id="dc-grade-rowchart" data-step="3" data-intro="Clicking the bars applies filters to the chart. Click on one of the bars and watch the other charts update!">
                                    <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-grade-rowchart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                            <div id="look" class="col-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                <div id="dc-look-rowchart">
                                    <h3>Look <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-look-rowchart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                            <div id="recommend" class="col-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
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
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="row">
                            <template class="AFSC-SECTION col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">

                                <div v-if="!startAfsc" class="col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12"> 
                                    <h3>
                                        AFSC 
                                        <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}  </span>
                                        <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="visibility: hidden"
                                            >Reset</button>
                                    </h3>
                                </div>
                               
                                <div v-else class="col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                     
                                    <afsc 
                                        v-model="sa"
                                        :ndx="ndx"
                                        :ylabel="ylabel"
                                        :selected="selected"
                                        :reduceAdd = "promoAdd"
                                        :reduceRemove = "promoRemove"
                                        :reduceInitial = "promoInitial"
                                        dataVar="ACA43"
                                        :minHeight="200"
                                        :aspectRatio="3"
                                    >
                                    </afsc>
                                    
                                </div>
                               
                            </template>
                            <div id="us" class="col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div id="dc-us-geoChoroplethChart" class="center-block clearfix" data-step="3" data-intro="You can mouse over a state or territory on the maps to see the personnel total or click on it to apply filters and update the other charts!">
                                    <h3>US Map <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                        class="btn btn-danger btn-sm btn-rounded reset" 
                                        style="visibility: hidden"
                                        @click="resetChart('dc-us-geoChoroplethChart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
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
import Afsc from '@/components/afsc'
import { store } from '@/store/store'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

    export default {
        data() {
            return {
                data: [],
                selected: "percent",
                startAfsc: false,
                sa: '',
                loaded: false,
                chartSpecs: chartSpecs,
                boardColor: chartSpecs.boardChart.color
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
            else if (this.selected === "Selects") {
                return "Selects"
            }
            else if (this.selected === "Eligible") {
                return "Eligibles"
            }
            else {
                return "PME Complete Rate (%)"
            }
          }

        },
        methods: {
            resetAll: (event)=>{
              store.state.resetAfsc = true;
              dc.filterAll()
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
            //reduce functions
            promoAdd: (p,v) => {
                p.Eligible += +v.Eligible
                p.Selects += +v.Selects
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent = p.Selects/p.Eligible === Infinity ? 0 : Math.round((p.Selects/p.Eligible)*1000)/10 || 0
                return p
            },
            promoRemove: (p,v) => {
                p.Eligible -= +v.Eligible
                p.Selects -= +v.Selects
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent = p.Selects/p.Eligible === Infinity ? 0 : Math.round((p.Selects/p.Eligible)*1000)/10 || 0
                return p
            },
            promoInitial: () => {
                return {
                    Eligible: 0,
                    Selects: 0,
                    percent: 0,
                }
            }
        },
        components: {
            'autocomplete': AutoComplete,
            'loader': Loader,
            'afsc': Afsc,
            FontAwesomeIcon
        },
        created: function(){
          console.log('created')
        },
        mounted() {
            console.log('mounted')
            
            //TEST AXIOS CALL:
            axios.post(axios_url_enl_promo_ang).then(response => {
                store.state.asDate = response.data.ASOFDATE //TODO: properly set with mutation
                var promoData = response.data.data
                //console.log(promoData);
                var objData = makeObject(promoData)
                //console.log(objData);
                this.data = objData
                this.loaded = true
                this.startAfsc = true
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

                obj.Grade = formats.gradeFormat[given.board.substring(6,8)]
                obj.Look = given.look.trim()
                obj.Recommendation = formats.enlRecommendFormat[given.Prom_rec]
                obj.Board = given.board
                obj.ACA43 = given.ACA43
                obj.state = given.ANG_STATE  
                obj.Eligible = +given.Eligible
                obj.Selects = +given.Selects
                obj.Promotion_Rate = obj.Selects/obj.Eligible === Infinity ? 0 : Math.round((obj.Selects/obj.Eligible)*1000)/10 || 0
//console.log("state=" + given.ANG_State)
                return obj;
            }

            // var testData = (formatted, original) =>{
            //     for (var key in formatted) {
            //         if (formatted[key] === undefined){
            //             console.log('Empty Value of ' + key)
            //             console.log(original)
            //             formatted[key] = "UNKNOWN"
            //         }
            //     }
            //     return formatted;
            // }

            var renderCharts = () => {
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //reduce functions
                function promoAdd(p,v) {
                    p.Eligible += +v.Eligible
                    p.Selects += +v.Selects
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.Selects/p.Eligible === Infinity ? 0 : Math.round((p.Selects/p.Eligible)*1000)/10 || 0
                    return p
                }
                function promoRemove(p,v) {
                    p.Eligible -= +v.Eligible
                    p.Selects -= +v.Selects
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.Selects/p.Eligible === Infinity ? 0 : Math.round((p.Selects/p.Eligible)*1000)/10 || 0
                    return p
                }
                function promoInitial() {
                    return {
                        Eligible: 0,
                        Selects: 0,
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

                //Number Display for Selects, Eligible, Selects rate - show total for filtered content
                var numberGroup = this.ndx.groupAll().reduce(promoAdd, promoRemove, promoInitial)
                var SelectsND = dc.numberDisplay("#Selects")
                SelectsND.group(numberGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d.Selects;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var EligibleND = dc.numberDisplay("#Eligible")
                EligibleND.group(numberGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.Eligible;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var SelectsRateND = dc.numberDisplay("#SelectsRate")
                SelectsRateND.group(numberGroup)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.percent;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })

            //board, aca43, look, prom_rec, eligible, selects, select_rate, 
                    
                //grade
                var gradeConfig = {};
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return d.Grade
                })
                gradeConfig.group = gradeConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                gradeConfig.minHeight = 240 
                gradeConfig.aspectRatio = 2
                gradeConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                gradeConfig.colors = this.chartSpecs.gradeChartColorScale 
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                gradeChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .colorAccessor((d) => {
                        return d.key;
                    })
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })                                    

                //look
                var lookConfig = {};
                lookConfig.id = 'look'
                lookConfig.dim = this.ndx.dimension(function (d) {
                    return d.Look;
                })
                lookConfig.group = lookConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                lookConfig.minHeight = 150 
                lookConfig.aspectRatio = 2
                lookConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                lookConfig.colors = d3.scale.category10().domain([100,0])
                var lookChart = dchelpers.getRowChart(lookConfig)
                lookChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })

                //recommend
                var recommendConfig = {};
                recommendConfig.id = 'recommend'
                recommendConfig.dim = this.ndx.dimension(function (d) {
                    return d.Recommendation;
                })
                recommendConfig.group = recommendConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                recommendConfig.minHeight = 185 
                recommendConfig.aspectRatio = 5
                recommendConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                recommendConfig.colors = d3.scale.ordinal().range(["#1a9850","#91cf60","#d9ef8b","#fee08b","#fc8d59","#d73027"])
                var recommendChart = dchelpers.getRowChart(recommendConfig)
                recommendChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d) {
                        return formats.enlRecommendOrder[d.key]
                    })

                //board
                 var boardConfig = {}
                boardConfig.id = 'board'
                boardConfig.dim = this.ndx.dimension(function(d){ return d.Board })
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
                        return formats.gradeOrder[d.key.substring(0,3)] + d.key.substring(3,7)
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-board-barchart')
                        })
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
                    var data = boardConfig.dim.top(Infinity);
                    var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});

                    var myFilters = '';
                    dc.chartRegistry.list().forEach((d)=>{
                        console.log(d.anchorName().toUpperCase())
                        if (_.includes(d.anchorName().toUpperCase(),'AFSC')){
                            //console.log('AFSC Filter: ' + this.sa)
                            if (_.includes(d.anchorName().toUpperCase(),'ROW') && this.sa){
                                if (this.sa.length < 6){
                                    var num = 6 - this.sa.length;
                                    var txt = Array(num).join("X")
                                    myFilters += ' (AFSC_' + this.sa + txt + ')'
                                }   else myFilters += ' (' + this.sa + ')'
                            }
                        }else if (d.filters()[0])
                            myFilters += ' (' + d.filters() + ')'
                    })

                    FileSaver.saveAs(blob, 'PERSTAT Enlisted_Promotion' + ' ' + store.state.asDate + myFilters + '.csv');
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

<style src="../../../node_modules/toastr/build/toastr.css"/>
<style src="../../../node_modules/dc/dc.css"/>
<style>
#afscGroup, #us {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
#us svg {
    background-color: darkGray !important;
}
#us svg g.state path {
  stroke:#555;
}
#us svg g.state:hover path {
  fill: orange;
  stroke:#ccc;
}
#us svg g.state.selected path {
  stroke: orange;
  stroke-width: 1px;
}
</style>
<style scoped>
.axis line,
.axis path {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}
.axis text {
    font-family: sans-serif; 
    font-size: 11px;
    transform: translate(-18,0) rotate(45deg);
}
rect:hover {
    cursor: pointer;
    opacity: 0.5;
}
</style>
<style scoped>
#base >>> text{
    font: 8px sans-serif;
}

text.baseText{
    font: 8px sans-serif;
}
.custom-control.custom-radio{
    padding-left:20px;
    padding-right:10px;
    margin-right: 0;
    cursor:pointer;
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
