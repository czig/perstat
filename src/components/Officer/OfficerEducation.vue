
<template>
    <div class="container-fluid">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2" >
                    <div id="radioSelect" class="col-7">
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
                    <div class="col-5" align="right">
                        <button type="button" id="showMyFilters"
                                class="btn btn-info btn-rounded btn-sm waves-effect"
                                title="Filter">
                        <p class="d-none d-md-inline">View Filters&nbsp;&nbsp;</p>   
                        <FontAwesomeIcon icon="search-filters" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button> 
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect"
                                title="Download Raw Data">
                        <p class="d-none d-md-inline">Download&nbsp;&nbsp;</p>  
                        <FontAwesomeIcon icon="download" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button>
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect" 
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
                <div class="row">
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
                <div class='row'>
                    <div id="offgroup" class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                        <div id="dc-offgroup-barchart">
                            <h3>Group<span style="font-size: 14pt; opacity: 0.87"> {{ ylabel }}</span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="visibility: hidden"
                                    @click="resetChart('dc-offgroup-barchart')">Reset
                            </button>
                            </h3>
                        </div>
                    </div>
                    <div id="grade" class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                        <div id="dc-grade-rowchart">
                            <h3>Grade <span style="font-size: 14pt; opacity: 0.87">{{ ylabel }}</span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="visibility: hidden"
                                    @click="resetChart('dc-grade-rowchart')">Reset
                            </button>
                            </h3>
                        </div>
                    </div> 
                    <div id="edlevel" class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                        <div id="dc-edlevel-barchart">
                            <h3>Highest Edu Level <span style="font-size: 14pt; opacity: 0.87">{{ ylabel }}</span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="visibility: hidden"
                                    @click="resetChart('dc-edlevel-barchart')">Reset
                            </button>
                            </h3>
                        </div>
                    </div>
                </div>
<!--                 <largeBarChart :id="'yrgp'"         
                               :dimension="yrgpDim"
                               :group="removeError(yrgpGroup)"
                               :widthFactor="0.90"
                               :aspectRatio="4"
                               :minHeight="200"
                               :ylabel="ylabel"
                               :selected="selected"
                               :reducer="edAddLarge"
                               :accumulator="edInitialLarge"
                               :numBars="30"
                               :margin="chartSpecs.yrgpChart.margins"
                               :colorScale="yrgpColorScale"
                               :title="'Year Group'"
                               :loaded="loaded"
                               :sortBy="'key'"
                               :orderBy="'desc'">
                </largeBarChart> -->
                <overviewBarChart 
                    :id="'yrgp'"
                    :dimension="yrgpDim"
                    :aspectRatio="chartSpecs.yrgpChart.aspectRatio"
                    :minHeight="chartSpecs.yrgpChart.minHeight"
                    :normalToOverviewFactor="2.5"
                    :selected="selected"
                    :ylabel="ylabel"
                    :reducerAdd="edAdd"
                    :reducerRemove="edRemove"
                    :accumulator="edInitial"
                    :numBars="15"
                    :margin="chartSpecs.yrgpChart.margins"
                    :colorScale="yrgpColorScale"
                    :title="'Year Group'"
                    :loaded="loaded"
                    :orderBy="'desc'"
                    >
                </overviewBarChart>

