
<template>
    <div class="container">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2" >
                    <div class="col-auto">
                        TOTAL:
                        <span id="totalCount"></span>
                    </div>
                    <div class="col-auto">
                        STEM:
                        <span id="stemTotal"></span>
                    </div>
                    <div class="col-auto">
                        NON STEM:
                        <span id="nonStemTotal"></span>
                    </div>   
                    <div class="col-6" align="right">
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect" 
                                >Download Raw Data</button>
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect" 
                                @click="searchCore='';resetAll()">Reset All</button>
                    </div>      
                </div>       
                <div class='row'>
                    <div id="offgroup" class="col-4">
                        <div id="dc-offgroup-barchart">
                            <h3>GROUP<span style="font-size: 14pt; opacity: 0.87"></span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="display: none"
                                    @click="resetChart('dc-offgroup-barchart')">Reset
                            </button>
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
                    <div id="grade" class="col-4">
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
                </div>
                <br>
                <div class='row'>
                    <div id="yrgp" class="col-12">
                        <div id="dc-yrgp-barchart">
                            <h3>YEAR GROUP<span style="font-size: 14pt; opacity: 0.87"></span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="display: none"
                                    @click="resetChart('dc-yrgp-barchart')">Reset
                            </button>
                            </h3>
                            <searchBox
                                v-model="searchYRGP"
                                size="3"
                                label="Search Year Group"
                                @sub="submit(searchYRGP,'dc-yrgp-barchart')"
                                button="true"
                                color="#1976d2"
                                btnColor="yrgpColor"
                            ></searchBox>
                        </div>
                    </div>
                </div>
                <br>
                <div class='row'>
                    <div id="core" class="col-12">
                        <div id="dc-core-barchart">
                            <h3>CORE<span style="font-size: 14pt; opacity: 0.87"></span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="display: none"
                                    @click="resetChart('dc-core-barchart')">Reset
                            </button>
                            </h3>
                            <searchBox
                                v-model="searchCore"
                                size="3"
                                label="Search CORE"
                                @sub="submit(searchCore,'dc-core-barchart')"
                                button="true"
                                color="#1976d2"
                                btnColor="coreColor"
                            ></searchBox>
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
                    loaded: false,
                    searchCore: "",
                    searchYRGP: "",
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
           resetAll(){
            dc.filterAll()
            //dc.redrawAll()
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
            'Loader': Loader,
            searchBox
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

            if (given.grade < '11' && given.grade >= '01') {
                obj.grade = formats.gradeFormat[given.grade];
            } else {
                obj.grade = "error";
            }

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

                //reduce functions
                function yrgpAdd(p,v) {
                    p.totalCount = p.totalCount + +v.count
                    return p
                }

                function yrgpRemove(p,v) {
                    p.totalCount = p.totalCount - +v.count
                    return p
                }

                function yrgpInitial() {
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
 
                //Group Barchart
                var groupConfig = {}
                groupConfig.id = 'offgroup'
                groupConfig.dim = this.ndx.dimension(function(d){
                    return d.group;
                })
                var groupGroup = removeEmptyBins(groupConfig.dim.group().reduce(yrgpAdd, yrgpRemove, yrgpInitial))
                groupConfig.group = removeError(groupGroup)
                groupConfig.minHeight = 300
                groupConfig.aspectRatio = 3
                groupConfig.margins = {top: 10, left: 50, right: 20, bottom: 45}
                groupConfig.colors = ["#108b52"]
                var groupChart = dchelpers.getOrdinalBarChart(groupConfig)
                    .valueAccessor(function(d) {return d.value.totalCount;})               
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-offgroup-barchart')
                        })
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})
                
                //Education Level Barchart
                var edLevelConfig = {}
                edLevelConfig.id = 'edlevel'
                edLevelConfig.dim = this.ndx.dimension(function(d){
                    return d.edlevel;
                })
                var edLevelGroup = removeEmptyBins(edLevelConfig.dim.group().reduce(yrgpAdd, yrgpRemove, yrgpInitial))
                edLevelConfig.group = removeError(edLevelGroup)
                edLevelConfig.minHeight = 300
                edLevelConfig.aspectRatio = 3
                edLevelConfig.margins = {top: 30, left: 50, right: 30, bottom: 50}
                edLevelConfig.colors = ["#800000"]
                var edLevelChart = dchelpers.getOrdinalBarChart(edLevelConfig)
                edLevelChart
                    .valueAccessor(function(d) {return d.value.totalCount;})               
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-edlevel-barchart')
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
                var gradegroup = removeEmptyBins(gradeConfig.dim.group().reduce(yrgpAdd, yrgpRemove, yrgpInitial))
                gradeConfig.group = removeError(gradegroup)
                gradeConfig.minHeight = 300
                gradeConfig.aspectRatio = 5
                gradeConfig.margins = {top: 30, left: 20, right: 30, bottom: 50}
                var c = d3.rgb(51,172,255)
                gradeConfig.colors = d3.scale.ordinal().range([c.brighter(1).toString(),c.brighter(0.7).toString(), c.brighter(0.3).toString(), c.toString(),c.darker(0.3).toString(),c.darker(0.6).toString()])
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                
                gradeChart
                    .valueAccessor(function(d) {return d.value.totalCount;})

                    .ordering(function(d){
                      return formats.gradeOrder[d.key]                      
                    })  

                //YEAR GROUP
                var yrgpConfig = {}
                yrgpConfig.id = 'yrgp'
                yrgpConfig.dim = this.ndx.dimension(function(d){
                    return d.yrgp;
                })
                var yrgpGroup = removeEmptyBins(yrgpConfig.dim.group().reduce(yrgpAdd, yrgpRemove, yrgpInitial))
                yrgpConfig.group = removeError(yrgpGroup)
                yrgpConfig.minHeight = 300
                yrgpConfig.aspectRatio = 3
                yrgpConfig.margins = {top: 30, left: 50, right: 30, bottom: 50}
                yrgpConfig.colors = ["#ff9900"]
                var yrgpChart = dchelpers.getOrdinalBarChart(yrgpConfig)
                yrgpChart
                    .valueAccessor(function(d) {return d.value.totalCount;})
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-yrgp-barchart')
                        })
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})

                yrgpChart.ordering(function(d){
                    return -d.key;
                })

                //Core Rowchart
                var coreConfig = {}
                coreConfig.id = 'core'
                coreConfig.dim = this.ndx.dimension(function(d){
                    return d.core;
                })
                var coreGroup = removeEmptyBins(coreConfig.dim.group().reduce(yrgpAdd, yrgpRemove, yrgpInitial))
                coreConfig.group = removeError(coreGroup)
                coreConfig.minHeight = 300
                coreConfig.aspectRatio = 3
                coreConfig.margins = {top: 30, left: 50, right: 30, bottom: 50}
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

                var percentGroup = this.ndx.groupAll().reduce(yrgpAdd,yrgpRemove,yrgpInitial)
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