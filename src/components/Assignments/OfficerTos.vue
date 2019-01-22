<template>
	<div class="container">
		<transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2">
                    <div class="col-auto pt-1">
                        Average TOS: 
                        <span id="average"></span>
                    </div>
                    <div class="col-auto pt-1">
                        Completed Tours:        
                        <span id="count"></span>
                        <span data-toggle="tooltip" 
                              data-placement="bottom"
                              class="pl-1"
                              title="Average TOS and Completed Tours are calculated by aggregating over a 4 year period.">
                            <fontAwesomeIcon icon="info-circle">
                            </fontAwesomeIcon>
                        </span>
                    </div>
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
            		<div id="tour" class="col-3">
		                <div id="dc-tour-rowchart">
		                    <h3>Tour <span style="font-size: 14pt; opacity: 0.87;">
		                    	Avg. TOS
		                    </span>
		                    <button type="button" 
		                            class="btn btn-danger btn-sm btn-rounded reset" 
		                            style="visibility: hidden"
		                            @click="resetChart('dc-tour-rowchart')">Reset</button>
		                    </h3>
                		</div>
            		</div>
		            <div id="type" class="col-3">
		                <div id="dc-type-rowchart">
		                    <h3>Type <span style="font-size: 14pt; opacity: 0.87;">
		                    	Avg. TOS
		                    </span>
		                    <button type="button" 
		                            class="btn btn-danger btn-sm btn-rounded reset" 
		                            style="visibility: hidden"
		                            @click="resetChart('dc-type-rowchart')">Reset</button>
		                    </h3>
                		</div>
            		</div>
            		<div id="grade" class="col-6">
                        <div id="dc-grade-barchart">
                            <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">Avg. TOS</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-grade-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
            	</div>
                 <div class="row">
                        <div id="base" class="col-12">
                                <div id="dc-base-select">
                                </div>
                                <h3>Installation <span style="font-size: 14pt; opacity: 0.87;">Avg. TOS </span>
                                <button type="button"
                                        id="btn-base-reset"
                                        class="btn btn-danger btn-sm btn-rounded reset" 
                                        style="visibility: hidden"
                                        @click="resetChart('dc-base-barchart');resetChart('dc-base-select')">Reset</button>
                                </h3>
                                <searchBox
                                    v-model="searchBase"
                                    size="3"
                                    label="Enter Installation"
                                    @sub="submit(searchBase,'dc-base-select')"
                                    button="true"
                                    :color="baseColor"
                                    :btnColor="baseColor"
                                ></searchBox>
                            <transition name="expand" key="1">
                            <div id="dc-base-barchart" v-show="loaded&&showBase">
                            </div>
                             </transition>
                        </div>
                </div>
                <div v-show="loaded&&!showBase" class="alert alert-warning alert-dismissible fade show" role="alert" key="first">
                    Please select from maps below to display Installation graph
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="cursor: pointer;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="row">
                    <div id="us" class="col-6">
                        <div id="dc-us-geoChoroplethChart">
                            <h3>CONUS Map <span style="font-size: 14pt; opacity: 0.87;">Avg. TOS</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-us-geoChoroplethChart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="jp" class="col-6">
                        <div id="dc-jp-geoChoroplethChart">
                            <h3>OCONUS Map <span style="font-size: 14pt; opacity: 0.87;">Avg. TOS</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-jp-geoChoroplethChart')">Reset</button>
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
import chartSpecs from '@/chartSpecs'
import formats from '@/store/format'
import AutoComplete from '@/components/AutoComplete'
import Loader from '@/components/Loader'
import { store } from '@/store/store'
import searchBox from '@/components/searchBox'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

	export default {
        data() {
            return {
                loaded: false,
                searchBase: '',
                baseColor: chartSpecs.baseChart.color,
                conusFiltered: false,
                oconusFiltered: false,
            }
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
          showBase: function() {
            return this.conusFiltered || this.oconusFiltered;
          },
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
        },
        components: {
            'autocomplete': AutoComplete,
            'loader': Loader,
            'fontAwesomeIcon': FontAwesomeIcon,
            searchBox
        },
        created: function(){
        	console.log('created')

        },
        mounted() {
            console.log('mounted')
            var postArray = []
            
            postArray.push(axios.post(axios_url_off_tos))
            postArray.push(axios.post(axios_url_enl_tos))
            
            Promise.all(postArray).then(payload => {
                //payload is an array of arrays
                var offData = payload[0].data.data
                var enlData = payload[1].data.data 
                var offDate = new Date(payload[0].data.ASOFDATE)
                var enlDate = new Date(payload[1].data.ASOFDATE)
                //take oldest date
                if (offDate < enlDate) {
                    store.state.asDate = payload[0].data.ASOFDATE 
                } else {
                    store.state.asDate = payload[1].data.ASOFDATE 
                }
                //remove keys (both are necessary to remove array of keys)
                var offKeys = offData.splice(0,1)[0]
                var enlKeys = enlData.splice(0,1)[0]
                //add type to keys
                offKeys.push('type')
                //add officer and enlisted fields
                offData.forEach((d,i) => {
                    offData[i].push('Officer');
                })
                enlData.forEach((d,i) => {
                    enlData[i].push('Enlisted');
                })
                var axiosData = offData.concat(enlData)
                var objData = makeObject(offKeys,axiosData)
                this.data = objData
                this.loaded = true
                renderCharts()
            }).catch(console.error)

            var makeObject = (keys,data) => {
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
                    var obj2 = {};
                    obj2 = formatData(obj)
                    // obj2 = testData(obj2, obj)
                    output.push(obj2);
                }
                return output;
            }

            var locFormat = {
                '1' : 'CONUS',
                '2' : 'OCONUS',
            }

            var locFormatOrder = {
                'CONUS' : 0,
                'OCONUS': 1,
            }

            var locStFormat = {
                'S' : 'OS SHORT',
                'L' : 'OS LONG',
                'C' : 'CONUS'
            }

            var locStFormatOrder = {
                'CONUS' : 0,
                'OS SHORT': 1,
                'OS LONG': 2,
            }

            var formatData = (given) =>{
                var obj = {}

                obj.MAJCOM_Assign_Type = locFormat[given.LOC]
                obj.Tour = locStFormat[given.LOC_ST]
                obj.Grade = formats.gradeFormat[given.grd]
                obj.Base = given.DLOC;
                obj.type = given.type;

                obj.State = ''
                obj.Country = ''

                if (given.CS.match(/^\d*$/) && given.CS != '02' && given.CS != '15' ){
                    if (formats.geoState[given.CS])
                        obj.State = formats.geoState[given.CS]
                }
                else {
                    if (formats.geoCSAb[given.CS])
                        obj.Country = formats.geoCSAb[given.CS]
                    else obj.Country = given.CS
                }

                obj.Total_Months = given.months
                obj.Inventory = given.cnt
                obj.Average_TOS = obj.Total_Months/obj.Inventory === Infinity ? 0 : obj.Total_Months/obj.Inventory || 0

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
                function tosAdd(p,v) {
                    p.months = p.months + +v.Total_Months
                    p.cnt = p.cnt + +v.Inventory
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.average = p.months/p.cnt === Infinity ? 0 : +((p.months/p.cnt).toFixed(2)) || 0
                    return p
                }

                function tosRemove(p,v) {
                    p.months = p.months - +v.Total_Months
                    p.cnt = p.cnt - +v.Inventory
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.average = p.months/p.cnt === Infinity ? 0 : +((p.months/p.cnt).toFixed(2)) || 0
                    return p
                }

                function tosInitial() {
                    return {
                        months: 0,
                        cnt: 0,
                        average: 0,
                    }
                }

                //remove empty function (es6 syntax to keep correct scope)
                var removeEmptyBins = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.value['average'] != 0
                            })
                        }
                    }
                }

                //Number Display for cnt
                var count = this.ndx.groupAll().reduceSum(function(d) { 
                	return +d.Inventory 
               	})
                var countND = dc.numberDisplay("#count")
                countND.group(count)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { 
                    	return d;
                    })
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                //Number Display for months
                var months = this.ndx.groupAll().reduceSum(function(d) { 
                	return +d.Total_Months 
               	})
                var monthsND = dc.numberDisplay("#months")
                monthsND.group(months)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { 
                    	return d;
                    })
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                //Number Display for AVERAGE
                var averageGroup = this.ndx.groupAll().reduce(tosAdd,tosRemove,tosInitial)
                var averagND = dc.numberDisplay("#average")
                averagND.group(averageGroup)
                    .formatNumber(d3.format(".2f"))
                    .valueAccessor(function(d) { return d.average})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number months</span>"
                })
          

                //Rowchart for type
                var typeConfig = {};
                typeConfig.id = 'type';
                typeConfig.dim = this.ndx.dimension(function (d) {
                    return d.type;
                })

                typeConfig.group = typeConfig.dim.group().reduce(tosAdd,tosRemove,tosInitial)
                typeConfig.minHeight = 200
                typeConfig.aspectRatio = 2.7
                typeConfig.margins = {top: 10, left: 10, right: 30, bottom: 20}
                typeConfig.colors = d3.scale.category10()

                var typeChart = dchelpers.getRowChart(typeConfig)

                typeChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d)=> {
                        return d.value.average;
                    })

                //Rowchart for tour
                var tourConfig = {};
                tourConfig.id = 'tour';
                tourConfig.dim = this.ndx.dimension(function (d) {
                    return d.Tour;
                })

                tourConfig.group = tourConfig.dim.group().reduce(tosAdd,tosRemove,tosInitial)
                tourConfig.minHeight = 200 
                tourConfig.aspectRatio = 2.6
                tourConfig.margins = {top: 10, left: 10, right: 30, bottom: 20}
                tourConfig.colors = d3.scale.category10()


                var tourChart = dchelpers.getRowChart(tourConfig)

                tourChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d)=> {
                        return d.value.average;
                    })
                    .ordering(function(d){
                      return locStFormatOrder[d.key]
                    })        

                //Grade
                var gradeConfig = {}
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function(d){
                    return d.Grade;
                })
                gradeConfig.group = removeEmptyBins(gradeConfig.dim.group().reduce(tosAdd, tosRemove, tosInitial))
                gradeConfig.minHeight = 230
                gradeConfig.aspectRatio = 3
                gradeConfig.margins = {top: 10, left: 30, right: 10, bottom: 55}
                gradeConfig.colors = chartSpecs.gradeChartColorScale
                var c = d3.rgb(51,172,255)
                var gradeChart = dchelpers.getOrdinalBarChart(gradeConfig)

                gradeChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value.average
                    })
                    .elasticX(true)
                    .colorAccessor(function(d){
                        return d.key;
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
	                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    }) 

                //base(mpf)
                var baseSelDim = this.ndx.dimension((d)=>{return d.Base});
                //console.log(afscDim.group().top(Infinity))
                var baseSelGrp = removeEmptyBins(baseSelDim.group().reduceSum(function(d) { return +d.Inventory }));
                var baseSelect = dc.selectMenu('#dc-base-select')
                baseSelect
                    .dimension(baseSelDim)
                    .group(baseSelGrp)       
                    .numberVisible(10)
                    .controlsUseVisibility(true);

                var baseConfig = {}
                baseConfig.id = 'base'
                baseConfig.dim = this.ndx.dimension(function(d){return d.Base});
                var basePercent = baseConfig.dim.group().reduce(tosAdd, tosRemove, tosInitial)
                baseConfig.group = removeEmptyBins(basePercent)
                baseConfig.minHeight = chartSpecs.baseChart.minHeight
                baseConfig.aspectRatio = chartSpecs.baseChart.aspectRatio 
                baseConfig.margins = chartSpecs.baseChart.margins 
                baseConfig.colors = [chartSpecs.baseChart.color]
                var baseChart = dchelpers.getOrdinalBarChart(baseConfig)
                baseChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value.average
                    })
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g')
                             .attr('opacity','0');
                        if (this.showBase) {
                            chart.selectAll('g')
                                 .attr('opacity','1');
                        } else {
                            chart.selectAll('g')
                                 .attr('opacity','0');
                        }
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-base-barchart')
                        })
                    })
                baseChart.turnOnControls = function() {
                    d3.select('#btn-base-reset').style('visibility','visible');
                }
                baseChart.turnOffControls = function() {
                    d3.select('#btn-base-reset').style('visibility','hidden');
                }

                //Number Display for Auth, Asgn, STP - show total for filtered content
                var inv = this.ndx.groupAll().reduceSum(function(d) { return +d.Inventory })
                var invND = dc.numberDisplay("#inv")
                invND.group(inv)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                //CONUS 
                var usConfig = {}
                usConfig.id = 'us';
                usConfig.dim = this.ndx.dimension(function(d){
                    return d.State;
                })
                usConfig.group = usConfig.dim.group().reduce(tosAdd, tosRemove, tosInitial)
                usConfig.scale = 1
                usConfig.minHeight = 200
                usConfig.aspectRatio = 2
                usConfig.xRatio = 2.0
                usConfig.yRatio = 2.0 
                usConfig.colors = d3.scale.quantize().range(["#E2F2FF","#d4eafc","#C4E4FF","#badefc","#a6d4fc","#9ED2FF","#81C5FF","#75bfff","#6BBAFF","#51AEFF","#40a4f9","#36A2FF","#2798f9","#1E96FF","#0089FF","#0061B5"])
                usConfig.valueAccessor = function(d) {
                    if (d) {
                        return d.value;
                    }
                }
                usConfig.colorAccessor = function(d) {
                    if (d) {
                        return d.average;
                    } else {
                        return 0;
                    }
                } 
                var statesJson = require('../../assets/geo.json')
                usConfig.json = statesJson
                usConfig.geoName = "state"
                usConfig.propName = 'name'
                usConfig.projection = d3.geo.albersUsa()

                var usChart = dchelpers.getGeoChart(usConfig)
                // usChart.controlsUseVisibility(true)
                usChart.controlsUseVisibility(true)
                       .on('filtered',(chart,filter) => {
                           //exit on reset, but if normal filter and territory chart has filters, then
                           //reset filters on territory chart
                           if (filter === null) {
                              return;
                           }
                           else if (jpChart.filters().length != 0) {
                              jpChart.filterAll()
                           }
                       })

                usChart.title(function(d) {
                    var myCount = 0;
                    var myAverage = 0;
                    if (d.value){
                        myCount = d.value.cnt;
                        myAverage = d.value.average;
                    }
                    return formats.geoCS[formats.stateFormat[d.key]] + "\n Average TOS: " + myAverage + " months" + "\n Completed Tours: " + myCount ;
                });
                // usChart.on('filtered',(chart) => {
                //     if (chart.hasFilter()) {
                //         this.conusFiltered = true
                //     } else {
                //         this.conusFiltered = false
                //     }
                // })

                usChart.on('pretransition', (chart)=> {
                    // set viewport for svg
                    chart.maxWidth = 950
                    chart.maxHeight = 450

                    var mapZoom = usChart.select('#dc-us-geoChoroplethChart svg .layer0')
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

                //oconus
                var jpConfig = {}
                jpConfig.id = 'jp';
                jpConfig.dim = this.ndx.dimension(function(d){
                    // Returns ##/ZZ array of Country identifiers from oconus.json via iso_a2 key below
                     return d.Country;
                })
                jpConfig.group = jpConfig.dim.group().reduce(tosAdd, tosRemove, tosInitial)
                jpConfig.scale = 2 
                jpConfig.minHeight = 200
                jpConfig.aspectRatio = 2 
                jpConfig.xRatio = 1.8 
                jpConfig.yRatio = 2 

                jpConfig.colors = d3.scale.quantize().range(["#E2F2FF","#d4eafc","#C4E4FF","#badefc","#a6d4fc","#9ED2FF","#81C5FF","#75bfff","#6BBAFF","#51AEFF","#40a4f9","#36A2FF","#2798f9","#1E96FF","#0089FF","#0061B5"])
                jpConfig.valueAccessor = function(d) {
                    if (d) {
                        return d.value;
                    }
                }
                jpConfig.colorAccessor = function(d) {
                    if (d) {
                        return d.average;
                    } else {
                        return 0;
                    }
                }; 
            
                var jpJson = require('../../assets/oconus.json')
                jpConfig.json = jpJson
                jpConfig.geoName = "state"
                jpConfig.propName = "iso_a2"

                var center = d3.geo.centroid(jpConfig.json)
                center[1] -= 10
                jpConfig.projection = d3.geo.mercator().center(center)
        
                var jpChart = dchelpers.getGeoChart(jpConfig)
                jpChart.controlsUseVisibility(true)
                         .on('filtered',(chart,filter) => {
                             //exit on reset, but if normal filter and US chart has filters, then
                             //reset filters on US chart
                             if (filter === null) {
                                 return;
                             }
                             else if (usChart.filters().length != 0) {
                                 usChart.filterAll();
                             }
                         })
                         .title(function(d) {
                             var jpCount = 0;
                             var jpAverage = 0;
                             if (d.value){
                                 jpCount = d.value.cnt;
                                 jpAverage = d.value.average;                      
                             }
                             //return formats.("99":"FullName")[formats.("AA":"99")[d.key]] + " " + myCount ;
//                             return formats.geoCS[formats.stateFormat[d.key]] + ": " + myCount ;
                                return formats.countryLong[d.key] + "\n Average TOS: " + jpAverage + " months" + "\n Completed Tours: " + jpCount ;
                         });

                //jpChart.controlsUseVisibility(true)
                // jpChart.title(function(d) {
                //         var myCount = 0;
                //         var myAverage = 0;
                //         if (d.value){
                //             myCount = d.value.cnt;
                //             myAverage = d.value.average;
                //         }
                //         return formats.countryLong[d.key] + "\n Average TOS: " + myAverage + "\n Completed Tours: " + myCount ;
                //     });

                // jpChart.on('filtered',(chart) => {
                //     if (chart.hasFilter()) {
                //         this.oconusFiltered = true
                //     } else {
                //         this.oconusFiltered = false
                //     }
                // })

                jpChart.on('pretransition', (chart)=> {
                    var color = 'orange'
                    chart.select('svg').select(".divider").remove()
                    chart.select('#dc-jp-geoChoroplethChart svg .layer0').append('g').attr("class", "divider")
                    var divider = chart.select('.divider')
                    var dividerStroke = 3

                    //lines must meet; set variables to represent where lines meet
                    //point where all areas meet
                    var tripleJunctionX = 0.25 * jpConfig.width 
                    var tripleJunctionY = 0.1 * jpConfig.height
                    //intersection between pacific and alaska
                    var pacificAlaskaX = 0.14 * jpConfig.width
                    var pacificAlaskaY = 0.55 * jpConfig.height
                    //corner (90 deg) between alaska and europe
                    var europeAlaskaTopX = 0.432 * jpConfig.width
                    var europeAlaskaTopY = 0.28 * jpConfig.height
                    //corner (>90 deg) between alaska and europe
                    var europeAlaskaBotX = 0.43 * jpConfig.width
                    var europeAlaskaBotY = 0.62 * jpConfig.height
                    //end of line between alaska and europe
                    var europeAlaskaEndX = 0.6 * jpConfig.width
                    var europeAlaskaEndY = 0.8 * jpConfig.height
                    //top vertical (pacific-europe divider)
                    divider
                         .append("line")
                         .attr("x1", tripleJunctionX)
                         .attr("y1", 0)
                         .attr("x2", tripleJunctionX)
                         .attr("y2", tripleJunctionY)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color)
                         .attr("stroke-linecap", "round");

                    //top left diagonal (left of alaska; pacific-alaska divider)
                    divider
                         .append("line")
                         .attr("x1", tripleJunctionX)
                         .attr("y1", tripleJunctionY)
                         .attr("x2", pacificAlaskaX)
                         .attr("y2", pacificAlaskaY)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color)
                         .attr("stroke-linecap", "round");

                    //left horizontal (pacific-alaska divider)
                    divider
                         .append("line")
                         .attr("x1", 0)
                         .attr("y1", pacificAlaskaY)
                         .attr("x2", pacificAlaskaX)
                         .attr("y2", pacificAlaskaY)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color)
                         .attr("stroke-linecap", "round");   


                    //top right horizontal (top of alaska; alaska-europe divider)
                    divider
                         .append("line")
                         .attr("x1", tripleJunctionX)
                         .attr("y1", tripleJunctionY)
                         .attr("x2", europeAlaskaTopX)
                         .attr("y2", europeAlaskaTopY)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color)
                         .attr("stroke-linecap", "round");  

                    //right vertical (to the right of alaska; alaska-europe divider)
                    divider
                         .append("line")
                         .attr("x1", europeAlaskaTopX)
                         .attr("y1", europeAlaskaTopY)
                         .attr("x2", europeAlaskaBotX)
                         .attr("y2", europeAlaskaBotY)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color)
                         .attr("stroke-linecap", "round");  

                    //bottom right diagonal (slope ~= -1; alaska-europe divider)
                    divider
                         .append("line")
                         .attr("x1", europeAlaskaBotX)
                         .attr("y1", europeAlaskaBotY)
                         .attr("x2", europeAlaskaEndX)
                         .attr("y2", europeAlaskaEndY)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color)
                         .attr("stroke-linecap", "round");  


                    chart.select('svg').select(".textLabels").remove()
                    chart.select('#dc-jp-geoChoroplethChart svg .layer0').append('g').attr("class", "textLabels")
                    var textLabels = chart.select('.textLabels')
                    var textStroke = 0.5
                     textLabels
                        .append("text")
                        .attr("x", jpConfig.width * 0.05)
                        .attr("y", jpConfig.height * 0.05)
                        .attr("fill", color) 
                        .attr("font-weight", 'bold')  
                        .text('Pacific');

                    textLabels
                        .append("text")
                        .attr("x", jpConfig.width * 0.05)
                        .attr("y", jpConfig.height * 0.8)
                        .attr("fill", color) 
                        .attr("font-weight", 'bold') 
                        .text('Alaska & Hawaii');

                    textLabels
                        .append("text")
                        .attr("x", jpConfig.width * 0.7)
                        .attr("y", jpConfig.height * 0.8)
                        .attr("fill", color) 
                        .attr("font-weight", 'bold') 
                        .text('Europe');
                
                    // set viewport for svg
                    chart.maxWidth = 950
                    chart.maxHeight = 450

                    var mapZoom = jpChart.select('svg .layer0')
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

                 //Download Raw Data button
                d3.select('#download')
                .on('click', ()=>{
                    var data = tourConfig.dim.top(Infinity);
                    console.log(data)
                    data.forEach(d=>{
                        if (d.Country=="02"){
                            d.Country='';
                            d.State='AK';
                        }
                        if (d.Country=="15"){
                            d.Country='';
                            d.State='HI';
                        }

                        if (d.State)
                            d.Country_State= formats.stateLong[d.State].toUpperCase();
                        else if (d.Country)
                            d.Country_State= formats.countryLong[d.Country].toUpperCase();
                        else d.Country_State = ''

                        delete d.State;
                        delete d.Country;  
                    })
                    var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});

                    var myFilters = '';
                    dc.chartRegistry.list().forEach((d)=>{
                        if (d.filters()[0])
                            myFilters += ' (' + d.filters() + ')'
                    })

                    FileSaver.saveAs(blob, 'PERSTAT Officer_Average_TOS' + ' ' + store.state.asDate + myFilters + ' .csv');
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
            $(function() {
                $('[data-toggle="tooltip"]').tooltip()
            })
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

<style src="../../../node_modules/dc/dc.css">
</style>

<style scoped>
    #base >>> text{
        font: 8px sans-serif;
    }

    #dc-base-select >>> .dc-select-menu{
        display:none;
    }

    .disabled{
        fill:white;
    }
	.expand-enter-active {
      transition: all 0.8s ease;
      max-height: 300px;
      overflow: hidden;
    }

    .expand-leave-active {
      transition: all 0.4s ease;
      max-height: 300px;
      overflow: hidden;
    }

    .expand-enter, .expand-leave-to {
      max-height: 0;
      opacity: 0;
    }

    .fade-enter-active {
        transition: all 0.5s; }
    .fade-leave-active {
        transition: all 0.2s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    .fade-enter-to, .fade-leave {
        opacity: 1;
    }

    .dc-chart >>> g.state >>> path {
        fill: #ededed;
    }
</style>
