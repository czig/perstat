
<template>
    <div class="container-fluid">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2" >
                    <div class="custom-control custom-radio custom-control-inline col-auto" data-step="3" data-intro="STEM and Non-STEM totals.">
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
                    </div> 
                    <div class="col"></div>
                    <div class="col-auto">                       
                    </div>      
                </div>       
                <div class='row'>
                    <div id="fyr" class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                        <div id="dc-fyr-barchart" data-step="4" data-intro="Clicking the bars applies filters to the chart. Click on one of the bars and watch the other charts update!">
                            <h3>Fiscal Year<span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            </h3>
                        </div>
                    </div>
                    <div id="offgroup" class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                        <div id="dc-offgroup-barchart">
                            <h3>Group<span style="font-size: 14pt; opacity: 0.87">{{ylabel}}</span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="visibility: hidden"
                                    @click="resetChart('dc-offgroup-barchart')">Reset
                            </button>
                            </h3>
                        </div>
                    </div>
                    <div id="grade" class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                        <div id="dc-grade-rowchart">
                            <h3>Grade <span style="font-size: 14pt; opacity: 0.87">{{ylabel}}</span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="visibility: hidden"
                                    @click="resetChart('dc-grade-rowchart')">Reset
                            </button>
                            </h3>
                        </div>
                    </div> 
                    <div id="edlevel" class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                        <div id="dc-edlevel-barchart">
                            <h3>Degree Type <span style="font-size: 14pt; opacity: 0.87">{{ylabel}}</span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="visibility: hidden"
                                    @click="resetChart('dc-edlevel-barchart')">Reset
                            </button>
                            </h3>
                        </div>
                    </div>
                </div>
                <br>
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
	import AutoComplete from '@/components/AutoComplete'
	import Loader from '@/components/Loader'
	import { store } from '@/store/store'
    import overviewBarChart from '@/components/overviewBarChart' 
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import toastr from 'toastr'
    import fab from '@/components/FAB'

	export default {
		data() {
			return {
				data: [],
                loaded: false,
                searchCore: "",
                selected: "Count",
                chartSpecs: chartSpecs,
                pageName: 'Officer Education',
                coreColorScale: d3.scale.ordinal().range([chartSpecs.coreChart.color]),
                /* FAB items */
                bgColor: '#333333',
                position: 'bottom-right',  
                iconSize: 'md',        
                fabActions: [{ name: 'reset', icon: 'redo-alt', tooltip: 'Reset All', color: '#FF3547' },
                             { name: 'download', icon: 'download', tooltip: 'Download Raw Data', color: '#2F96B4'},
                             { name: 'demo', icon: 'eye', tooltip: 'Demo the page', color: '#2F96B4'},
                             { name: 'showMyFilters', icon: 'search-filters', tooltip: 'View current Filters', color: '#2F96B4'}],
                mainIcon: 'plus',
                year: new Date().getFullYear()
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
                //return this.coreDim.group().reduceSum(function(d) {return d.count;});
                return this.coreDim.group().reduce(this.edAdd,this.edRemoveLarge,this.edInitial);
            },
            ylabel: function() {
                return "(Count)"
            },
            downloadDim: function() {
                return this.ndx.dimension(function(d) {return d;});    
            }, 
            pageLabel: function() {
                return this.pageName
            }  
		},

        methods: {
           resetAll(){
            dc.filterAll()
            dc.redrawAll()
            this.year = this.year
            this.singleSubmit(this.year, 'dc-fyr-barchart')
            // previously hardcoded FY 2020
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
            
            singleSubmit: (text,id) => {
                dc.chartRegistry.list().filter(chart=>{
                    return chart.anchorName() == id
                }).forEach(chart=>{
                    chart.filterAll()
                    chart.filter(text)
                })
                dc.redrawAll()
            },

/*           radioButton: () => {
            setTimeout(function() {
                dc.redrawAll()
            },10)
          },
 */         submit: (text,id) => {
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
            edAdd: function(p,v) {
                p = p + +v.count
                return p
            },
            edRemove: function(p,v) {
                p = p - +v.count
                return p
            },          
            edInitial: function() {
                return 0;
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
                if (d.hasFilter() && d.anchor()!='#dc-overviewcore-barchart') {
                    //console.log(d.anchor(), d.filters())
                    myFilters += '\n (' + d.filters() + ')'
                } 
                })
                if (myFilters !== undefined) {
                  var counterVars = this.ndx.groupAll().reduceSum(function(d) { return +d.count });
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
			'AutoComplete': AutoComplete,
            'Loader': Loader,
            FontAwesomeIcon,
            overviewBarChart,
            fab
		},

		created: function() { 
			console.log('created')		
		},

		mounted() {
			console.log('mounted')

			//test AXIOS Call:
            axios.post(axios_url_high_ed_level).then(response => {
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
            
            if (given.edlevel == null || given.edlevel == '') {
                obj.edlevel = 'error';
            } else {
                obj.edlevel = given.edlevel;
            }

            if (given.core == null || given.core == '') {
                obj.core = 'error';
            } else {
                obj.core = given.core;
            }

            if (given.grd < '11' && given.grd >= '01') {
                obj.grade = formats.gradeFormat[given.grd];
            } else {
                obj.grade = "error";
            }

            obj.group = given.grp
            obj.fyr = given.fyr
            obj.type = given.type
            obj.stem = given.stem
            obj.nonstem = given.non_stem

                return obj;
            }

            var renderCharts = () => {
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //reduce functions
                function highEdAdd(p,v) {
                    p.totalCount = p.totalCount + +v.count
                    return p
                }

                function highEdRemove(p,v) {
                    p.totalCount = p.totalCount - +v.count
                    return p
                }

                function highEdInitial() {
                    return {
                        totalCount: 0
                    }
                }                  

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
                                return d.key != "error"
                            })
                        }
                    }
                }                

                //YEAR
                var fyrConfig = {};
                fyrConfig.id = 'fyr';
                fyrConfig.dim = this.ndx.dimension(function (d) {
                    return d.fyr;
                })
                fyrConfig.group = removeEmptyBins(fyrConfig.dim.group().reduce(highEdAdd,highEdRemove,highEdInitial))
                fyrConfig.minHeight = 221
                fyrConfig.aspectRatio = 2 
                fyrConfig.margins = chartSpecs.yearChart.margins
                fyrConfig.colors = [chartSpecs.yearChart.color]
                var fyrChart = dchelpers.getOrdinalBarChart(fyrConfig)

                fyrChart
                    .elasticX(true)
                    .controlsUseVisibility(true)
                    .valueAccessor(function(d) {return d.value.totalCount;})
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.fyr = d
                            this.singleSubmit(d, 'dc-fyr-barchart')
                        })

                        chart.selectAll("rect.bar").on("click", (d)=>{
                            this.fyr = d.data.key
                            this.singleSubmit(d.data.key, 'dc-fyr-barchart')
                        });
                    })
                fyrChart.filter(this.year)
                // previously hardcoded 2020

                //Group Barchart
                var groupConfig = {}
                groupConfig.id = 'offgroup'
                groupConfig.dim = this.ndx.dimension(function(d){
                    return d.group;
                })
                var groupGroup = removeEmptyBins(groupConfig.dim.group().reduce(highEdAdd, highEdRemove, highEdInitial))
                groupConfig.group = removeError(groupGroup)
                groupConfig.minHeight = 221 
                groupConfig.aspectRatio = 2 
                groupConfig.margins = chartSpecs.offGroupChart.margins
                groupConfig.colors = [chartSpecs.offGroupChart.color]
                var groupChart = dchelpers.getOrdinalBarChart(groupConfig)
                    .controlsUseVisibility(true)
                    .valueAccessor(function(d) {return d.value.totalCount;})               
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
                
                //Education Level / Degree Type Barchart
                var edLevelConfig = {}
                edLevelConfig.id = 'edlevel'
                edLevelConfig.dim = this.ndx.dimension(function(d){
                    return d.edlevel;
                })
                var edLevelGroup = removeEmptyBins(edLevelConfig.dim.group().reduce(highEdAdd, highEdRemove, highEdInitial))
                edLevelConfig.group = removeError(edLevelGroup)
                edLevelConfig.minHeight = 221
                edLevelConfig.aspectRatio = 2 
                edLevelConfig.margins = chartSpecs.highEdChart.margins
                edLevelConfig.colors = [chartSpecs.highEdChart.color]
                var edLevelChart = dchelpers.getOrdinalBarChart(edLevelConfig)
                edLevelChart
                    .controlsUseVisibility(true)
                    .valueAccessor(function(d) {return d.value.totalCount;})        
                    .elasticX(true)
                    .ordering(d=>{
                        return formats.edLevelOrder[d.key]
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            chart.filter(d);
                            dc.redrawAll(); 
                        })
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})


                //Grade Rowchart               
                var gradeConfig = {}                    
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function(d){
                    return d.grade;
                })
                var gradegroup = removeEmptyBins(gradeConfig.dim.group().reduce(highEdAdd, highEdRemove, highEdInitial))
                gradeConfig.group = removeError(gradegroup)
                gradeConfig.minHeight = 180
                gradeConfig.aspectRatio = 2
                gradeConfig.margins = {top: 10, left: 20, right: 10, bottom: 20}
                gradeConfig.colors = chartSpecs.gradeChartColorScale
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                
                gradeChart
                    .valueAccessor(function(d) {return d.value.totalCount;})

                    .ordering(function(d){
                      return formats.gradeOrder[d.key]                      
                    })  
  
                //Core Rowchart
