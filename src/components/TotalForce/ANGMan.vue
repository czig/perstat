<template>
    <div class="container-fluid">
       <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" id="loader" key="loader"></loader>
            <div v-show="loaded" id="content" key="content">
                <div class="row">
                    <div id="radioSelect" class="col-auto" data-step="3" data-intro="Total number of ANG personnel.">
                        <div class="col-auto">
                            Inventory:
                            <span id="inv"></span>
                        </div>
                    </div>
                    <div class="col"></div>
                    <div class="col-auto">                      
                    </div>
                </div>
                <div class="row">
                    <div id="type" class="col-xl-6 col-lg-3 col-md-6 col-sm-12 col-12">
                        <div id="dc-type-rowchart">
                            <h3>Type <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-type-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="grade" class="col-xl-6 col-lg-5 col-md-6 col-sm-12 col-12">
                        <div id="dc-grade-barchart">
                            <h3> Grade/Rank <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-grade-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
<!--                 </div>
                <div class="row"> -->
                    <div id="empCat" class="col-xl-6 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div id="dc-empCat-barchart" data-step="4" data-intro="Clicking the bars applies filters to the chart. Click on one of the bars and watch the other charts update!">
                            <h3>EMPLOYEE CATEGORY <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-empCat-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="us" class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                        <div id="dc-us-geoChoroplethChart" class="center-block clearfix" data-step="5" data-intro="You can zoom in and out, mouse over a state or territory on the maps to see the personnel total, or click on it to apply filters and update the other charts!">
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
        </transition-group>
        <fab
            data-step="2"
            data-intro="Click here to Reset all filters for all charts, Download raw data in tab form, or View current filters applied to all charts."
            :position="position"
            :bg-color="bgColor"
            :actions="fabActions"
            @reset="resetAll"
            @download="fabDownload"
            @demo="startDemo"
            @showMyFilters="fabFilter"
            class="noselect"
        ></fab>     
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import chartSpecs from '@/chartSpecs'
import axios from 'axios'
import formats from '@/store/format'
import Loader from '@/components/Loader'
import { store } from '@/store/store'
import searchBox from '@/components/searchBox'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import toastr from 'toastr'
import fab from '@/components/FAB'

    export default {
        data() {
            return {
                data: [],
                searchempCat: '',
                selected: "percent",
                ylabel: 'Inventory',
                loaded: false,
                chartSpecs: chartSpecs,
                baseColor: chartSpecs.baseChart.color,
                pageName: 'Total Force ANG',
                baseLen: 0,
                baseHasFilter: false,
                showBase: false,
                /* FAB items */
                bgColor: '#333333',
                position: 'bottom-right',  
                iconSize: 'md',        
                fabActions: [{ name: 'reset', icon: 'redo-alt', tooltip: 'Reset All', color: '#FF3547' },
                             { name: 'download', icon: 'download', tooltip: 'Download Raw Data', color: '#2F96B4'},
                             { name: 'demo', icon: 'eye', tooltip: 'Demo the page', color: '#2F96B4'},
                             { name: 'showMyFilters', icon: 'search-filters', tooltip: 'View current Filters', color: '#2F96B4'}],
                mainIcon: 'plus'
            }
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          asDate: function(){
            return store.state.asDate;
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
          pageLabel: function() {
            return this.pageName
          },           
          downloadDim: function() {
            return this.ndx.dimension(function(d) {return d;});    
          }
/*             stateDim: function() {
                return this.ndx.dimension(function(d) {return d.state;});
            },
            stateGroup: function() {
                return this.stateDim.group().reduceSum(function(d) {return d.Inventory;});
            }                        
 */
        },
        methods: {
          startDemo: function() {
            introJs().start()
          },
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
          },
          angAdd: function(p,v) {
              return p + v
          },
          angRemove: function(p,v) {
              return p - v
          },
          angInitial: function() {
            return 0;
          },
          //remove empty function (es6 syntax to keep correct scope)
          removeError: (source_group) => {
            return {
                all: () => {
                    return source_group.all().filter((d) => {
                        return d.key != "error" && d.key != "**ERROR**"
                    })
                }
            }
          },
          toProperCase: function(s) {
            return s.toLowerCase().replace(/^(.)|\s(.)/g, 
                function($1) { return $1.toUpperCase(); });
          },
          fabDownload: function(){
                var data = this.downloadDim.top(Infinity)
                var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"})

                var myFilters = ''
                dc.chartRegistry.list().forEach((d)=>{
                    if (d.filters()[0])
                        myFilters += ' (' + d.filters() + ')'
                })

                FileSaver.saveAs(blob, 'PERSTAT ' + this.pageName + ' ' + store.state.asDate + myFilters + ' .csv');                
           },
           fabFilter: function(){
                //Curent Filters button
                var myFilters = this.toProperCase(this.pageLabel) + ' filters ';
                dc.chartRegistry.list().forEach((d)=>{                    
                //console.log("d.filter(): "+d.filter())
                if (d.hasFilter()) {
                    //console.log(d.anchor(), d.filters())
                    myFilters += '\n (' + d.filters() + ')'
                } 
                })
                if (myFilters !== undefined) {
                  var counterVars = this.ndx.groupAll().reduceSum(function(d) { return +d.Inventory });
                //console.log("counterVars.value: "+counterVars.value());
                // Override global options
                  toastr.options = {
                    "positionClass": "toast-bottom-full-width",
                    "closeButton":"true",
                    "preventDuplicates":"true"
                  }
                  if (counterVars.value() == 0) {
                    toastr.warning('Your ' + this.toProperCase(this.pageLabel) + ' filter(s) returned no results. Please reset and try again.');
                  }
                  else if (counterVars.value() == 1) {
                    myFilters += ' return ' + counterVars.value() + ' result.'
                    toastr.info(myFilters);                         
                  }
                  else {
                    myFilters += ' return ' + counterVars.value() + ' results.'
                    toastr.info(myFilters);  
                  }                      
                }
                if (myFilters == 'undefined' || myFilters == undefined) {
                    toastr.error('Something went wrong. Please reset and try again.')
                }                
            }
        },
        components: {
            'loader': Loader,
            FontAwesomeIcon,
            fab
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')       
            $('[data-toggle="tooltip"]').tooltip({delay: {"show":100, "hide":100}})
            //TEST AXIOS CALL:
            axios.post(axios_url_angman).then(response => {
                //console.log(response)
                store.state.asDate = response.data.ASOFDATE
                var axiosData = response.data.data
                //console.log(axiosData)
                var objData = makeObject(axiosData)
                //console.log(objData)
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
                    var obj2 = {};
                    obj2 = formatData(obj)
                    //obj2 = testData(obj2, obj) 
                    output.push(obj2);
                }
                return output;
            }

            var formatData = (given) =>{
                var obj = {}

                obj.File_Type = formats.type[given.type]
                obj.Grade = formats.gradeFormat[given.grade]
                obj.MAJCOM = formats.majFormat[given.maj]
                obj.Inventory = given.freq
                obj.empCat = given.empcat
                obj.state = given.state

                return obj;
            }

/*             var testData = (formatted, original) =>{
                for (var key in formatted) {
                    if (formatted[key] === undefined){
                        console.log('Empty Value of ' + key)
                        console.log(original)
                        formatted[key] = "UNKNOWN"
                    }
                }
                return formatted;
            }
 */
            var renderCharts = () => {
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //console.log(this.data[0])
                //reduce functions

                //remove empty function (es6 syntax to keep correct scope)
                var removeEmptyBins = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.value != 0
                            })
                        }
                    }
                }

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

                //type 
                var typeConfig = {};
                typeConfig.id = 'type'
                typeConfig.dim = this.ndx.dimension(function (d) {
                    return d.File_Type;
                })
                typeConfig.group = removeEmptyBins(typeConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                typeConfig.minHeight = 250
                typeConfig.aspectRatio = chartSpecs.typeChart.aspectRatio
                typeConfig.margins =  {top: 0,left: 20, right: 30, bottom: 60}
                typeConfig.colors = chartSpecs.typeChart.color
                var typeChart = dchelpers.getRowChart(typeConfig)   
                typeChart.controlsUseVisibility(true)

                //empCat
                var empCatConfig = {}
                empCatConfig.id = 'empCat'
                empCatConfig.dim = this.ndx.dimension(function(d){return d.empCat})
                var empCatGroup = removeEmptyBins(empCatConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                empCatConfig.group = removeError(empCatGroup)
                empCatConfig.minHeight = chartSpecs.empCatChart.minHeight
                empCatConfig.aspectRatio = chartSpecs.empCatChart.aspectRatio
                empCatConfig.margins = chartSpecs.empCatChart.margins
                empCatConfig.colors = this.chartSpecs.empCatColorScale
                var empCatChart = dchelpers.getOrdinalBarChart(empCatConfig)
                empCatChart
                    .elasticX(true)
                    .colorAccessor(function(d){
                        return d.key;
                    })
                    .controlsUseVisibility(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                             .attr('transform', 'translate(-8,0)rotate(-45)')
                             .on('click', (d)=>{
                                chart.filter(d);
                                dc.redrawAll();                                
                             })
                    })

                //Number Display for Auth, Asgn, STP - show total for filtered content
                var inv = this.ndx.groupAll().reduceSum(function(d) { return +d.Inventory })
                var invND = dc.numberDisplay("#inv")
                invND.group(inv)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })


                 //grade
                var gradeConfig = {}
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function(d){
                    return d.Grade;
                })
                gradeConfig.group = removeEmptyBins(gradeConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                gradeConfig.minHeight = 250
                gradeConfig.aspectRatio = 5
                gradeConfig.margins = {top: 10, left: 50, right: 30, bottom: 60}
                gradeConfig.colors = this.chartSpecs.gradeChartColorScale
                var gradeChart = dchelpers.getOrdinalBarChart(gradeConfig)
                gradeChart
                    .elasticX(true)
                    .colorAccessor(function(d){
                        return d.key;
                    })
                    .controlsUseVisibility(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            chart.filter(d);
                            dc.redrawAll();
                        })
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})

                gradeChart
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })  

                //this.gradeChart = gradeChart

                //CONUS 
                var usConfig = {}
                usConfig.id = 'us';
                usConfig.dim = this.ndx.dimension(function(d){
                    return d.state;
                })
                usConfig.group = removeError(usConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                usConfig.scale = 1
                usConfig.minHeight = 200
                usConfig.aspectRatio = 2.01 
                usConfig.xRatio = 2.0
                usConfig.yRatio = 2.2
                                

                //default color scale from #E2F2FF to #0061B5.
                usConfig.colors = d3.scale.quantize().range(["#E2F2FF","#d4eafc","#C4E4FF","#badefc","#a6d4fc","#9ED2FF","#81C5FF","#75bfff","#6BBAFF","#51AEFF","#40a4f9","#36A2FF","#2798f9","#1E96FF","#0089FF","#0061B5"])
                usConfig.valueAccessor = function(d) {
                    if (d) {
                        return d.value
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
                        .attr("font-size", '0.6vw')
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
                        .attr("font-size", '0.6vw')
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
                        .attr("y", usConfig.height * 0.86)
                        .attr("fill", color)  
                        .attr("font-size", '0.6vw')
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
#type, #grade, #empCat, #us {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
#us svg {
    background-color: #dee2e6 !important;
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
