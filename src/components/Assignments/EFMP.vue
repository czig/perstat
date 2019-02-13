<template>
	<div>
		<div class="container-fluid">
	        <transition-group name="fade" mode="out-in">
	        <loader v-show="!loaded" key="loader"></loader>
	        <div v-show="loaded" key="content">
		        <div class="row pt-2">
		        	<div class="col-auto pt-1">
                        Assignment Actions:
                        <span id="count"></span>
                    </div>
                    <div class="col"></div>
		        	<div class="col-auto">
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect" 
                                >Download Raw Data</button> 
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect" 
                                @click="searchAfsc='';searchMajcom='';searchBase='';resetAll()">Reset All</button>
                    </div>
		        </div> 
		        <div class="row">
                    <div class="col-xl-2 col-lg-3 col-md-3 col-sm-6 col-6" id="year">
                    	<div id="dc-year-rowchart">
                            <h3>Year <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
	                        	<button type="button" 
	                                class="btn btn-danger btn-sm btn-rounded reset" 
	                                style="visibility: hidden"
	                                @click="resetChart('dc-year-rowchart')">Reset</button>
	                        </h3>
                    	</div>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6" id="type">
                        <div id="dc-type-rowchart">
                            <h3>Type <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-type-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                	<div class="col-xl-7 col-lg-6 col-md-6 col-sm-12 col-12" id="grade">
                    	<div id="dc-grade-barchart">
                            <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
	                        	<button type="button" 
	                                class="btn btn-danger btn-sm btn-rounded reset" 
	                                style="visibility: hidden"
	                                @click="resetChart('dc-grade-barchart')">Reset</button>
	                        </h3>
                    	</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-12" id="marital">
                		<div id="dc-marital-barchart">
                            <h3>Marital Status <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
	                        	<button type="button" 
	                                class="btn btn-danger btn-sm btn-rounded reset" 
	                                style="visibility: hidden"
	                                @click="resetChart('dc-marital-barchart')">Reset</button>
	                        </h3>
                    	</div>
                	</div>
                    <div class="col-xl-9 col-lg-9 col-md-9 col-sm-8 col-12">
<!--                         <largeBarChart :id="'majcom'"
                                       :dimension="majcomDim"
                                       :group="majcomGroup"
                                       :widthFactor="0.90"
                                       :aspectRatio="chartSpecs.majcomChart.aspectRatio"
                                       :minHeight="chartSpecs.majcomChart.minHeight"
                                       :ylabel="' '"
                                       :reducer="asgnAdd"
                                       :accumulator="asgnInitial"
                                       :numBars="10"
                                       :margin="{top: 10, left: 40, right: 10, bottom: 90}"
                                       :colorScale="majcomColorScale" 
                                       :title="'MAJCOM'"
                                       :loaded="loaded">
                        </largeBarChart> -->
                        <overviewBarChart 
                            :id="'majcom'"
                            :dimension="majcomDim"
                            :aspectRatio="chartSpecs.majcomChart.aspectRatio"
                            :minHeight="chartSpecs.majcomChart.minHeight"
                            :normalToOverviewFactor="2.5"
                            :selected="selected"
                            :ylabel="ylabel"
                            :reducerAdd="asgnAdd"
                            :reducerRemove="asgnRemove"
                            :accumulator="asgnInitial"
                            :numBars="15"
                            :margin="chartSpecs.majcomChart.margins"
                            :colorScale="majcomColorScale"
                            :title="'MAJCOM'"
                            :loaded="loaded">
                        </overviewBarChart>                         
                    </div>
                </div>
