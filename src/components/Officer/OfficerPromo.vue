<template>
    <div class="container">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
                    <div class="col"></div>
                    <div class="col-auto">
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect" 
                                >Download Raw Data</button>
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
                <div v-show='showAlert' class="alert alert-warning alert-dismissible fade show" role="alert" key="first">
                    Data prefiltered to IPZ Zone Promotion Rate
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="cursor: pointer;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="row">
                    <div id="grade" class="col-4">
                        <div id="dc-grade-rowchart">
                            <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <!--<font-awesome-icon icon="info-circle" data-toggle="tooltip" data-placement="bottom" title="Competitive Category" style="display: inline-block;"></font-awesome-icon>-->
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
                <div class ="row">
                    <div id="core-chart-wrapper" class="col-12">
                        <div id ="core-title" class="row">
                            <h3 class="col-12">Core <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
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

    export default {
        data() {
            return {
                data: [],
                selected: "percent",
                loaded: false,
                showAlert: true,
                width: document.documentElement.clientWidth
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
            'loader': Loader,
            FontAwesomeIcon
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')

            
            //TEST AXIOS CALL:
            axios.post(axios_url_off_pro).then(response => {
                store.state.asDate = response.data.ASOFDATE
                var promoData = response.data.data
                var formattedData = []
                var obj = {}
                promoData.forEach((d)=>{
                    obj = formatData(d)
                    formattedData.push(obj)
                })
                //console.log(formattedData   )
                this.data = formattedData
                this.loaded = true
                renderCharts()
            }).catch(console.error)

            var formatData = (given) =>{
                var obj = {}

                obj.Grade = formats.gradeFormat[given.Board_ID.substring(1,3)]
                obj.Competitive_Category = formats.compCatFormat[given.Compcat]
                obj.Zone = formats.zoneFormat[given.Zone]
                obj.Recomendation = formats.recommendFormat[given.Promo_Recomendation];
                obj.PME = formats.pmeFormat[given.PME_Complete]
                obj.Board = formats.gradeFormat[given.Board_ID.substring(1,3)] + "20" + given.Board_ID.substring(3,6)
                obj.Core = given.Core
                obj.Select = +given.num_select
                obj.Eligible = +given.num_eligible
                obj.Percent =  obj.Select/obj.Eligible === Infinity ? 0 : Math.round((obj.Select/obj.Eligible)*1000)/10 || 0;

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
                    p.elig = p.elig + +v.Eligible
                    p.sel = p.sel + +v.Select
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
                    return p
                }
                function promoRemove(p,v) {
                    p.elig = p.elig - +v.Eligible
                    p.sel = p.sel - +v.Select
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
                    return d.Competitive_Category;
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
                    .on('pretransition', (chart)=> {
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
                        .on('click', (d)=>{
                            this.submit(d, 'dc-compCat-barchart')
                        })
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})

                    
                    
                //grade
                var gradeConfig = {};
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return d.Grade;
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
                    return d.Zone;
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

                zoneChart.filter('IPZ')

                zoneChart.on("filtered", (d)=>{
                    this.showAlert = false;
                })
                //recommend
                var recommendConfig = {};
                recommendConfig.id = 'recommend'
                recommendConfig.dim = this.ndx.dimension(function (d) {
                    return d.Recomendation;
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
                    return d.PME;
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
                
                //board
                var boardConfig = {}
                boardConfig.id = 'board'
                boardConfig.dim = this.ndx.dimension(function(d){return  d.Board})
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
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-board-barchart')
                        })
                    })

                //make core bar chart
                var margin = chartSpecs.coreChart.margins 
                var w = document.documentElement.clientWidth*0.90 - margin.left - margin.right
                var h = Math.max(Math.round(w/chartSpecs.coreChart.aspectRatio) - margin.top - margin.bottom, chartSpecs.coreChart.minHeight - margin.top - margin.bottom)

                var key = function(d) {
                    return d.key;
                }

                console.log()
                var coreDim = this.ndx.dimension(function(d) {return d.Core;})
                var coreGroup = coreDim.group().reduce(promoAdd,promoRemove,promoInitial)
                var coreShow = removeEmptyBins(coreGroup).all()
                var minMax = d3.extent(coreShow, d => d.value[this.selected])
                var minVal = minMax[0]
                var maxVal = minMax[1]
                var xScale = d3.scale.ordinal()
                                .domain(coreShow.map(function(d) {return d.key}))
                                .rangeRoundBands([0,w],0.1);
                var yScale = d3.scale.linear()
                                .domain([0, maxVal])
                                .range([h,0])

                var xAxis = d3.svg.axis()
                                .scale(xScale)
                                .orient("bottom");
                var yAxis = d3.svg.axis()
                                .scale(yScale)
                                .orient("left")
                                .ticks(5);

                var vm = this
                var newChart = {}
                newChart.id = "core-chart"
                newChart.anchorName = function() {
                    return newChart.id
                }
                newChart.dimension = coreDim
                newChart.group = coreGroup
                newChart.colors = chartSpecs.coreChart.color
                newChart.lastBar = 30
                newChart.dataAll = function() {
                    return removeEmptyBins(coreGroup).all().sort((a,b) => b.value[vm.selected]-a.value[vm.selected]);
                }
                newChart.level = 0
                newChart.original = true
                newChart.direction = 'down'
                newChart.maxLevel = function() {
                    return Math.floor((newChart.dataAll().length-1)/newChart.lastBar);
                }
                newChart.xAxis = xAxis
                newChart.yAxis = yAxis
                newChart.filters = []
                newChart.filterAll = function(all){
                     //all is boolean. true for all, false for partial
                     var all = all == undefined ? true : all 
                     d3.select("#core-chart")
                        .selectAll("rect")
                        .attr("fill",newChart.colors)
                        .attr("opacity",1);
                    d3.select("#core-chart-reset")
                        .style("visibility",  all ? "hidden" : "visible");
                    d3.select("#core-up-level")
                        .style("visibility","hidden");
                    d3.select("#slider")
                        .property("disabled", !all)
                        .style('cursor',  all ? 'pointer' : "default")
                        .style('opacity', all ? 1 : 0.5);
                    newChart.filters = []
                    newChart.dimension.filterAll()
                    newChart.level = 0
                    newChart.original = true
                    dc.redrawAll()
                }
                newChart.updateData = function() {
                    newChart.data = newChart.dataAll().slice(newChart.lastBar*newChart.level,newChart.lastBar*(newChart.level+1))
                    newChart.nextData = newChart.dataAll().slice(newChart.lastBar*(newChart.level+1))
                    var othersObj = {key: "Others", value: {}}
                    othersObj.value.elig = d3.sum(newChart.nextData.map(d => d.value['elig']))
                    othersObj.value.sel = d3.sum(newChart.nextData.map(d => d.value['sel']))
                    othersObj.value.percent = othersObj.value.sel/othersObj.value.elig === Infinity ? 0 : Math.round((othersObj.value.sel/othersObj.value.elig)*1000)/10 || 0
                    newChart.data.push(othersObj)
                    newChart.data = newChart.data.filter(d => d.value[vm.selected] != 0)
                }
                newChart.nextLevel = function(d) {
                    if (d.key == "Others") {
                        //reset filters so we can apply new ones at next level 
                        newChart.filters = []
                        //make up buttom visibile
                        d3.select("#core-up-level")
                            .style("visibility","visible");
                        //apply filters for next level
                        newChart.filters = newChart.filters.concat(newChart.nextData.map(g=>g.key))
                        newChart.filters.push("Others")
                        newChart.level += 1
                        newChart.direction = 'down'
                        newChart.original = true //always at original filter when go to new lwevel
                        newChart.applyFilters()
                    }
                }
                newChart.updateFilters = function(d) {
                    if (newChart.original === true || (newChart.level == newChart.maxLevel() && newChart.data.every(d=> _.includes(newChart.filters, d.key)))) {
                        // if at original display for level, we have to reset all filters so the clicked bar can be filtered, also
                        // if at last level and all data elements are currently filtered, reset filters
                        newChart.filters = []    
                    }                         
                    //if clicked item filtered, remove filter
                    if (_.includes(newChart.filters, d.key)) {
                        if (d.key === "Others") {
                            newChart.filters = []
                        } else {
                            var index1 = newChart.filters.indexOf(d.key)
                            newChart.filters.splice(index1,1)
                        }
                        //don't set original here because we don't know if at original filters for level yet 
                    }
                    //if clicked item not filtered, add filter
                    else {
                        // if others is clicked, filter on all next data
                        if (d.key === "Others") {
                            newChart.filters = newChart.filters.concat(newChart.nextData.map(g=>g.key))
                            newChart.filters.push("Others")
                        } else {
                            newChart.filters.push(d.key)
                        }
                        newChart.original = false //not original filters for this level
                    }
                    //if no filters and top level, full reset chart
                    if (newChart.filters.length == 0 && newChart.level == 0) {
                        newChart.filterAll(true)
                    }
                    // if we have some filters or not at top level, apply the filters 
                    else {
                        //apply filters for current level if not top level
                        if (newChart.filters.length == 0 && newChart.level != 0) {
                            //only reset to current level, so add filters for current level and future levels 
                            newChart.filters = newChart.filters.concat(newChart.data.map(d => d.key).concat(newChart.nextData.map(g => g.key)))
                            newChart.original = true //original filters for this level
                        } 
                        console.log('filters at end:')
                        console.log(newChart.filters)
                        newChart.applyFilters()
                    }
                }
                newChart.applyFilters = function() {
                        d3.select("#core-chart-reset")
                          .style("visibility","visible");
                        d3.select("#slider")
                            .property("disabled",true)
                            .style("cursor","default")
                            .style("opacity", 0.5);
                        coreDim.filterFunction(d => _.includes(newChart.filters, d))
                        dc.redrawAll()
                }
                newChart.render = function() {
                    //clear any svg elements before rebuilding
                    d3.select("#core-svg").remove();
                    //set title
                    var btnUp = d3.select("#core-title")
                                    .selectAll("h3")
                                    .append("button")
                                    .attr("id","core-up-level")
                                    .text("Move Up")
                                    .classed("btn btn-success btn-sm",true)
                                    .style("visibility","hidden")
                                    .on("click", function() {
                                        newChart.level = Math.max(newChart.level-1, 0)
                                        newChart.direction = 'up'
                                        newChart.original = true //always at original filter when go to new level
                                        console.log('moved up')
                                        newChart.updateData()

                                        newChart.dimension.filterAll() //remove filters from dimension
                                        if (newChart.level == 0) {
                                            //if top level, always remove all filters, but if no extra data to add, do a full reset
                                            newChart.filterAll(true)
                                        }
                                        else {
                                            // reset filters and reapply for new level
                                            newChart.filters = [] 
                                            newChart.filters = newChart.filters.concat(newChart.data.map(d => d.key).concat(newChart.nextData.map(g => g.key)))
                                            coreDim.filterFunction(d => _.includes(newChart.filters, d))
                                        }
                                        console.log(newChart.filters)
                                        dc.redrawAll();
                                    })

                    var btnReset = d3.select("#core-title")
                                    .selectAll("h3")
                                    .append("button")
                                    .attr("id","core-chart-reset")
                                    .text("Reset")
                                    .classed("btn btn-danger btn-sm reset",true)
                                    .style("visibility","hidden")
                                    .on("click", function() {
                                        newChart.filterAll()
                                    });

                    var sliderContainer = d3.select("#core-title")
                                            .selectAll("h3")
                                            .append("div")
                                            .attr("id","slider-container")
                                            .style("display","inline-block");

                    sliderContainer.append("label")
                       .attr("id","slider-label")
                       .text("Number of bars: " + Number(newChart.lastBar + 1))
                       .style("font-size","12px");

                    sliderContainer.append("input")
                                   .attr("id", "slider")
                                   .attr("type","range")
                                   .classed("form-control",true)
                                   .attr("min",2)
                                   .attr("max",Math.min(newChart.dataAll().length,60))
                                   .attr("step",1)
                                   .attr("value",newChart.lastBar)
                                   .style('cursor','pointer')
                                   .on("input", function() {
                                        console.log('Moving Slider')
                                        console.log('Input Value: ' + this.value)
                                        newChart.lastBar = this.value
                                        d3.select('#slider-label')
                                          .text('Number of Bars: ' + Math.min(+this.value+1,Number(d3.select('#slider').attr('max'))));
                                        newChart.redraw() 
                                   })
                                   ;

                    var svg = d3.select("#core-chart-wrapper")
                                .append("svg")
                                .attr("id","core-svg")
                                .attr("width",w + margin.left + margin.right)
                                .attr("height",h + margin.top + margin.bottom)
                                .append("g")
                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                                
                    //create data first time before drawing bars
                    newChart.updateData()

                    var firstBars = svg.append("g")
                        .attr("id", "core-chart")
                        .attr("clip-path", "url(#core-chart-area)")
                        .selectAll("rect")
                        .data(newChart.data,key)
                        .enter()
                        .append("rect")
                        .attr("id", function(d) {
                            return d.key.replace(/[^a-z0-9]/gi,'');
                        })
                        .attr("x", function(d,i) {
                            return xScale(d.key)
                        })
                        .attr("y", function(d) {
                            console.log(d.value[vm.selected])
                            return yScale(d.value[vm.selected]);
                        })
                        .attr("width", xScale.rangeBand())
                        .attr("height", function(d) {
                            return h-yScale(d.value[vm.selected]);
                        })
                        .attr("fill", function(d) {
                            if (_.includes(newChart.filters, d.key)) {
                                return  newChart.colors;
                            } 
                            else if (newChart.filters.length == 0){
                                return  newChart.colors;
                            }
                            else {
                                return "gray";
                            }
                        }) 
                        .on("click", function(d) {
                            if (d3.event.ctrlKey) {
                                newChart.nextLevel(d);
                            } else {
                                newChart.updateFilters(d);
                            }
                        })
                        .append("title")
                        .text(function(d) {
                            return d.key + ': ' + d.value[vm.selected];
                        })
                        ;

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform","translate(0," + h + ")")
                        .call(xAxis)
                        .selectAll("text")
                        .style("text-anchor","end")
                        .attr("transform","translate(-8,3)rotate(-45)");

                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);

                    svg.append("clipPath")
                        .attr("id","core-chart-area")
                        .append("rect")
                        .attr("x",0)
                        .attr("y",0)
                        .attr("width",w)
                        .attr("height",h);

                    newChart.svg = svg
                }
                newChart.redraw = function() {
                    d3.select("#core-up-level")
                        .style("visibility", newChart.level <= 0 ? "hidden" : "visible");

                    var w = document.getElementById("core-chart-wrapper").offsetWidth - margin.left - margin.right 
                    var h = Math.max(Math.round(w/chartSpecs.coreChart.aspectRatio) - margin.top - margin.bottom, chartSpecs.coreChart.minHeight - margin.top - margin.bottom)

                    d3.select("#core-svg").attr("width",w + margin.left + margin.right)
                                .attr("height",h + margin.top + margin.bottom);

                    d3.select("#core-chart-area").selectAll("rect")
                                                   .attr("width",w)
                                                   .attr("height",h);

                    newChart.updateData()

                    //update number in slider to reflect length of data
                    d3.select('#slider-label')
                      .text('Number of Bars: ' + newChart.data.length);

                    var minMax = d3.extent(newChart.data, d=>d.value[vm.selected])
                    var minVal = minMax[0]
                    var maxVal = minMax[1]
                    xScale.domain(newChart.data.map(d => d.key))
                            .rangeRoundBands([0,w],0.1);
                    yScale.domain([0,maxVal])
                            .range([h,0]);

                    var bars = d3.select("#" + newChart.id).selectAll("rect")
                                .data(newChart.data,key);

                    //TODO: use cool enter transition when clicking others 
                    bars.enter()
                        .append("rect")
                        .attr("id", function(d) {
                            return d.key.replace(/[^a-z0-9]/gi,'');
                        })
                        .attr("x", newChart.direction === 'down' ? w : 0)
                        .attr("y", h)
                        .on("click", function(d) {
                            if (d3.event.ctrlKey) {
                                newChart.nextLevel(d);
                            } else {
                                newChart.updateFilters(d);
                            }
                        })
                        .append("title")
                        .text(function(d) {
                            return d.key + ': ' + d.value[vm.selected];
                        })
                        ;

                    bars.select("title")
                        .text(function(d) {
                            return d.key + ': ' + d.value[vm.selected];
                        });

                    bars.attr("fill", function(d) {
                            if (_.includes(newChart.filters, d.key)) {
                                return newChart.colors;
                            } 
                            else if (newChart.filters.length == 0){
                                return newChart.colors;
                            }
                            else {
                                return "gray";
                            }
                        }) 
                        .transition()
                        .duration(800)
                        .attr("x", function(d,i) {
                            return xScale(d.key);
                        })
                        .attr("width", xScale.rangeBand())
                        .attr("y", function(d) {
                            return yScale(d.value[vm.selected]);
                        })
                        .attr("height", function(d) {
                            return h-yScale(d.value[vm.selected]);
                        })
                        ;

                    bars.exit()
                        .transition()
                        .duration(800)
                        .attr("y", h)
                        .remove();


                    newChart.svg.select(".x.axis")
                                  .transition()
                                  .duration(800)
                                  .attr("transform","translate(0," + h + ")")
                                  .call(newChart.xAxis)
                                  .selectAll("text")
                                  .style("text-anchor","end")
                                  .attr("transform","translate(-8,3)rotate(-45)");

                    newChart.svg.select(".y.axis")
                                  .transition()
                                  .duration(800)
                                  .call(newChart.yAxis);
                }

                dc.chartRegistry.register(newChart)
                console.log(dc.chartRegistry.list())

                //Download Raw Data button
                d3.select('#download')
                .on('click', ()=>{
                    var data = occupGroupConfig.dim.top(Infinity);
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
