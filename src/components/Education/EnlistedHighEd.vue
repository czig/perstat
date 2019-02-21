
<template>
    <div class="container-fluid">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2" >
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
                    <div class="col"></div>
                    <div class="col-auto">
                        <button type="button" id="showMyFilters"
                                class="btn btn-info btn-rounded btn-sm waves-effect"
                                title="Filter">
                        Filter&nbsp;&nbsp;  
                        <FontAwesomeIcon icon="filter" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button> 
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect"
                                title="Download Raw Data">
                        Download&nbsp;&nbsp;  
                        <FontAwesomeIcon icon="download" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button>
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect"
                                title="Reset All"
                                @click="searchCore='';resetAll()">
                        Reset All&nbsp;&nbsp;  
                        <FontAwesomeIcon icon="redo-alt" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button>
                    </div>      
                </div>       
                <div class='row'>
                    <div id="fyr" class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                        <div id="dc-fyr-barchart">
                            <h3>Fiscal Year<span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            </h3>
                        </div>
                    </div>
                    <div id="edlevel" class="col-xl-8 col-lg-8 col-md-6 col-sm-6 col-12">
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
                <div class='row'>
                    <div id="grade" class="col-xl-5 col-lg-5 col-md-6 col-sm-6 col-12">
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
                    <div id="cafsc" class="col-xl-7 col-lg-7 col-md-6 col-sm-6 col-12">
                        <div id="dc-cafsc-rowchart">
                            <h3>CAFSC<span style="font-size: 14pt; opacity: 0.87">{{ylabel}}</span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="visibility: hidden"
                                    @click="resetChart('dc-cafsc-rowchart')">Reset
                            </button>
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
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
    import toastr from 'toastr'


	export default {
		data() {
			return {
					data: [],
                    loaded: false,
                    fyr: '2018',
                    searchCAFSC: "",
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
            ylabel: function() {
                return "(Count)"
            }
		},

        methods: {
           resetAll(){
            dc.filterAll()
            dc.redrawAll()
            this.fyr = '2018'
            this.singleSubmit('2018', 'dc-fyr-barchart')
          },
          resetChart: (id)=>{
            dc.chartRegistry.list().filter(chart=>{
              return chart.anchorName() == id
            }).forEach(chart=>{
              chart.filterAll()
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
			'AutoComplete': AutoComplete,
            'Loader': Loader,
            searchBox,
            FontAwesomeIcon
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

            if (given.cafsc == null || given.cafsc == '') {
                obj.cafsc = 'error';
            } else {
                obj.cafsc = given.cafsc;
            }

            if (given.grd < '40' && given.grd >= '30') {
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
                                return d.key != "error" && d.key != "**ERROR**"
                            })
                        }
                    }
                }                

                //YEAR
                 d3.selectAll("#row1")
                var fyrConfig = {};
                fyrConfig.id = 'fyr';
                fyrConfig.dim = this.ndx.dimension(function (d) {
                    return d.fyr;
                })
                fyrConfig.group = removeEmptyBins(fyrConfig.dim.group().reduce(highEdAdd,highEdRemove,highEdInitial))
                fyrConfig.minHeight = 200 
                fyrConfig.aspectRatio = 2
                fyrConfig.margins = {top: 10, left: 50, right: 10, bottom: 40}
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
                fyrChart.filter('2018')
  
                //Education Level / Degree Type Barchart
                var edLevelConfig = {}
                edLevelConfig.id = 'edlevel'
                edLevelConfig.dim = this.ndx.dimension(function(d){
                    return d.edlevel;
                })
                var edLevelGroup = removeEmptyBins(edLevelConfig.dim.group().reduce(highEdAdd, highEdRemove, highEdInitial))
                edLevelConfig.group = removeError(edLevelGroup)
                edLevelConfig.minHeight = 200 
                edLevelConfig.aspectRatio = 3.5
                edLevelConfig.margins = chartSpecs.highEdChart.margins
                edLevelConfig.colors = [chartSpecs.highEdChart.color]
                var edLevelChart = dchelpers.getOrdinalBarChart(edLevelConfig)
                edLevelChart                   
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

                    edLevelChart.ordering(d=>{
                        return formats.edLevelOrder[d.key]
                    })

                //Grade Rowchart               
                var gradeConfig = {}                    
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function(d){
                    return d.grade;
                })
                var gradegroup = removeEmptyBins(gradeConfig.dim.group().reduce(highEdAdd, highEdRemove, highEdInitial))
                gradeConfig.group = removeError(gradegroup)
                gradeConfig.minHeight = 260
                gradeConfig.aspectRatio = 3
                gradeConfig.margins = {top: 10, left: 30, right: 10, bottom: 20}
                gradeConfig.colors = chartSpecs.gradeChartColorScale
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                
                gradeChart
                    .controlsUseVisibility(true)
                    .valueAccessor(function(d) {return d.value.totalCount;})

                    .ordering(function(d){
                      return formats.gradeOrder[d.key]                      
                    })  
  
                //CAFSC Rowchart
                var cafscConfig = {}
                cafscConfig.id = 'cafsc'
                cafscConfig.dim = this.ndx.dimension(function(d){
                    return d.cafsc;
                })
                var cafscGroup = cafscConfig.dim.group().reduce(highEdAdd, highEdRemove, highEdInitial)
                cafscConfig.group = removeError(cafscGroup)
                cafscConfig.minHeight = 260
                cafscConfig.aspectRatio = 3
                cafscConfig.margins = {top: 10, left: 30, right: 10, bottom: 20}
                cafscConfig.colors = d3.scale.ordinal().range([chartSpecs.afscGroupChart.color])
                var cafscChart = dchelpers.getRowChart(cafscConfig)
                cafscChart
                    .controlsUseVisibility(true)
                    .valueAccessor(function(d) {return d.value.totalCount;})

                //Curent Filters button
                d3.select('#showMyFilters')
                  .on('click', ()=>{
                    var myFilters = 'Current filters include ';
                    dc.chartRegistry.list().forEach((d)=>{ 
                      if (d.filters()[0])
                        myFilters += '\n (' + d.filters() + ')'
                    })
                    if (myFilters !== undefined) {
                      // Override global options
                      toastr.options = {
                        "positionClass": "toast-bottom-full-width",
                        "closeButton":"true",
                        "preventDuplicates":"true"
                      }
                      toastr.info(myFilters);
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

                    FileSaver.saveAs(blob, 'PERSTAT High Education' + ' ' + store.state.asDate + myFilters + ' .csv');
                });
                    

                //Filters data to count Officer only
                var filtering = this.ndx.dimension(function(d) { return d.type; });
                filtering.filter("E")                                        
              
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
<style src="../../../node_modules/dc/dc.css">
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
