
<template>
    <div class="container-fluid"> 
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
                    <div id="radioSelect" class="col" data-step="1" data-intro="Toggle the radio buttons to change the data element being shown in the charts.">
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio" type="radio" id="radio1" value="reEnlRate" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio1">
                                Reenlistment Rate 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio2" type="radio" id="radio2" value="keepRate" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio2">
                                Keep Rate 
                            </label>
                        </div>
                    </div>
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
                <div class="row" data-step="2" data-intro="Summary statistics for the data elements are shown here. These numbers change as filters are applied.">
                    <div class="col-auto">
                        Inventory:
                        <span id="inv"></span>
                    </div>
                    <div class="col-auto">
                        Eligible:
                        <span id="elig"></span>
                    </div>
                    <div class="col-auto">
                        Keep:
                        <span id="keep"></span>
                    </div>
                    <div class="col-auto">
                        Re-Enlist Rate:
                        <span id="reEnlRate"></span>
                    </div>
                    <div class="col-auto">
                        Keep Rate:
                        <span id="keepRate"></span>
                    <span class="h3 mt-0 pt-0 align-middle">
                        <span class="ico-tooltip"
                            data-toggle="tooltip" 
                            title="This is the percentage of people who reenlisted out of those who are eligible to reenlist or separate within the term.">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="25px" style="vertical-align:top; margin-top:2px;" viewBox="0 0 512 512">
                            <path d="M256,0C114.613,0,0,114.617,0,256c0,141.391,114.613,256,256,256s256-114.609,256-256C512,114.617,397.387,0,256,0z   M256,128c17.674,0,32,14.328,32,32c0,17.68-14.326,32-32,32s-32-14.32-32-32C224,142.328,238.326,128,256,128z M304,384h-96  c-8.836,0-16-7.156-16-16c0-8.836,7.164-16,16-16h16v-96h-16c-8.836,0-16-7.156-16-16c0-8.836,7.164-16,16-16h64  c8.836,0,16,7.164,16,16v112h16c8.836,0,16,7.164,16,16C320,376.844,312.836,384,304,384z"></path>
                        </svg>
                        </span>
                    </span>
                       <!-- <span data-toggle="tooltip" 
                          data-placement="bottom"
                          title="This is the percentage of people who reenlisted out of those who are eligible to reenlist or separate within the term.">
                        <fontAwesomeIcon icon="info-circle" 
                                         size="sm"
                                         >
                        </fontAwesomeIcon>
                    </span> -->

                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="row">
                            <div id="year" class="col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div id="dc-year-rowchart">
                                    <h3>Year<span style="font-size: 14pt; opacity: 0.87;"> &nbsp {{ylabel}}</span>
                                    </h3>
                                </div>
                            </div>
                            <div v-show="true" id="cat" class="col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div id="dc-cat-rowchart" data-step="3" data-intro="Clicking the bars applies filters to the chart. Click on one of the bars and watch the other charts update!">
                                    <h3>Category <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}</span>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <template class="AFSC-SECTION">
                        <div  v-if="!startAfsc" class="col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12"> 
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
                                :reduceAdd = "retentionAdd"
                                :reduceRemove = "retentionRemove"
                                :reduceInitial = "retentionInitial"
                                dataVar="AFSC"
                                removeBin = "inv"
                                :minHeight = "250"
                                :aspectRatio = "2.5"
                            >
                            </afsc>
                        </div>
                        <div id="us" class="col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div id="dc-us-geoChoroplethChart" class="center-block clearfix" data-step="4" data-intro="You can mouse over a state or territory on the maps to see the personnel total or click on it to apply filters and update the other charts!">
                                <h3>US Map <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-us-geoChoroplethChart')">Reset</button>
                                </h3>
                            </div>
                        </div>
                    </template>
                </div>
 
                <overviewBarChart :id="'mpf'"
                                  :dimension="mpfDim"
                                  :aspectRatio="3.8"
                                  :minHeight="240"
                                  :normalToOverviewFactor="2.5"
                                  :selected="selected"
                                  :ylabel="ylabel"
                                  :reducerAdd="retentionAdd"
                                  :reducerRemove="retentionRemove"
                                  :accumulator="retentionInitial"
                                  :numBars="15"
                                  :margin="chartSpecs.baseChart.margins"
                                  :colorScale="baseColorScale"
                                  :title="'Servicing MPF'"
                                    :loaded="loaded">
                </overviewBarChart>

            </div>
         </transition-group>
    </div>
