<template>
	<div class="container">
		<transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row">
                    <div class="col-auto">
                        Personnel:        
                        <span id="count"></span>
                    </div>
                    <div class="col-auto">
                        Total TOS: 
                        <span id="months"></span>
                    </div>
                    <div class="col-auto">
                        Average TOS: 
                        <span id="average"></span>
                    </div>
                    <div class="col"></div>
                    <div class="col-auto">
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect" 
                                @click="resetAll">Reset All</button>
                    </div>
                </div>
                <div class="row">
		            <div id="tour" class="col-4">
		                <div id="dc-tour-rowchart">
		                    <h3>Majcom Assign Type <span style="font-size: 14pt; opacity: 0.87;">
		                    	Average
		                    </span>
		                    <button type="button" 
		                            class="btn btn-danger btn-sm btn-rounded reset" 
		                            style="display: none"
		                            @click="resetChart('dc-tour-rowchart')">Reset</button>
		                    </h3>
                		</div>
            		</div>
            		<div id="tour_st" class="col-3">
		                <div id="dc-tour_st-rowchart">
		                    <h3>Tour <span style="font-size: 14pt; opacity: 0.87;">
		                    	Average
		                    </span>
		                    <button type="button" 
		                            class="btn btn-danger btn-sm btn-rounded reset" 
		                            style="display: none"
		                            @click="resetChart('dc-tour_st-rowchart')">Reset</button>
		                    </h3>
                		</div>
            		</div>
            		<div id="grade" class="col-5">
                        <div id="dc-grade-barchart">
                            <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">Count</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-grade-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
            	</div>
                <div class="row">
                        <div id="base" class="col-12">
                                <div id="dc-base-select">
                                </div>
                                <h3>Base <span style="font-size: 14pt; opacity: 0.87;">Count </span>
                                <button v-if="baseHasFilter" type="button"
                                        class="btn btn-danger btn-sm btn-rounded reset" 
                                        @click="resetChart('dc-base-barchart');resetChart('dc-base-select')">Reset</button>
                                </h3>
                                <searchBox
                                    v-model:value="searchBase"
                                    size="3"
                                    label="Search Installation"
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
                <div class="row">
                    <div id="us" class="col-6">
                        <div id="dc-us-geoChoroplethChart">
                            <h3>CONUS Map <span style="font-size: 14pt; opacity: 0.87;">Count</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-us-geoChoroplethChart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="jp" class="col-6">
                        <div id="dc-jp-geoChoroplethChart">
                            <h3>OCONUS Map <span style="font-size: 14pt; opacity: 0.87;">Count</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
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

	export default {
        data() {
            return {
                loaded: false,
                searchBase: '',
                baseColor: chartSpecs.baseChart.color,
                baseLen: 0,
                baseHasFilter: false,
                showBase: false
            }
        },
        watch: {
            baseLen: function(val){
                if (val > 0 && val < 51){
                    //this.showBase = true;
                    setTimeout(()=>{ this.showBase = true; }, 500);
                }else this.showBase = false;
            }
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          allGroup: function(){
            return this.ndx.groupAll()
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
            searchBox
        },
        created: function(){
        	console.log('created')

        },
        mounted() {
            console.log('mounted')

            //TEST AXIOS CALL:
            axios.post(axios_url_off_tos).then(response => {
                store.state.asDate = response.data.ASOFDATE
                var axiosData = response.data.data
                //console.log(axiosData)
                var objData = makeObject(axiosData)
                console.log(objData)
                this.data = objData
                this.loaded = true
                renderCharts()
            }).catch(console.error)

            var makeObject = (data) => {
                function getRandomInt(max) {
                  return Math.floor(Math.random() * Math.floor(max));
                }
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
                    obj.CS2 = formats.geoCSAb[obj.CS]
                    if (obj.CS2 === undefined)
                        obj.CS2 = 'AA'
                    output.push(obj);
                }
                return output;
            }

            var renderCharts = () => {
            	dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //reduce functions
                function tosAdd(p,v) {
                    p.months = p.months + +v.months
                    p.cnt = p.cnt + +v.cnt
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.average = p.months/p.cnt === Infinity ? 0 : p.months/p.cnt || 0
                    return p
                }

                function tosRemove(p,v) {
                    p.months = p.months - +v.months
                    p.cnt = p.cnt - +v.cnt
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.average = p.months/p.cnt === Infinity ? 0 : p.months/p.cnt || 0
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
                                return d.value['cnt'] != 0
                            })
                        }
                    }
                }

                //Number Display for cnt
                var count = this.ndx.groupAll().reduceSum(function(d) { 
                	return +d.cnt 
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
                	return +d.months 
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
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number </span>"
                })
               
                var locFormat = {
                	'1' : 'CONUS',
                	'2' : 'OCONUS',
                }

                var locFormatOrder = {
                	'CONUS' : 0,
                	'OCONUS': 1,
                }

                //Rowchart for tour
                var tourConfig = {};
                tourConfig.id = 'tour';
                tourConfig.dim = this.ndx.dimension(function (d) {
                    return locFormat[d.LOC];
                })

                tourConfig.group = tourConfig.dim.group().reduce(tosAdd,tosRemove,tosInitial)
                tourConfig.minHeight = 100
                tourConfig.aspectRatio = 2.6
                tourConfig.margins = {top: 10, left: 10, right: 30, bottom: 20}
                tourConfig.colors = d3.scale.category10()


                var tourChart = dchelpers.getRowChart(tourConfig)

                tourChart
                    .valueAccessor((d)=> {
                        return d.value.cnt;
                    })
                    .ordering(function(d){
                      return locFormatOrder[d.key]
                    })        


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

                //Rowchart for tour
                var tourStConfig = {};
                tourStConfig.id = 'tour_st';
                tourStConfig.dim = this.ndx.dimension(function (d) {
                    return locStFormat[d.LOC_ST];
                })

                tourStConfig.group = tourStConfig.dim.group().reduce(tosAdd,tosRemove,tosInitial)
                tourStConfig.minHeight = 200 
                tourStConfig.aspectRatio = 2
                tourStConfig.margins = {top: 10, left: 10, right: 30, bottom: 20}
                tourStConfig.colors = d3.scale.category10()


                var tourStChart = dchelpers.getRowChart(tourStConfig)

                tourStChart
                    .valueAccessor((d)=> {
                        return d.value.cnt;
                    })
                    .ordering(function(d){
                      return locStFormatOrder[d.key]
                    })        

                //Grade
                var gradeConfig = {}
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function(d){
                    return formats.gradeFormat[d.grd];
                })
                gradeConfig.group = gradeConfig.dim.group().reduce(tosAdd, tosRemove, tosInitial)
                gradeConfig.minHeight = 280
                gradeConfig.aspectRatio = 5
                gradeConfig.margins = {top: 30, left: 40, right: 30, bottom: 50}
                gradeConfig.colors = ["#1976d2"]

                var gradeChart = dchelpers.getOrdinalBarChart(gradeConfig)

                gradeChart
                    .valueAccessor((d) => {
                        return d.value.cnt
                    })
                    .elasticX(true)
                    .ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
	                        .attr('transform', 'translate(-8,0)rotate(-45)')
	                        .on('click', (d)=>{
	                            this.submit(d, 'dc-grade-barchart')
                        })
                    })
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    }) 

                //base(mpf)
                var baseSelDim = this.ndx.dimension((d)=>{return d.DLOC});
                //console.log(afscDim.group().top(Infinity))
                var baseSelGrp = removeEmptyBins(baseSelDim.group().reduceSum(function(d) { return +d.cnt }));
                var baseSelect = dc.selectMenu('#dc-base-select')
                baseSelect
                    .dimension(baseSelDim)
                    .group(baseSelGrp)       
                    .numberVisible(10)
                    .controlsUseVisibility(true);

                var baseConfig = {}
                baseConfig.id = 'base'
                baseConfig.dim = this.ndx.dimension(function(d){return d.DLOC});
                var basePercent = baseConfig.dim.group().reduce(tosAdd, tosRemove, tosInitial)
                baseConfig.group = removeEmptyBins(basePercent)
                baseConfig.minHeight = chartSpecs.baseChart.minHeight
                baseConfig.aspectRatio = chartSpecs.baseChart.aspectRatio 
                baseConfig.margins = chartSpecs.baseChart.margins 
                baseConfig.colors = [chartSpecs.baseChart.color]
                var baseChart = dchelpers.getOrdinalBarChart(baseConfig)
                baseChart
                    .valueAccessor((d) => {
                        return d.value.cnt
                    })
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                             .attr('fill','white')
                        this.baseLen = chart.group().all().length
                        if (chart.hasFilter() || baseSelect.hasFilter()) 
                            this.baseHasFilter = true;
                        else this.baseHasFilter = false;
                        setTimeout(()=>{ 
                            chart.selectAll('g.x text')
                                 .attr('fill','black') 
                        }, 500);
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-base-barchart')
                        })
                    })

                baseChart.on('filtered', (chart)=>{
                    this.baseLen = chart.group().all().length
                })

                baseSelect.on('filtered', (chart)=>{
                    if (chart.hasFilter() || baseChart.hasFilter()) 
                        this.baseHasFilter = true;
                    else this.baseHasFilter = false;
                })

                //Number Display for Auth, Asgn, STP - show total for filtered content
                var inv = this.ndx.groupAll().reduceSum(function(d) { return +d.count })
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
                    return d.CS2;
                })
                usConfig.group = removeEmptyBins(usConfig.dim.group().reduce(tosAdd, tosRemove, tosInitial))
                
                usConfig.scale = 700;
                usConfig.minHeight = 200
                usConfig.aspectRatio = 2

                usConfig.colors =[  "#E2F2FF","#C4E4FF","#9ED2FF","#81C5FF","#6BBAFF","#51AEFF","#36A2FF","#1E96FF","#0089FF","#0061B5"]
                usConfig.colorDomain = [7000, 8000]
                usConfig.colorAccessor = 'cnt'
            
                var statesJson = require('../../assets/geo.json')
                usConfig.json = statesJson
                usConfig.geoName = "state"
                usConfig.propName = 'name'

                usConfig.projection = d3.geo.albersUsa()
                usConfig.size = [0.6 , 0.9, 2.1];
                                          
                var usChart = dchelpers.getGeoChart(usConfig)
                usChart.title(function(d) {
                        var myCount = 0;
                        if (d.value)
                            myCount = d.value.cnt;
                        return "State: " + d.key + "\n Count: " + myCount;
                    });

                var jpConfig = {}
                jpConfig.id = 'jp';
                jpConfig.dim = this.ndx.dimension(function(d){
                     return d.CS2;
                })
                jpConfig.group = removeEmptyBins(jpConfig.dim.group().reduce(tosAdd, tosRemove, tosInitial))
                // jpConfig.dim = usConfig.dim
                // jpConfig.group = usConfig.group
                jpConfig.size = [0.3 , 2.5, 0.8];
                jpConfig.minHeight = 200
                jpConfig.aspectRatio = 2

                jpConfig.colors =["#E2F2FF","#C4E4FF","#9ED2FF","#81C5FF","#6BBAFF","#51AEFF","#36A2FF","#1E96FF","#0089FF","#0061B5"]
                jpConfig.colorAccessor = 'cnt'
            
                var jpJson = require('../../assets/oconus.json')
                jpConfig.json = jpJson
                jpConfig.geoName = "state"
                jpConfig.propName = "iso_a2"

                var center = d3.geo.centroid(jpConfig.json)
                center[1] -= 13
                jpConfig.projection =   d3.geo.mercator()
                                          .center(center)
        
                var jpChart = dchelpers.getGeoChart(jpConfig)

                jpChart.title(function(d) {
                        var myCount = 0;
                        if (d.value)
                            myCount = d.value.cnt;
                        return d.key + "\n Count: " + myCount;
                    });

                jpChart.on('pretransition', (chart)=> {
                    // console.log(chart.group().all())
                    //console.log(usChart.filters())
                    var color = 'orange'
                    chart.select('svg').append('g').attr("class", "divider")
                    var divider = chart.select('.divider')
                    var dividerStroke = 3

                    divider
                         .append("line")
                         .attr("x1", jpConfig.width * 0.25)
                         .attr("y1", 0)
                         .attr("x2", jpConfig.width * 0.25)
                         .attr("y2", jpConfig.height * 0.2)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color);

                    divider
                         .append("line")
                         .attr("x1", jpConfig.width * 0.25)
                         .attr("y1", jpConfig.height * 0.2)
                         .attr("x2", jpConfig.width * 0.15)
                         .attr("y2", jpConfig.height * 0.5)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color);

                    divider
                         .append("line")
                         .attr("x1", 0)
                         .attr("y1", jpConfig.height * 0.5)
                         .attr("x2", jpConfig.width * 0.152)
                         .attr("y2", jpConfig.height * 0.5)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color);   

                    divider
                         .append("line")
                         .attr("x1", jpConfig.width * 0.432)
                         .attr("y1", jpConfig.height * 0.20)
                         .attr("x2", jpConfig.width * 0.25)
                         .attr("y2", jpConfig.height * 0.2)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color);  

                    divider
                         .append("line")
                         .attr("x1", jpConfig.width * 0.43)
                         .attr("y1", jpConfig.height * 0.20)
                         .attr("x2", jpConfig.width * 0.43)
                         .attr("y2", jpConfig.height * 0.552)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color);  

                    divider
                         .append("line")
                         .attr("x1", jpConfig.width * 0.6)
                         .attr("y1", jpConfig.height * 0.8)
                         .attr("x2", jpConfig.width * 0.43)
                         .attr("y2", jpConfig.height * 0.55)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color);  

                    divider
                         .append("line")
                         .attr("x1", jpConfig.width * 0.6)
                         .attr("y1", jpConfig.height * 0.8)
                         .attr("x2", jpConfig.width * 0.43)
                         .attr("y2", jpConfig.height * 0.55)
                         .attr("stroke-width", dividerStroke)
                         .attr("stroke", color);  

                    chart.select('svg').append('g').attr("class", "textLabels")
                    var textLabels = chart.select('.textLabels')
                    var textStroke = 0.5
                    textLabels
                        .append("text")
                        .attr("x", jpConfig.width * 0.05)
                        .attr("y", jpConfig.height * 0.05)
                        .attr("stroke-width", textStroke)               
                        .attr("stroke", color) 
                        .text('PACAF');

                    textLabels
                        .append("text")
                        .attr("x", jpConfig.width * 0.05)
                        .attr("y", jpConfig.height * 0.8)
                        .attr("stroke-width", textStroke)               
                        .attr("stroke", color) 
                        .text('Alaska & Hawaii');

                    textLabels
                        .append("text")
                        .attr("x", jpConfig.width * 0.7)
                        .attr("y", jpConfig.height * 0.8)
                        .attr("stroke-width", textStroke)               
                        .attr("stroke", color) 
                        .text('Europe');
                       
                })
                // var geoDim = this.ndx.dimension(function(d){
                //     return formats.geoCSAb[d.st];
                // })
                // var geoGroup = geoDim.group().reduce(tosAdd, tosRemove, tosInitial)

                // var scale = 700;
                // var width = scale*0.8;
                // var height = scale/2;

                // dc.geoChoroplethChart("#us-chart")
                //     .width(width) // (optional) define chart width, :default = 200
                //     .height(height) // (optional) define chart height, :default = 200
                //     .transitionDuration(1000) // (optional) define chart transition duration, :default = 1000
                //     .dimension(geoDim) // set crossfilter dimension, dimension key should match the name retrieved in geo json layer
                //     .group(geoGroup) // set crossfilter group
                //     // (optional) define color function or array for bubbles
                //     //.scale(scale)
                //     .colors(["#ccc", "#E2F2FF","#C4E4FF","#9ED2FF","#81C5FF","#6BBAFF","#51AEFF","#36A2FF","#1E96FF","#0089FF","#0061B5"])
                //     // (optional) define color domain to match your data domain if you want to bind data or color
                //     .colorDomain([7000, 8000])
                //     // (optional) define color value accessor
                //     .colorAccessor(function(d){ if (d) return d.cnt;})
                //     .projection(    
                //       d3.geo.albersUsa()
                //       .scale(scale)
                //       .translate([width / 2, height / 2])
                //     )
                //     /* Project the given geojson. You can call this function mutliple times with different geojson feed to generate
                //      * multiple layers of geo paths.
                //      * 1st param - geo json data
                //      * 2nd param - name of the layer which will be used to generate css class
                //      * 3rd param - (optional) a function used to generate key for geo path, it should match the dimension key
                //      * in order for the coloring to work properly */
                //     .overlayGeoJson(statesJson.features, "state", function(d) {
                //         return d.properties.name;
                //     })
                    
                //     // (optional) closure to generate title for path, :default = d.key + ": " + d.value
                //     .title(function(d) {
                //         var myCount = 0;
                //         if (d.value)
                //             myCount = d.value.cnt;
                //         return "State: " + d.key + "\n Count: " + myCount;
                //     });

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

<style src="../../../node_modules/dc/dc.css">
</style>

<style scoped>
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
</style>