<!--                 <largeBarChart :id="'base'"
                               :dimension="baseDim"
                               :group="baseGroup"
                               :widthFactor="0.90"
                             :aspectRatio="chartSpecs.baseChart.aspectRatio"
                             :minHeight="chartSpecs.baseChart.minHeight"
                             :ylabel="' '"
                             :reducer="asgnAdd"
                             :accumulator="asgnInitial"
                             :numBars="20"
                             :margin="chartSpecs.baseChart.margins"
                             :colorScale="baseColorScale"
                             :title="'Servicing MPF'"
                             :loaded="loaded">
                </largeBarChart> -->
                <overviewBarChart 
                    :id="'base'"
                    :dimension="baseDim"
                    :aspectRatio="chartSpecs.baseChart.aspectRatio"
                    :minHeight="chartSpecs.baseChart.minHeight"
                    :normalToOverviewFactor="2.5"
                    :selected="selected"
                    :ylabel="ylabel"
                    :reducerAdd="asgnAdd"
                    :reducerRemove="asgnRemove"
                    :accumulator="asgnInitial"
                    :numBars="15"
                    :margin="chartSpecs.baseChart.margins"
                    :colorScale="baseColorScale"
                    :title="'Servicing MPF'"
                    :loaded="loaded">
                </overviewBarChart>                
	    	</div>
	    	</transition-group>
	    </div>
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
import largeBarChart from '@/components/largeBarChart'
import overviewBarChart from '@/components/overviewBarChart'

