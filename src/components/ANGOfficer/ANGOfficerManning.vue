<template>
    <div class="container-fluid">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
                    <div id="radioSelect" class="col" data-step="1" data-intro="Toggle the radio buttons to change the data element being shown in the charts.">
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio1" type="radio" id="radio1" value="asgn" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio1">
                                Assigned 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio2" type="radio" id="radio2" value="auth" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio2">
                                Authorized 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio3" type="radio" id="radio3" value="gains" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio3">
                                Gains 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio4" type="radio" id="radio4" value="losses" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio4">
                                Losses 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio5" type="radio" id="radio5" value="vacancies" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio5">
                                Vacancies 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio6" type="radio" id="radio6" value="excess" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio6">
                                Excess 
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
                        <button type="button" id="showMyFilters"
                                class="btn btn-info btn-rounded btn-sm waves-effect"
                                data-step="8" data-intro="See the currently applied filters here!"
                                title="Filter">
                        <p class="d-none d-md-inline">Filter&nbsp;&nbsp;</p>  
                        <FontAwesomeIcon icon="filter" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button> 
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
                        Assigned:
                        <span id="asgn"></span>
                    </div>
                    <div class="col-auto">
                        Authorized:
                        <span id="auth"></span>
                    </div>
                    <div class="col-auto">
                        Gains:
                        <span id="gains"></span>
                    </div>
                    <div class="col-auto">
                        Losses:
                        <span id="losses"></span>
                    </div>
                    <div class="col-auto">
                        Vacancies:
                        <span id="vacancies"></span>
                    </div>
                    <div class="col-auto">
                        Excess:
                        <span id="excess"></span>
                    </div>
                </div>
                <div class="row">  
                    <div class="col-md-8 col-sm-12 col-12">
                        <overviewBarChart :id="'mpf'"
                                          :dimension="mpfDim"
                                          :aspectRatio="chartSpecs.baseChart.aspectRatio"
                                          :minHeight="chartSpecs.baseChart.minHeight"
                                          :normalToOverviewFactor="2.5"
                                          :selected="selected"
                                          :ylabel="ylabel"
                                          :reducerAdd="manningAdd"
                                          :reducerRemove="manningRemove"
                                          :accumulator="manningInitial"
                                          :numBars="15"
                                          :margin="chartSpecs.baseChart.margins"
                                          :colorScale="baseColorScale"
                                          :title="'Servicing MPF'"
                                          :loaded="loaded">
                        </overviewBarChart>
                    </div> 
                    <div id="afscGroup" class="col-md-4 col-sm-12 col-12">
                        <div id="dc-afscGroup-barchart" data-step="3" data-intro="Clicking the bars applies filters to the chart. Click on one of the bars and watch the other charts update!">
                            <h3>AFSC Group <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-afscGroup-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="us" class="col-12">
                        <div id="dc-us-geoChoroplethChart" class="center-block clearfix" data-step="4" data-intro="You can mouse over a state or territory on the maps to see the personnel total or click on it to apply filters and update the other charts!">
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
import searchBox from '@/components/searchBox'
import overviewBarChart from '@/components/overviewBarChart'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import toastr from 'toastr'

    export default {
        data() {
            return {
                data: [],
                selected: "asgn",
                searchBase: "",
                loaded: false,
                chartSpecs: chartSpecs,
                baseColorScale: d3.scale.ordinal().range([chartSpecs.baseChart.color]),
                pageName: 'ANG Officer Manning',
                afscGroupChart: {},
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
            if (this.selected === "asgn") {
                return "Assigned"
            }
            else  if (this.selected === "gains") {
                return "Gains"
            }
            else  if (this.selected === "losses") {
                return "Losses"
            }
            else  if (this.selected === "vacancies") {
                return "Vacancies"
            }
            else  if (this.selected === "excess") {
                return "Excess"
            }
            else {
                return "Authorized"
            }
          },

          downloadDim: function() {
            return this.ndx.dimension(function(d) {return d;});    
          },      
          mpfDim: function() {
            return this.ndx.dimension(function(d) {return d.MPF;});
          },
          mpfGroup: function() {
            return this.removeEmptyBins(this.mpfDim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial));
          },
          afscGroupDim: function() {
            return this.ndx.dimension(function(d) {return d.AFSC_Group}); 
          },
          afscGroupConfig: function() {
            return  {
                        'id': 'afscGroup',
                        'dim': this.afscGroupDim,
                        'group': this.removeEmptyBins(this.afscGroupDim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial)),
                        'minHeight': 350,
                        'aspectRatio': 7,
                        'margins': chartSpecs.baseChart.margins,
                        'colors': [chartSpecs.afscGroupChart.color], 
                    }
          },
          pageLabel: function() {
            return this.pageName
          } 
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
          submit: (chart,element) => {
            chart.filter(element)
            dc.redrawAll()
          },
            manningAdd: function(p,v) {
                p.asgn = p.asgn + +v.Assigned
                p.auth = p.auth + +v.Authorized
                p.gains = p.gains + +v.Gains
                p.losses = p.losses + +v.Losses
                p.vacancies = p.vacancies + +v.Vacancies
                p.excess = p.excess + +v.Excess
                return p
            },
            manningRemove: function(p,v) {
                p.asgn = p.asgn - +v.Assigned
                p.auth = p.auth - +v.Authorized
                p.gains = p.gains - +v.Gains
                p.losses = p.losses - +v.Losses
                p.vacancies = p.vacancies - +v.Vacancies
                p.excess = p.excess - +v.Excess
                return p
            },
            manningInitial: function() {
                return {
                    asgn: 0,
                    auth: 0,
                    gains: 0,
                    losses: 0,
                    vacancies: 0,
                    excess: 0,
                }
            },
            removeEmptyBins: function(source_group) {
                return {
                    all: () => {
                        return source_group.all().filter((d) => {
                            return d.value[this.selected] != 0
                        })
                    }
                }
            },            
            toProperCase: function(s) {
                return s.toLowerCase().replace(/^(.)|\s(.)/g, 
                    function($1) { return $1.toUpperCase(); });
            }
        },
        components: {
            'autocomplete': AutoComplete,
            'loader': Loader,
            searchBox,
            overviewBarChart,
            FontAwesomeIcon
        },
        created: function(){
        },
        mounted() {
                       
            //TEST AXIOS CALL:
            axios.post(axios_url_off_man_ang).then(response => {
                store.state.asDate = response.data.ASOFDATE
                var axiosData = response.data.data
                var objData = makeObject(axiosData)
                //console.log(axiosData);
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
                    output.push(obj2);
                }
                return output;
            }

            var formatData = (given) => {
                var obj = {}

                if (given.AFSC_GROUP == '**ERROR**') {
                    obj.AFSC_Group = 'PENDING UPDATE'   
                } else {
                    obj.AFSC_Group = given.AFSC_GROUP
                }
                obj.MPF = formats.mpfFormat[given.MPF]
                obj.Assigned = +given.ASGNCURR
                obj.Authorized = +given.AUTHCURR
                obj.State = given.ANG_STATE  
                obj.Gains = +given.YTD_GAINS   
                obj.Losses = +given.YTD_LOSSES
                obj.Vacancies = +given.VACANCIES
                obj.Excess = +given.EXCESS
               
                if (this.selected == 'asgn') {
                    obj.count = obj.Assigned
                } else {
                    obj.count = obj.Gains
                }

                return obj;
            }
            var renderCharts = () => {

                //Number Display for Auth, Asgn - show total for filtered content
                var auth = this.ndx.groupAll().reduceSum(function(d) { return +d.Authorized })
                var authND = dc.numberDisplay("#auth")
                authND.group(auth)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var asgn = this.ndx.groupAll().reduceSum(function(d) { return +d.Assigned})
                var asgnND = dc.numberDisplay("#asgn")
                asgnND.group(asgn)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var gains = this.ndx.groupAll().reduceSum(function(d) { return +d.Gains})
                var gainsND = dc.numberDisplay("#gains")
                gainsND.group(gains)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var losses = this.ndx.groupAll().reduceSum(function(d) { return +d.Losses})
                var lossesND = dc.numberDisplay("#losses")
                lossesND.group(losses)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var vacancies = this.ndx.groupAll().reduceSum(function(d) { return +d.Vacancies})
                var vacanciesND = dc.numberDisplay("#vacancies")
                vacanciesND.group(vacancies)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var excess = this.ndx.groupAll().reduceSum(function(d) { return +d.Excess})
                var excessND = dc.numberDisplay("#excess")
                excessND.group(excess)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
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

                //afscGroup
                var afscGroupChart = dchelpers.getOrdinalBarChart(this.afscGroupConfig)
                afscGroupChart
                    .elasticX(true)
                    .controlsUseVisibility(true)
                    .valueAccessor((d)=> {
                        
                        return d.value[this.selected];
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(chart, d)
                        })
                    })
                this.afscGroupChart = afscGroupChart

                //CONUS 
                var usConfig = {}
                usConfig.id = 'us';
                usConfig.dim = this.ndx.dimension(function(d){
                    return d.State;
                })

                // var dimData = usConfig.dim.top(10);
                //     dimData.forEach(function (x) {
                //     console.log(JSON.stringify(x));
                // });
                usConfig.group = removeError(usConfig.dim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial))
                usConfig.scale = 1.0
                usConfig.minHeight = 360
                usConfig.maxHeight = '450 !important'
                usConfig.aspectRatio = 2.0 
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
                        .attr("y", usConfig.height * 0.67)
                        .attr("fill", color) 
                        .attr("font-size", '1.2vw')
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
                        .attr("y", usConfig.height * 0.97)
                        .attr("fill", color)  
                        .attr("font-size", '1.2vw')
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
                        .attr("y", usConfig.height * 0.91)
                        .attr("fill", color)  
                        .attr("font-size", '1.2vw')
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
                            .scaleExtent([1, 5])
                            .on("zoom", function () {                             
                            var t = d3.event.translate,
                                s = d3.event.scale;
                            
                            t[0] = Math.min(chart.maxWidth / 2 * (s - 1) + 400 * s, Math.max(chart.maxWidth / 2 * (1 - s) - 400 * s, t[0]));
                            t[1] = Math.min(chart.maxHeight / 2 * (s - 1) + 250 * s, Math.max(chart.maxHeight / 2 * (1 - s) - 250 * s, t[1]));

                            mapZoom.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")" + " scale(" + s + ")")
                        }))
                })
                                
                usChart.controlsUseVisibility(true)

                //Curent Filters button
                d3.select('#showMyFilters')
                  .on('click', ()=>{
                    var myFilters = this.toProperCase(this.pageLabel) + ' filters ';

                    dc.chartRegistry.list().forEach((d)=>{

                    if (d.hasFilter() && d.anchor()!='#dc-overviewmpf-barchart') {
                        //console.log(d.anchor(), d.filters())
                        myFilters += '\n (' + d.filters() + ')'
                    } 
                    })
                    if (myFilters !== undefined) {
                      var myCheckValue = '0';
                        if (this.selected == "asgn") { myCheckValue = asgn.value() };                        
                        if (this.selected == "auth") { myCheckValue = auth.value() };
                        if (this.selected == "gains") { myCheckValue = gains.value() };
                        if (this.selected == "losses") { myCheckValue = losses.value() };
                        if (this.selected == "vacancies") { myCheckValue = vacancies.value() };
                        if (this.selected == "excess") { myCheckValue = excess.value() };
                      //console.log("myCheckValue.value: "+myCheckValue.value());
                      // Override global options
                      toastr.options = {
                        "positionClass": "toast-bottom-full-width",
                        "closeButton":"true",
                        "preventDuplicates":"true"
                      }
                      if (myCheckValue == 0) {
                        toastr.warning('Your ' + this.toProperCase(this.pageLabel) + ' filter(s) returned no results. Please reset and try again.');
                      }
                      else if (myCheckValue == 1) {
                        myFilters += ' return ' + myCheckValue + ' ' + this.ylabel + ' result.'
                        toastr.info(myFilters);                         
                      }
                      else {
                        myFilters += ' return ' + myCheckValue + ' ' + this.ylabel + ' results.'
                        toastr.info(myFilters);  
                      }                      
                    }
                    if (myFilters == 'undefined' || myFilters == undefined) {
                        toastr.error('Something went wrong. Please reset and try again.')
                    }          
                  });

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

                    FileSaver.saveAs(blob, 'PERSTAT ANG_Officer_Manning' + ' ' + store.state.asDate + myFilters + ' .csv');
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
