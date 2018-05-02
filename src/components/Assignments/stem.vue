<template>
	<div class="container">
		<div class="col-md-12" align="center">
		<h1>STEM DEGREES</h1>
        </div>
        <br>
        <div class="row">
            <div class="col-auto">
                STEM:
                <span id="stemTotal"></span>
            </div>
            <div class="col-auto">
                NON STEM:
                <span id="nonStemTotal"></span>
            </div>
        </div> 
        <br>     
        <div class='row'>
            <div id="grade" class="col-4">
                <div id="dc-grade-rowchart">
                    <h3>STEM BY GRADE <span style="font-size: 14pt; opacity: 0.87"></span>
                    <button type="button"
                            class="btn btn-danger btn-sm btn-rounded reset"
                            style="display: none"
                            @click="resetChart('dc-grade-rowchart')">Reset
                    </button>
                    </h3>
                </div>
            </div>            
            <div id="compare" class="col-4">
                <div id="dc-compare-piechart">
                    <h3>OFFICER/ENLISTED <span style="font-size: 14pt; opacity: 0.87;"></span>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-compare-piechart')">Reset</button>
                    </h3>
                </div>
            </div>
            <div id="edlevel" class="col-4">
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
                console.log(invData)
                var objData = makeObject(invData)
                console.log(objData)
                this.data = objData
                this.loaded = true
                renderCharts()
            }).catch(console.error)

            var makeObject = (data) => {
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
                    output.push(obj);
                }
                return output;
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
                                return d.value != 0
                            })
                        }
                    }
                }

                //Officer/Enlisted Compare piechart
                var compareConfig = {}
                compareConfig.id = 'compare'
                compareConfig.dim = this.ndx.dimension(function(d) {
                    return d.type;
                })
                compareConfig.group = compareConfig.dim.group().reduceSum(function(d) {return d.count;})
                compareConfig.minHeight = 150 
                compareConfig.aspectRatio = 2 
                compareConfig.radius = 80 
                compareConfig.innerRadius = 0
                compareConfig.externalLabels = 0 
                compareConfig.externalRadiusPadding = 0
                var compareChart = dchelpers.getPieChart(compareConfig)
                compareChart
                    .slicesCap(2)

                //Education Level Barchart
                var edLevelConfig = {}
                edLevelConfig.id = 'edlevel'
                edLevelConfig.dim = this.ndx.dimension(function(d){
                    return d.edlevel;
                })
                edLevelConfig.group = edLevelConfig.dim.group().reduceSum(function(d) {return d.count;})
                edLevelConfig.minHeight = 200
                edLevelConfig.aspectRatio = 3
                edLevelConfig.margins = {top: 10, left: 45, right: 30, bottom: 110}
                edLevelConfig.colors = ["#108b52"]
                var edLevelChart = dchelpers.getOrdinalBarChart(edLevelConfig)
                edLevelChart
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
                degreeConfig.group = degreeConfig.dim.group().reduceSum(function(d) {return d.stem;})
                degreeConfig.minHeight = 200
                degreeConfig.aspectRatio = 3
                degreeConfig.margins = {top: 10, left: 45, right: 30, bottom: 150}
                degreeConfig.colors = ["#333cff"]
                var degreeChart = dchelpers.getOrdinalBarChart(degreeConfig)
                degreeChart
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                gradeConfig.colors = ["steelblue", "brown", "red", "green", "yellow", "grey", "blue", "black"]
                this.submit(d, 'dc-degree-barchart')
                        })
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})

                //Grade Rowchart
                
                var gradeConfig = {}
                gradeConfig.id = 'grade'

                gradeConfig.dim = this.ndx.dimension(function(d){
                    return formats.gradeFormat[d.grd];
                })
                gradeConfig.dim.filter(function(d) {return d == '31'});

                gradeConfig.group = gradeConfig.dim.group().reduceSum(function(d) {return d.stem;})
                gradeConfig.minHeight = 280
                gradeConfig.aspectRatio = 5
                gradeConfig.margins = {top: 30, left: 40, right: 30, bottom: 50}
                gradeConfig.colors = d3.scale.category10()

                var gradeChart = dchelpers.getRowChart(gradeConfig)
                
                gradeChart
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

                var total = this.ndx.groupAll().reduceSum(function(d) { return +d.count })
                var totalND = dc.numberDisplay("#total")
                totalND.group(total)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                var nonStemTotal = this.ndx.groupAll().reduceSum(function(d) { return +d.count })
                var nonStemTotalND = dc.numberDisplay("#nonStemTotal")
                nonStemTotalND.group(nonStemTotal)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d - stemTotal.value(stemTotal);})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
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