export default {
    data() {
    	return {
            data: [],
    		selected:'count',
            loaded: false,
            ylabel: '(Count)',
            chartSpecs: chartSpecs,
            baseColorScale: d3.scale.ordinal().range([chartSpecs.baseChart.color]),
            majcomColorScale: d3.scale.ordinal().range([chartSpecs.majcomChart.color])
    	}
    },
    computed: {
      	ndx: function(){
        	return crossfilter(this.data)
      	},
        downloadDim: function() {
          return this.ndx.dimension(function(d) {return d;});    
        },      
      	allGroup: function(){
        	return this.ndx.groupAll()
      	},
        majcomDim: function() {
            return this.ndx.dimension(function(d) {return d.Majcom;})
        },
        majcomGroup: function() {
            //return this.majcomDim.group().reduceSum((d) => {return +d.Count;})
            return this.removeError(this.majcomDim.group().reduce(this.asgnAdd,this.asgnRemove,this.asgnInitial));
        },
        baseDim: function() {
            return this.ndx.dimension(function(d) {return d.Mpf;})
        },
        baseGroup: function() {
            //return this.baseDim.group().reduceSum((d) => {return +d.Count;})
            return this.removeError(this.baseDim.group().reduce(this.asgnAdd,this.asgnRemove,this.asgnInitial));
        }
    },
    methods: {
      resetAll(event){
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
      removeEmptyBins: function(source_group) {
          return {
              all: () => {
                  return source_group.all().filter((d) => {
                      return d.value != 0
                  })
              }
          }
      },
      asgnAdd: function(p,v) {
        p = p + +v.Count
        return p
      },
      asgnRemove: function(p,v) {
        p = p - +v.Count        
        return p
      },
      asgnInitial: function() {
        return 0;
      }
    },
    mounted() {
        console.log('mounted')

        //TEST AXIOS CALL:
        axios.post(axios_url_efmp).then(response => {
        	var axiosData = response.data.data
        	store.state.asDate = response.data.ASOFDATE
            var objData = makeObject(axiosData)
            // console.log(objData)
            this.data = objData
            this.loaded = true
            renderCharts()
        })

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
                obj2 = testData(obj2, obj)
                output.push(obj2);
            }
            return output;
        }

        var formatData = (given) =>{
            var obj = {}

            obj.Grade = given.ahk4_t.trim().split(" ")[1]
            obj.Marital = given.ale_t
            obj.Count = given.cnt
            obj.Majcom = formats.majFormat[given.cmd]
            obj.Mpf = formats.mpfFormat[given.mpf]
            obj.Type = given.type
            obj.Year = given.year

            return obj;
        }

        var testData = (formatted, original) =>{
            for (var key in formatted) {
                if (formatted[key] === undefined){
                    // console.log('Empty Value of ' + key)
                    // console.log(original)
                    formatted[key] = "UNKNOWN"
                }
            }
            return formatted;
        }

        var renderCharts = () => {
        	dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

            //TOTAL
            var totalGroup = this.ndx.groupAll().reduceSum((d)=>{ 
            	return d.Count
            })
            var invND = dc.numberDisplay("#count")
            invND.group(totalGroup)
                 .formatNumber(d3.format("d"))
                 .valueAccessor(function(d) { return d;})
                 .html({
                    one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                 })

            //YEAR
            var yearConfig = {};
            yearConfig.id = 'year';
            yearConfig.dim = this.ndx.dimension(function (d) {
                return d.Year;
            })
            yearConfig.group = yearConfig.dim.group().reduceSum((d)=>{
            	return d.Count
            })
            yearConfig.minHeight = chartSpecs.standardRowChart.minHeight 
            yearConfig.aspectRatio = 1.5 
            yearConfig.margins = chartSpecs.standardRowChart.margins 
            yearConfig.colors = d3.scale.ordinal().range([chartSpecs.baseChart.color])
            var yearChart = dchelpers.getRowChart(yearConfig)
            yearChart
                .controlsUseVisibility(true)

            //TYPE
            var typeConfig = {};
            typeConfig.id = 'type';
            typeConfig.dim = this.ndx.dimension(function (d) {
                return d.Type;
            })
            typeConfig.group = typeConfig.dim.group().reduceSum((d)=>{
            	return d.Count
            })
            typeConfig.minHeight = chartSpecs.standardRowChart.minHeight 
            typeConfig.aspectRatio = 1.5 
            typeConfig.margins = chartSpecs.standardRowChart.margins 
            typeConfig.colors = d3.scale.category10()
            var typeChart = dchelpers.getRowChart(typeConfig)
            typeChart
                .controlsUseVisibility(true)
            


            //Projection
            var gradeConfig = {};
            gradeConfig.id = 'grade';
            gradeConfig.dim = this.ndx.dimension(function (d) {
                return d.Grade;
            })
            gradeConfig.group = this.removeEmptyBins(gradeConfig.dim.group().reduceSum((d)=>{
            	return d.Count
            }))
            gradeConfig.minHeight = 210
            gradeConfig.aspectRatio = 3
            gradeConfig.margins = {top: 10, left: 40, right: 10, bottom: 45}
            gradeConfig.colors = chartSpecs.gradeChartColorScale
            var gradeChart = dchelpers.getOrdinalBarChart(gradeConfig)
            gradeChart
                .elasticX(true)
                .controlsUseVisibility(true)
                .colorAccessor(function(d){
                    return d.key;
                })
                .ordering(function(d) {
                    return formats.gradeOrder[d.key]
                })
                .on('pretransition', (chart)=> {
                    chart.selectAll('g.x text')
                    .attr('transform', 'translate(-8,0)rotate(-45)')
                    .on('click', (d)=>{
                        chart.filter(d);
                        dc.redrawAll();                                
                    })
                })

            //Marital marital
            var maritalConfig = {};
            maritalConfig.id = 'marital';
            maritalConfig.dim = this.ndx.dimension(function (d) {
                return d.Marital;
            })
            maritalConfig.group = this.removeEmptyBins(maritalConfig.dim.group().reduceSum((d)=>{
            	return d.Count
            }))
            maritalConfig.minHeight = chartSpecs.majcomChart.minHeight 
            maritalConfig.aspectRatio = 2
            maritalConfig.margins = {top: 10, left: 40, right: 10, bottom: 50}
            maritalConfig.colors = ["#7570b3"]
            var maritalChart = dchelpers.getOrdinalBarChart(maritalConfig)
            maritalChart
                .controlsUseVisibility(true)
                .elasticX(true)
                .on('pretransition', (chart)=> {
                    chart.selectAll('g.x text')
                    .attr('transform', 'translate(-8,0)rotate(-45)')
                    .on('click', (d)=>{
                        chart.filter(d);
                        dc.redrawAll();                                
                    })                    
                })
                //order by descending value
                .ordering((d) => {
                    return -d.value;
                })



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

                FileSaver.saveAs(blob, 'PERSTAT EFMP' + ' ' + store.state.asDate + myFilters + ' .csv');
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
    },
    components: {
    	'loader': Loader,
        searchBox, 
        largeBarChart,
        overviewBarChart
    }
}

</script>

<style scoped>
div[id*="-barchart"] .x.axis text{
    text-anchor: end !important;
    transform: rotate(-45deg);
  }

div[id*="-rowchart"] g.row text{
    fill: black;
}
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