</template>

<script>
    import dchelpers from '@/dchelpers'
    import chartSpecs from '@/chartSpecs'
    import axios from 'axios'
    import formats from '@/store/format'
    import afsc from '@/components/afsc'
    import { store } from '@/store/store'
    import Loader from '@/components/Loader'
    import searchBox from '@/components/searchBox'
    import fontAwesomeIcon from '@fortawesome/vue-fontawesome' 
    import overviewBarChart from '@/components/overviewBarChart'
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

    export default {
        data() {
            return {
                data: [],
                selected:'reEnlRate',
                searchBase: "",
                sa: "",
                startAfsc:false,
                loaded: false,
                chartSpecs: chartSpecs,
                asDate: 'Undetermined',
                baseColorScale: d3.scale.ordinal().range([chartSpecs.baseChart.color]),                
                category: '1ST TERM',
                year: '2018'
            }
        },
        components:{
            'afsc': afsc,
            'loader': Loader,
            'searchBox': searchBox,
            fontAwesomeIcon,   
            overviewBarChart,

        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
          ylabel: function() {
            if (this.selected === "inv") {
                return "Inventory"
            }
            else if (this.selected === "elig") {
                return "Eligible"
            }
            else if (this.selected === "keep") {
                return "Keep"
            }
            else if (this.selected === "reEnlRate") {
                return "Reenlist Rate(%)"
            }
            else {
                return "Keep Rate(%)"
            }
          },
          downloadDim: function() {
            return this.ndx.dimension(function(d) {return d;});    
          },      
          mpfDim: function() {
            return this.ndx.dimension(function(d) {return d.MPF;});
          },
          mpfGroup: function() {
            return this.mpfDim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial);
          }

        },
        methods: {
          resetAll(){
            this.category = '1ST TERM';
            this.selected = 'reEnlRate';
            this.year = '2018'
            store.state.resetAfsc = true;
            dc.filterAll();
            this.singleSubmit('2018', 'dc-year-rowchart')
            this.singleSubmit('1ST TERM', 'dc-cat-rowchart')
          },
          startDemo: function() {
            introJs().start()
          },
          resetChart: function(id) {
            dc.chartRegistry.list().filter(chart=>{
              return chart.anchorName().indexOf(id) !== -1
            }).forEach(chart=>{
              chart.filterAll()
            })
            dc.redrawAll()
          },
          resetChartSingle: function(id) {
              dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName().indexOf(id) !== -1
              }).forEach(chart=>{
                  chart.filterAll()
                  if (_.includes(id,'year')) {
                    this.singleSubmit('2018', id)
                  } else {
                    this.singleSubmit('1ST TERM', id)
                  }
              })
              dc.redrawAll();
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
          singleSubmit: (text,id) => {
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == id
            }).forEach(chart=>{
                chart.filterAll()
                chart.filter(text)
            })
            dc.redrawAll()
          },
          retentionAdd(p,v) {
            p.inv = p.inv + +v.Inventory
            p.elig = p.elig + +v.Eligible
            p.keep = p.keep + +v.Keep
            //if divide by 0, set to 0, and if NaN, set to zero
            p.keepRate = p.keep/p.inv === Infinity ? 0 : Math.round((p.keep/p.inv)*1000)/10 || 0
            p.reEnlRate = p.keep/p.elig === Infinity ? 0 : Math.round((p.keep/p.elig)*1000)/10 || 0
            return p
          },
          retentionRemove(p,v) {
            p.inv = p.inv - +v.Inventory
            p.elig = p.elig - +v.Eligible
            p.keep = p.keep - +v.Keep
            //if divide by 0, set to 0, and if NaN, set to zero
            p.keepRate = p.keep/p.inv === Infinity ? 0 : Math.round((p.keep/p.inv)*1000)/10 || 0
            p.reEnlRate = p.keep/p.elig === Infinity ? 0 : Math.round((p.keep/p.elig)*1000)/10 || 0
            return p
          },
          retentionInitial() {
            return {
                inv: 0,
                elig: 0,
                keep: 0,
                reEnlRate: 0,
                keepRate: 0,
            }
          },
          retentionAddLarge: function(p,v) {
              p.inv = p.inv + +v.inv
              p.elig = p.elig + +v.elig
              p.keep = p.keep + +v.keep
              //if divide by 0, set to 0, and if NaN, set to zero
              p.keepRate = p.keep/p.inv === Infinity ? 0 : Math.round((p.keep/p.inv)*1000)/10 || 0
              p.reEnlRate = p.keep/p.elig === Infinity ? 0 : Math.round((p.keep/p.elig)*1000)/10 || 0
              return p
          },

          removeEmptyBins:(source_group) => {
            return {
                all: () => {
                    return source_group.all().filter((d) => {
                        return d.value[this.selected] != 0
                    })
                }
            }
          }  
        },
        created: function(){
          console.log('created')
        },
        mounted() {
            console.log('mounted')
            //TEST AXIOS CALL:
            axios.post(axios_url_enl_ret_ang).then(response => {
                var axiosData = response.data.data
                //console.log(axiosData);
                store.state.asDate = response.data.ASOFDATE
                var objData = makeObject(axiosData)
                //console.log(objData);
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

                obj.AFSC = given.AFSC
                obj.MPF = formats.mpfFormat[given.MPF]
                obj.Year = "20" + given.FY
                obj.Category = formats.catFormat[given.CAT]
                obj.Inventory = given.INV
                obj.Eligible  = given.ELIG
                obj.state = given.ANG_STATE  
                obj.Keep = given.KEEP
                obj.Keep_Rate = obj.Keep/obj.Inventory === Infinity ? 0 : Math.round((obj.Keep/obj.Inventory)*1000)/10 || 0;
                obj.Reenlistment_Rate = obj.Keep/obj.Eligible === Infinity ? 0 : Math.round((obj.Keep/obj.Eligible)*1000)/10 || 0;

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

                //***Totals***
                var tots = this.ndx.groupAll().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial)
                //INV
                var invND = dc.numberDisplay("#inv")
                invND.group(tots)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d.inv;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                //ELIG
                var eligND = dc.numberDisplay("#elig")
                eligND.group(tots)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.elig;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                //KEEP
                var keepND = dc.numberDisplay("#keep")
                keepND.group(tots)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.keep;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                //Re-enlist Rate
                var reEnlRateND = dc.numberDisplay("#reEnlRate")
                reEnlRateND.group(tots)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.reEnlRate})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
                //Keep Rate
                var keepRateND = dc.numberDisplay("#keepRate")
                keepRateND.group(tots)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.keepRate})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
                
                //YEAR
                var yearConfig = {};
                yearConfig.id = 'year';
                yearConfig.dim = this.ndx.dimension(function (d) {
                    return d.Year;
                })
                yearConfig.group = yearConfig.dim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial)
                yearConfig.minHeight = 100
                yearConfig.aspectRatio = chartSpecs.baseChart.aspectRatio 
                yearConfig.margins = {top: 10, left: 45, right: 30, bottom: 30}
                yearConfig.colors = [chartSpecs.baseChart.color]
                var yearChart = dchelpers.getRowChart(yearConfig)
                yearChart
                    .elasticX(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected];
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll("rect").on("click", (d)=>{
                            this.year = d.key
                            this.singleSubmit(d.key, 'dc-year-rowchart')
                        });
                    })
                    .controlsUseVisibility(true);
                yearChart.filter('2018')

                //CAT
                var catConfig = {};
                catConfig.id = 'cat';
                catConfig.dim = this.ndx.dimension(function (d) {
                    return d.Category;
                })
                catConfig.group = catConfig.dim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial)
                catConfig.minHeight = 100 
                catConfig.aspectRatio = 3 
                catConfig.margins = {top: 10, left: 40, right: 20, bottom: 20}
                catConfig.colors = d3.scale.category10()
                var catChart = dchelpers.getRowChart(catConfig)
                catChart
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll("rect").on("click", (d)=>{
                            this.year = d.key
                            this.singleSubmit(d.key, 'dc-cat-rowchart')
                        });
                    })
                    .controlsUseVisibility(true);

                catChart.filter('1ST TERM')

                //Call The AFSC Component HERE
                this.startAfsc = true;

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
                usConfig.group = removeError(usConfig.dim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial))
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

                    FileSaver.saveAs(blob, 'PERSTAT Enlisted_Retention' + ' ' + store.state.asDate + myFilters + '.csv');
                });

                // after DOM updated redraw to make chart widths update
                this.$nextTick(() => {
                    dc.redrawAll()
                })

                //Resize
                var temp
                window.onresize = function(event) {
                    clearTimeout(temp)
                    temp = setTimeout(dc.redrawAll(), 500)
                }
                //create charts
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
        },
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
