<template>
    <div class="container">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row">
                    <div class="col-auto">
                        STEM:
                        <span id="stemTotal"></span>
                    </div>
                    <div class="col-auto">
                        NON STEM:
                        <span id="nonStemTotal"></span>
                    </div>
                    <div class="col"></div>
                    <div class="col-md-8" align="right">
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect" 
                                >Download Raw Data</button>
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect" 
                                @click="resetAll">Reset All</button>
                    </div>  
                </div>  
                <div class='row'>
                    <div id="grade" class="col-6">
                        <div id="dc-grade-rowchart">
                            <h3>GRADE <span style="font-size: 14pt; opacity: 0.87"></span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="display: none"
                                    @click="resetChart('dc-grade-rowchart')">Reset
                            </button>
                            </h3>
                        </div>
                    </div>            
                    <div id="edlevel" class="col-6">
                        <div id="dc-edlevel-barchart">
                            <h3>EDUCATION LEVEL <span style="font-size: 14pt; opacity: 0.87"></span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="display: none"
                                    @click="resetChart('dc-edlevel-barchart')">Reset
                            </button>
                            </h3>
                        </div>
                    </div>
                </div>
                <br>
                <div class='row'>
                    <div id="degree" class="col-12">
                        <div id="dc-degree-barchart">
                            <h3>DEGREE <span style="font-size: 14pt; opacity: 0.87;"></span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="display: none"
                                    @click="resetChart('dc-degree-barchart')">Reset
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


	export default {
		data() {
			return {
					data: [],
                    loaded: false
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
            }
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
			'Loader': Loader
		},

		created: function() { 
			console.log('created')		
		},

		mounted() {
			console.log('mounted')

			//test AXIOS Call:
            axios.post(axios_url_stem).then(response => {
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
            obj.deg = given.deg
            obj.edlevel = given.edlevel

            if (given.grd < '11') {
                obj.grd = formats.gradeFormat[given.grd];
            } else {
                obj.grd = "error";
            }

            obj.stem = given.stem
            obj.tafms = given.tafms
            obj.type = given.type
            obj.nonStemCount = +given.count - +given.stem
            obj.totalCount = given.count
            obj.stem = given.stem

                return obj;
            }

            var renderCharts = () => {
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //reduce functions
                function stemAdd(p,v) {
                    p.stemCount = p.stemCount + +v.stem
                    p.totalCount = p.totalCount + +v.count
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.stemPercent = p.stemCount/p.totalCount === Infinity ? 0 : +((p.stemCount/p.totalCount).toFixed(2)) || 0
                    return p
                }

                function stemRemove(p,v) {
                    p.stemCount = p.stemCount - +v.stem
                    p.totalCount = p.totalCount - +v.count
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.stemPercent = p.stemCount/p.totalCount === Infinity ? 0 : +((p.stemCount/p.totalCount).toFixed(2)) || 0
                    return p
                }

                function stemInitial() {
                    return {
                        stemCount: 0,
                        totalCount: 0,
                        stemPercent: 0,
                    }
                }                  

                //remove empty function (es6 syntax to keep correct scope)
/*                 var removeEmptyBins = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.value != 0
                            })
                        }
                    }
                }
 */
                //Education Level Barchart
                var edLevelConfig = {}
                edLevelConfig.id = 'edlevel'
                edLevelConfig.dim = this.ndx.dimension(function(d){
                    return d.edlevel;
                })
                edLevelConfig.group = edLevelConfig.dim.group().reduce(stemAdd, stemRemove, stemInitial)
                edLevelConfig.minHeight = 300
                edLevelConfig.aspectRatio = 3
                edLevelConfig.margins = {top: 10, left: 100, right: 30, bottom: 130}
                edLevelConfig.colors = ["#108b52"]
                var edLevelChart = dchelpers.getOrdinalBarChart(edLevelConfig)
                edLevelChart
                    .valueAccessor((d) => {
                        return d.value.stemCount
                    })                
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-edLevel-barchart')
                        })
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})

                    edLevelChart.ordering(d=>{
                        return formats.edLevelOrder[d.key]
                    })

                //Degree Barchart
                var degreeConfig = {}
                degreeConfig.id = 'degree'
                degreeConfig.dim = this.ndx.dimension(function(d){
                    return d.deg;
                })
                degreeConfig.group = degreeConfig.dim.group().reduce(stemAdd, stemRemove, stemInitial)
                degreeConfig.minHeight = 400
                degreeConfig.aspectRatio = 3
                degreeConfig.margins = {top: 10, left: 150, right: 30, bottom: 200}
                degreeConfig.colors = ["#333cff"]
                var degreeChart = dchelpers.getOrdinalBarChart(degreeConfig)
                degreeChart
                    .valueAccessor((d) => {
                        return d.value.stemCount
                    })
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-degree-barchart')
                        })
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})

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
                    
                //Grade Rowchart
                
                var gradeConfig = {}                    
                gradeConfig.id = 'grade'

                gradeConfig.dim = this.ndx.dimension(function(d){
                    return d.grd;
                })
                var grdgroup = gradeConfig.dim.group().reduce(stemAdd, stemRemove, stemInitial)
                gradeConfig.group = removeError(grdgroup)
                gradeConfig.minHeight = 280
                gradeConfig.aspectRatio = 5
                gradeConfig.margins = {top: 30, left: 40, right: 30, bottom: 50}
                gradeConfig.colors = d3.scale.category10()

                var gradeChart = dchelpers.getRowChart(gradeConfig)
                
                gradeChart
                    .valueAccessor((d) => {
                        return d.value.stemCount
                    })

                    .ordering(function(d){
                      return formats.gradeOrder[d.key]                      
                    }) 


                //Number Display for STEM, NON STEM, and overall total - show total for filtered content
                var stemTotal = this.ndx.groupAll().reduceSum(function(d) { return +d.stem })
                var stemTotalND = dc.numberDisplay("#stemTotal")
                stemTotalND.group(stemTotal)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                var nonStemTotal = this.ndx.groupAll().reduceSum(function(d) { return +d.nonStemCount })
                var nonStemTotalND = dc.numberDisplay("#nonStemTotal")
                nonStemTotalND.group(nonStemTotal)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

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

                    FileSaver.saveAs(blob, 'PERSTAT Officer_STEM' + ' ' + store.state.asDate + myFilters + ' .csv');
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

<style src="@/../node_modules/dc/dc.css">
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
</style>