
<template>
    <div class="container-fluid">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2" >
                    <div id="radioSelect" class="col" data-step="1" data-intro="Toggle the radio buttons to change the data element being shown in the charts.">
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio" type="radio" id="radio1" value="totalCount" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio1">
                                Total 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio2" type="radio" id="radio2" value="stem" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio2">
                                STEM 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio3" type="radio" id="radio3" value="nonStem" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio3">
                                Non-STEM 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio4" type="radio" id="radio4" value="stemPercent" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio4">
                                Percent STEM 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio5" type="radio" id="radio5" value="nonStemPercent" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio5">
                                Percent Non-STEM 
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
                        <p class="d-none d-md-inline">View Filters&nbsp;&nbsp;</p>   
                        <FontAwesomeIcon icon="search-filters" 
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
                <div class="row"></div>
                <div class="row" data-step="2" data-intro="Summary statistics for the data elements are shown here. These numbers change as filters are applied.">
                    <div class="col-auto">
                        Total:
                        <span id="totalCount"></span>
                    </div>
                    <div class="col-auto">
                        STEM:
                        <span id="stemTotal"></span>
                    </div>
                    <div class="col-auto">
                        Non-STEM:
                        <span id="nonStemTotal"></span>
                    </div>   
                    <div class="col-auto">
                        Percent STEM:
                        <span id="percentStem"></span>
                    </div>
                    <div class="col-auto">
                        Percent Non-STEM:
                        <span id="percentNonStem"></span>
                    </div>   
                </div>
                <overviewBarChart :id="'mpf'"
                                  :dimension="mpfDim"
                                  :aspectRatio="7"
                                  :minHeight="100"
                                  :normalToOverviewFactor="2"
                                  :selected="selected"
                                  :ylabel="ylabel"
                                  :reducerAdd="edAdd"
                                  :reducerRemove="edRemove"
                                  :accumulator="edInitial"
                                  :numBars="15"
                                  :margin="chartSpecs.baseChart.margins"
                                  :colorScale="baseColorScale"
                                  :title="'Servicing MPF'"
                                    :loaded="loaded">
                </overviewBarChart>
                <div class='row'>
                    <div id="grade" class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div id="dc-grade-rowchart">
                            <h3>Grade <span style="font-size: 14pt; opacity: 0.87; align: bottom">{{ ylabel }}</span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="visibility: hidden"
                                    @click="resetChart('dc-grade-rowchart')">Reset
                            </button>
                            </h3>
                        </div>
                    </div> 
                    <div id="dafsc" class="col-xl-8 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div id="dc-dafsc-rowchart">
                            <h3>DAFSC<span style="font-size: 14pt; opacity: 0.87; align: bottom"></span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="visibility: hidden"
                                    @click="resetChart('dc-dafsc-rowchart')">Reset
                            </button>
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="row pt-4">
                    <div id="edlevel" class="col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div id="dc-edlevel-barchart" data-step="3" data-intro="Clicking the bars applies filters to the chart. Click on one of the bars and watch the other charts update!">
                            <h3>Highest Edu Level <span style="font-size: 14pt; opacity: 0.87">{{ ylabel }}</span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="visibility: hidden"
                                    @click="resetChart('dc-edlevel-barchart')">Reset
                            </button>
                            </h3>
                        </div>
                    </div>
                    <div id="us" class="col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
                        <div id="dc-us-geoChoroplethChart" class="center-block clearfix" data-step="4" data-intro="You can zoom in and out, mouse over a state or territory on the maps to see the personnel total, or click on it to apply filters and update the other charts!">
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
	import searchBox from '@/components/searchBox'
	import Loader from '@/components/Loader'
	import { store } from '@/store/store'
    import overviewBarChart from '@/components/overviewBarChart'
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import toastr from 'toastr'

	export default {
		data() {
			return {
					data: [],
                    loaded: false,
                    selected: "totalCount",
                    searchCore: "",
                    searchYRGP: "",
                    chartSpecs: chartSpecs,
                    baseColorScale: d3.scale.ordinal().range([chartSpecs.baseChart.color]),                    
                    pageName: 'ANG Enlisted Education',                    
			}
		},

		computed: {
			ndx: function() {
				return crossfilter (this.data)
			},
      asDate: function() {
        return store.state.asDate;
      },
      allGroup: function(){
        return this.ndx.groupAll()
      },
      mpfDim: function() {
        return this.ndx.dimension(function(d) {return d.mpf;});
      },
      mpfGroup: function() {
        return this.mpfDim.group().reduce(this.edAdd,this.edRemove,this.edInitial);
      },
      ylabel: function() {
        if (this.selected === "totalCount") {
            return "Total"
        }
        else if (this.selected === "stem") {
            return "STEM Count"
        }
        else if (this.selected === "nonStem") {
            return "Non-STEM Count"
        }
        else if (this.selected === "stemPercent") {
            return "% STEM"
        }
        else {
            return "% Non-STEM"
        }
      },
      pageLabel: function() {
        return this.pageName
      }

		},

        methods: {
           resetAll(){
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
            toProperCase: function(s) {
                return s.toLowerCase().replace(/^(.)|\s(.)/g, 
                    function($1) { return $1.toUpperCase(); });
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
          //reduce functions
          edAdd: function(p,v) {
              p.totalCount = p.totalCount + +v.count
              p.stem = p.stem + +v.stem
              p.nonStem = p.nonStem + +v.nonstem
              p.stemPercent = p.stem/p.totalCount === Infinity ? 0 : Math.round((p.stem/p.totalCount)*1000)/10 || 0
              p.nonStemPercent = p.nonStem/p.totalCount === Infinity ? 0 : Math.round((p.nonStem/p.totalCount)*1000)/10 || 0
              return p
          },
          edRemove: function(p,v) {
              p.totalCount = p.totalCount - +v.count
              p.stem = p.stem - +v.stem
              p.nonStem = p.nonStem - +v.nonstem
              p.stemPercent = p.stem/p.totalCount === Infinity ? 0 : Math.round((p.stem/p.totalCount)*1000)/10 || 0
              p.nonStemPercent = p.nonStem/p.totalCount === Infinity ? 0 : Math.round((p.nonStem/p.totalCount)*1000)/10 || 0
              return p
          },
          edInitial: function() {
              return {
                  totalCount: 0,
                  stem: 0,
                  nonStem: 0,
                  stemPercent: 0,
                  nonStemPercent: 0
              }
          },                 
          edAddLarge: function(p,v) {
              p.totalCount = p.totalCount + +v.totalCount
              p.stem = p.stem + +v.stem
              p.nonStem = p.nonStem + +v.nonStem
              p.stemPercent = p.stem/p.totalCount === Infinity ? 0 : Math.round((p.stem/p.totalCount)*1000)/10 || 0
              p.nonStemPercent = p.nonStem/p.totalCount === Infinity ? 0 : Math.round((p.nonStem/p.totalCount)*1000)/10 || 0
              return p 
          },
          edRemoveLarge: function(p,v) {
              p.totalCount = p.totalCount - +v.count
              p.stem = p.stem - +v.stem
              p.nonStem = p.nonStem - +v.nonstem
              p.stemPercent = p.stem/p.totalCount === Infinity ? 0 : Math.round((p.stem/p.totalCount)*1000)/10 || 0
              p.nonStemPercent = p.nonStem/p.totalCount === Infinity ? 0 : Math.round((p.nonStem/p.totalCount)*1000)/10 || 0
              return p
          },
          edInitialLarge: function() {
              return {
                totalCount: 0,
                stem: 0,
                nonStem: 0,
                stemPercent: 0,
                nonStemPercent: 0
              };
          },            
          toProperCase: function(s) {
              return s.toLowerCase().replace(/^(.)|\s(.)/g, 
                  function($1) { return $1.toUpperCase(); });
          }
		},

		components: {
			'AutoComplete': AutoComplete,
            'Loader': Loader,
            searchBox,
            overviewBarChart,
            FontAwesomeIcon
		},

		created: function() { 
			console.log('created')		
		},

		mounted() {
			console.log('mounted')

			//test AXIOS Call:
            axios.post(axios_url_high_ed_level_ang).then(response => {
                store.state.asDate = response.data.ASOFDATE
                var invData = response.data.data
                //console.log(invData)
                var objData = makeObject(invData)
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
                    obj2 = {};
                    obj2 = formatData(obj)
                    output.push(obj2); 
                }
                return output;
            }

            var formatData = (given) =>{
                var obj = {}

                obj.count = given.count
                obj.edlevel = given.edlevel;
                obj.grade = formats.gradeFormat[given.grd];
                obj.type = given.type
                obj.stem = given.stem
                obj.nonstem = given.non_stem
                obj.state = given.ang_state     
                obj.mpf = formats.mpfFormat[given.mpf]
                if (given.cafsc == null || given.cafsc == '') {
                    obj.dafsc = 'error';
                } else {
                    obj.dafsc = given.cafsc;
                }

                return obj;
            }

            var renderCharts = () => {
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)
                //remove empty function (es6 syntax to keep correct scope)
                var removeEmptyBins = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.value.totalCount != 0
                            })
                        }
                    }
                }

                //remove empty function (es6 syntax to keep correct scope)
                var removeError = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.key != "error" && d.key != "**ERROR**"
                            })
                        }
                    }
                }                

            //Filters data to count Officer only
            var filtering = this.ndx.dimension(function(d) { return d.type; });
            filtering.filter("E")                                        

                //Number Display for STEM, NON STEM, PERCENT, and overall total - show total for filtered content
                var overallGroup = this.ndx.groupAll().reduce(this.edAdd,this.edRemove,this.edInitial)
                var totalCountND = dc.numberDisplay("#totalCount")
                totalCountND.group(overallGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d.totalCount;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                var stemTotalND = dc.numberDisplay("#stemTotal")
                stemTotalND.group(overallGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d.stem;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                var nonStemTotalND = dc.numberDisplay("#nonStemTotal")
                nonStemTotalND.group(overallGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d.nonStem;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                var percentStemND = dc.numberDisplay("#percentStem")
                percentStemND.group(overallGroup)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.stemPercent})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })

                var percentNonStemND = dc.numberDisplay("#percentNonStem")
                percentNonStemND.group(overallGroup)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.nonStemPercent})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })

               
                //Education Level Barchart
                var edLevelConfig = {}
                edLevelConfig.id = 'edlevel'
                edLevelConfig.dim = this.ndx.dimension(function(d){
                    return d.edlevel;
                })
                var edLevelGroup = removeEmptyBins(edLevelConfig.dim.group().reduce(this.edAdd, this.edRemove, this.edInitial))
                edLevelConfig.group = removeError(edLevelGroup)
                edLevelConfig.minHeight = 350 
                edLevelConfig.aspectRatio = 4
                edLevelConfig.margins = {top: 30, left: 50, right: 30, bottom: 50}
                edLevelConfig.colors = ["#cc5500"]
                var edLevelChart = dchelpers.getOrdinalBarChart(edLevelConfig)
                edLevelChart
                    .valueAccessor((d) => {
                        return d.value[this.selected];
                    })       
                    .controlsUseVisibility(true)
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})

                    edLevelChart.ordering(d=>{
                        return formats.edLevelOrder[d.key]
                    })

                //Grade Rowchart               
                var gradeConfig = {}                    
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function(d){
                    return d.grade;
                })
                var gradegroup = removeEmptyBins(gradeConfig.dim.group().reduce(this.edAdd, this.edRemove, this.edInitial))
                gradeConfig.group = removeError(gradegroup)
                gradeConfig.minHeight = 360
                gradeConfig.aspectRatio = 3
                gradeConfig.margins = {top: 10, left: 50, right: 30, bottom: 50}
                var c = d3.rgb(51,172,255)
                gradeConfig.colors = this.chartSpecs.gradeChartColorScale 
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                
                gradeChart
                    .valueAccessor((d) => {
                        return d.value[this.selected];
                    })       
                    .controlsUseVisibility(true)
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]                      
                    })  

                //dafsc Rowchart
                var dafscConfig = {}
                dafscConfig.id = 'dafsc'
                dafscConfig.dim = this.ndx.dimension(function(d){
                    return d.dafsc;
                })
                var dafscGroup = dafscConfig.dim.group().reduce(this.edAdd, this.edRemove, this.edInitial)
                dafscConfig.group = removeError(dafscGroup)
                dafscConfig.minHeight = 190
                dafscConfig.aspectRatio = 3
                dafscConfig.margins = {top: 20, left: 30, right: 10, bottom: 20}
                dafscConfig.colors = d3.scale.ordinal().range([chartSpecs.afscGroupChart.color])
                var dafscChart = dchelpers.getRowChart(dafscConfig)
                dafscChart
                    .valueAccessor((d) => {
                        return d.value[this.selected];
                    })       
                    .controlsUseVisibility(true)
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]                      
                    })  

                //CONUS 
                var usConfig = {}
                usConfig.id = 'us';
                usConfig.dim = this.ndx.dimension(function(d){
                    return d.state;
                })
                usConfig.group = removeError(usConfig.dim.group().reduce(this.edAdd, this.edRemove, this.edInitial))
                usConfig.scale = 1
                usConfig.minHeight = 200
                usConfig.aspectRatio = 2.1 
                usConfig.xRatio = 2.0
                usConfig.yRatio = 2.0
                //default color scale from #E2F2FF to #0061B5.
                usConfig.colors = d3.scale.quantize().range(["#E2F2FF","#d4eafc","#C4E4FF","#badefc","#a6d4fc","#9ED2FF","#81C5FF","#75bfff","#6BBAFF","#51AEFF","#40a4f9","#36A2FF","#2798f9","#1E96FF","#0089FF","#0061B5"])
                usConfig.valueAccessor = (d) => {
                    if (d) {
                        return d.value[this.selected]
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

                var usChart = dchelpers.getGeoChart(usConfig)                
                usChart.title(function(d) {
                    if (d.value == undefined){ d.value = '0';}
                    return formats.geoCS[formats.stateFormat[d.key]] + ": " + d.value ;
                    
                });

                usChart.on('pretransition', (chart)=> {
                    var color = '#555'
                    chart.select('svg').select(".textLabels").remove()
                    chart.select('svg .layer0').append('g').attr("class", "textLabels")

                    var textLabels = chart.select('.textLabels')
                    textLabels.attr("cursor","pointer")

                    var textStroke = 2
                    textLabels
                        .append("text")
                        .attr("x", usConfig.width * 0.12)
                        .attr("y", usConfig.height * 0.68)
                        .attr("fill", color) 
                        .attr("font-size", '0.7vw')
                        .attr("font-weight", 'bold')  
                        .text('Guam')
                        .on('click', ()=>{
                            chart.filter([["GU"]]);
                            dc.redrawAll();
                        })

                    textLabels
                        .append("text")
                        .attr("x", usConfig.width * 0.54)
                        .attr("y", usConfig.height * 0.99)
                        .attr("fill", color)  
                        .attr("font-size", '0.7vw')
                        .attr("font-weight", 'bold') 
                        .text('Puerto Rico')
                        .on('click', ()=>{
                            chart.filter([["PR"]]);
                            dc.redrawAll();                            
                        })

                    textLabels
                        .append("text")
                        .attr("x", usConfig.width * 0.61)
                        .attr("y", usConfig.height * 0.93)
                        .attr("fill", color)  
                        .attr("font-size", '0.7vw')
                        .attr("font-weight", 'bold') 
                        .text('US Virgin Islands')
                        .on('click', ()=>{
                            chart.filter([["VI"]]);
                            dc.redrawAll();                            
                        })
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
                        var myCheckValue = 0;
                        if (this.selected == "totalCount") {myCheckValue = totalCountND.value; };
                        if (this.selected == "stem") { myCheckValue = stemTotalND.value };
                        if (this.selected == "nonStem") { myCheckValue = nonStemTotalND.value };
                        if (this.selected == "stemPercent") { myCheckValue = percentStemND.value };
                        if (this.selected == "nonStemPercent") { myCheckValue = percentNonStemND.value };
                      // Override global options
                      toastr.options = {
                        "positionClass": "toast-bottom-full-width",
                        "closeButton":"true",
                        "preventDuplicates":"true"
                      }
                      if (myCheckValue() == '0.0%' || myCheckValue() == 0 ) {
                        toastr.warning('Your ' + this.toProperCase(this.pageLabel) + ' filter(s) returned no results. Please reset and try again.');
                      }
                      else if (myCheckValue() == '1') {
                        myFilters += ' return ' + myCheckValue() + ' ' + this.ylabel + ' result.'
                        toastr.info(myFilters);                         
                      }
                      else {
                        myFilters += ' return ' + myCheckValue() + ' ' + this.ylabel + ' results.'
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
                    var data = gradeConfig.dim.top(Infinity);
                    var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});

                    var myFilters = '';
                    dc.chartRegistry.list().forEach((d)=>{
                        if (d.filters()[0])
                            myFilters += ' (' + d.filters() + ')'
                    })

                    FileSaver.saveAs(blob, 'PERSTAT Enlisted Education' + ' ' + store.state.asDate + myFilters + ' .csv');
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
#edlevel, #grade, #dafsc, #us {
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