<!--                 <largeBarChart :id="'core'"         
                               :dimension="coreDim"
                               :group="removeError(coreGroup)"
                               :ylabel="ylabel"
                               :selected="selected"
                               :widthFactor="0.90"
                               :aspectRatio="4"
                               :minHeight="200"
                               :reducer="edAddLarge"
                               :accumulator="edInitialLarge"
                               :numBars="30"
                               :margin="chartSpecs.coreChart.margins"
                               :colorScale="coreColorScale"
                               :title="'Core'"
                               :loaded="loaded">
                </largeBarChart> -->
                <overviewBarChart 
                    :id="'core'"
                    :dimension="coreDim"
                    :aspectRatio="chartSpecs.coreChart.aspectRatio"
                    :minHeight="chartSpecs.coreChart.minHeight"
                    :normalToOverviewFactor="2.5"
                    :selected="selected"
                    :ylabel="ylabel"
                    :reducerAdd="edAdd"
                    :reducerRemove="edRemove"
                    :accumulator="edInitial"
                    :numBars="15"
                    :margin="chartSpecs.coreChart.margins"
                    :colorScale="coreColorScale"
                    :title="'Core'"
                    :loaded="loaded"
                    >
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
	import AutoComplete from '@/components/AutoComplete'
	import searchBox from '@/components/searchBox'
	import Loader from '@/components/Loader'
	import { store } from '@/store/store'
  import largeBarChart from '@/components/largeBarChart'
  import overviewBarChart from '@/components/overviewBarChart'    
  import toastr from "toastr"
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

	export default {
		data() {
			return {
					data: [],
          loaded: false,
          selected: "totalCount",
          searchCore: "",
          searchYRGP: "",
          chartSpecs: chartSpecs,
          coreColorScale: d3.scale.ordinal().range([chartSpecs.coreChart.color]),
          yrgpColorScale: d3.scale.ordinal().range([chartSpecs.yrgpChart.color]),
          pageName: 'Officer Education',                    
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
      coreDim: function() {
          return this.ndx.dimension(function(d) {return d.core;});
      },
      coreGroup: function() {
          return this.coreDim.group().reduce(this.edAdd,this.edRemoveLarge,this.edInitial)
      },
      yrgpDim: function() {
          return this.ndx.dimension(function(d) {
            return d.yrgp;
          });
      },
      yrgpGroup: function() {
          return this.yrgpDim.group().reduce(this.edAdd,this.edRemoveLarge,this.edInitial);
      },            
      ylabel: function() {
        // if (_.includes(this.selected,"Percent")) {
        //     return "(%)"
        // }
        // else {
        //     return "(Count)"
        // }
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
          toProperCase: function(s) {
            return s.toLowerCase().replace(/^(.)|\s(.)/g, 
                function($1) { return $1.toUpperCase(); });
          }
		},

		components: {
			'AutoComplete': AutoComplete,
      'Loader': Loader,
      searchBox,
      largeBarChart,
      overviewBarChart,
      FontAwesomeIcon
		},

		created: function() { 
			console.log('created')		
		},

		mounted() {
			console.log('mounted')

			//test AXIOS Call:
            axios.post(axios_url_prom_year_group).then(response => {
                store.state.asDate = response.data.ASOFDATE
                var invData = response.data.data
                var objData = makeObject(invData)
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
                if (given.core == '**ERROR**' || given.core == '') {
                    obj.core = 'Unknown'   
                } else {
                    obj.core = given.core
                }
                obj.grade = formats.gradeFormat[given.grade];
                obj.group = given.grp
                obj.type = given.type
                obj.stem = given.stem
                obj.nonstem = given.non_stem
                obj.yrgp = given.year_grp

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
 
                //Group Barchart
                var groupConfig = {}
                groupConfig.id = 'offgroup'
                groupConfig.dim = this.ndx.dimension(function(d){
                    return d.group;
                })
                var groupGroup = removeEmptyBins(groupConfig.dim.group().reduce(this.edAdd, this.edRemove, this.edInitial))
                groupConfig.group = removeError(groupGroup)
                groupConfig.minHeight = 200 
                groupConfig.aspectRatio = 4 
                groupConfig.margins = {top: 30, left: 50, right: 30, bottom: 50}
                groupConfig.colors = ["#5F9EA0"]
                var groupChart = dchelpers.getOrdinalBarChart(groupConfig)
                    .valueAccessor((d) => {
                        return d.value[this.selected];
                    })       
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
                    .yAxis().tickFormat(function(v) {return v + "%";})
                
                //Education Level Barchart
                var edLevelConfig = {}
                edLevelConfig.id = 'edlevel'
                edLevelConfig.dim = this.ndx.dimension(function(d){
                    return d.edlevel;
                })
                var edLevelGroup = removeEmptyBins(edLevelConfig.dim.group().reduce(this.edAdd, this.edRemove, this.edInitial))
                edLevelConfig.group = removeError(edLevelGroup)
                edLevelConfig.minHeight = 200 
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
                          .on('click', (d)=>{
                            chart.filter(d);
                            dc.redrawAll();                                
                          })                        
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
                gradeConfig.minHeight = 200
                gradeConfig.aspectRatio = 4
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

                //Current Filters button
                d3.select('#showMyFilters')
                  .on('click', ()=>{
                    var myFilters = this.toProperCase(this.pageLabel) + ' filters ';

                    dc.chartRegistry.list().forEach((d)=>{ 

                    if (d.hasFilter() && d.anchor()!='#dc-overviewyrgp-barchart' && d.anchor()!='#dc-overviewcore-barchart') {
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

                    FileSaver.saveAs(blob, 'PERSTAT Officer Year Group' + ' ' + store.state.asDate + myFilters + ' .csv');
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
#offgroup, #grade, #edlevel, #yrgp, #core {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
<style scoped>
#radioSelect div,input,label{
    cursor: pointer;
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

.form-group {
    padding-left: 10px;
}

#grade {
    padding-left: 8px;
}

.stats {
    padding-left: 0;
}
</style>