/*                 var coreConfig = {}
                coreConfig.id = 'core'
                coreConfig.dim = this.ndx.dimension(function(d){
                    return d.core;
                })
                var coreGroup = removeEmptyBins(coreConfig.dim.group().reduce(highEdAdd, highEdRemove, highEdInitial))
                coreConfig.group = removeError(coreGroup)
                coreConfig.minHeight = 400
                coreConfig.aspectRatio = 3
                coreConfig.margins = {top: 10, left: 20, right: 20, bottom: 200}
                coreConfig.colors = ["#333cff"]
                var coreChart = dchelpers.getOrdinalBarChart(coreConfig)
                coreChart
                    .valueAccessor(function(d) {return d.value.totalCount;})
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-core-barchart')
                        })
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})
 */                

                //Filters data to count Officer only
                var filtering = this.ndx.dimension(function(d) { return d.type; });
                filtering.filter("O")                                        
              
                //Number Display for STEM, NON STEM, PERCENT, and overall total - show total for filtered content
                var totalCount = this.ndx.groupAll().reduceSum(function(d) { return +d.count })
                var totalCountND = dc.numberDisplay("#totalCount")
                totalCountND.group(totalCount)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                var stemTotal = this.ndx.groupAll().reduceSum(function(d) { return +d.stem })
                var stemTotalND = dc.numberDisplay("#stemTotal")
                stemTotalND.group(stemTotal)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                var nonStemTotal = this.ndx.groupAll().reduceSum(function(d) { return +d.nonstem })
                var nonStemTotalND = dc.numberDisplay("#nonStemTotal")
                nonStemTotalND.group(nonStemTotal)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                var percentGroup = this.ndx.groupAll().reduce(highEdAdd,highEdRemove,highEdInitial)
                var percentND = dc.numberDisplay("#totalPercent")
                percentND.group(percentGroup)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.stemPercent})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })

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
#fyr, #offgroup, #grade, #edlevel, #core {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
<style scoped>

.custom-control.custom-radio{
    padding-left:20px;
    padding-right:10px;
    margin-right: 0;
    cursor:pointer;
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
