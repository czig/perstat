
<template>
    <div class="container">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2" >
                <div id="radioSelect" class="col form-group">
<!--                     <label class="custom-control custom-radio" >
                        <input class="custom-control-input" name="radioPercent" type="radio" id="radio1" value="stemPercent" v-model="displayType" @click="radioButton">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Percentage</span>              
                    </label>
                    <label class="custom-control custom-radio" >
                        <input class="custom-control-input" name="radioPercent" type="radio" id="radio2" value="totalCount" v-model="displayType" @click="radioButton">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Count</span>
                    </label>
 -->                </div>     
                <div class="col-auto" align="right">
                    <button type="button" id="download"
                            class="btn btn-info btn-rounded btn-sm waves-effect" 
                            >Download Raw Data</button>
                    <button type="button" 
                            class="btn btn-danger btn-rounded btn-sm waves-effect" 
                            @click="searchCore='';resetAll()">Reset All</button>
                </div>      
                </div>       
<!--                 <div id="stats" class="row">
                    <div class="col-auto">
                        TOTAL:
                        <span id="totalCount"></span>
                    </div>
                    <div class="col-auto">
                        PERCENT:
                        <span id="totalPercent"></span>
                    </div>
                    <div class="col"></div>
                </div>  
 -->                <div class='row'>
                    <div id="fyr" class="col-6">
                        <div id="dc-fyr-barchart">
                            <h3>Year [{{fyr}}]<span style="font-size: 14pt; opacity: 0.87;"></span>
                            </h3>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="display: none"
                                    @click="resetChart('dc-fyr-barchart')">Reset
                            </button>
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
                </div>
                <br>
                <div class='row'>
                    <div id="cafsc" class="col-12">
                        <div id="dc-cafsc-barchart">
                            <h3>CAFSC<span style="font-size: 14pt; opacity: 0.87"></span>
                            <button type="button"
                                    class="btn btn-danger btn-sm btn-rounded reset"
                                    style="display: none"
                                    @click="resetChart('dc-cafsc-barchart')">Reset
                            </button>
                            </h3>
                            <searchBox
                                v-model:value="searchCAFSC"
                                size="3"
                                label="Search CAFSC"
                                @sub="submit(searchCAFSC,'dc-cafsc-barchart')"
                                button="true"
                                color="#1976d2"
                                btnColor="cafscColor"
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
                    displayType: "stemPercent",
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
            }
		},

        methods: {
           resetAll(){
            dc.filterAll()
            dc.redrawAll()
            this.fyr = '2018'
            //this.displayType = 'stemPercent'
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
            searchBox
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
                    //obj2 = testData(obj2, obj)
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

            if (given.grade < '40' && given.grade >= '30') {
                obj.grade = formats.gradeFormat[given.grade];
            } else {
                obj.grade = "error";
            }

            obj.group = given.grp
            obj.fyr = given.fyr
            obj.type = given.type
            obj.stem = given.stem
            //obj.totalCount = given.count
            //obj.percent = given.stem/given.count === Infinity ? 0 : Math.round((given.stem/given.count)*1000)/10 || 0;

                return obj;
            }

            var testData = (formatted, original) =>{
                for (var key in formatted) {
                    if (formatted[key] === ''){
                        console.log('Empty Value of ' + key)
                        console.log(original)
                        formatted[key] = "UNKNOWN"
                    }
                }
                return formatted;
            }

            var renderCharts = () => {
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //reduce functions
                function highEdAdd(p,v) {
                    //p.stemCount = p.stemCount + +v.stem
                    p.totalCount = p.totalCount + +v.count
                    //if divide by 0, set to 0, and if NaN, set to zero
                    //p.stemPercent = p.stemCount/p.totalCount === Infinity ? 0 : Math.round((p.stemCount/p.totalCount)*1000/10) || 0
                    return p
                }

                function highEdRemove(p,v) {
                    //p.stemCount = p.stemCount - +v.stem
                    p.totalCount = p.totalCount - +v.count
                    //if divide by 0, set to 0, and if NaN, set to zero
                    //p.stemPercent = p.stemCount/p.totalCount === Infinity ? 0 : Math.round((p.stemCount/p.totalCount)*1000/10) || 0
                    return p
                }

                function highEdInitial() {
                    return {
                        //stemCount: 0,
                        totalCount: 0
                        //stemPercent: 0,
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
                 d3.selectAll("#row1")
                var fyrConfig = {};
                fyrConfig.id = 'fyr';
                fyrConfig.dim = this.ndx.dimension(function (d) {
                    return d.fyr;
                })
                fyrConfig.group = removeEmptyBins(fyrConfig.dim.group().reduce(highEdAdd,highEdRemove,highEdInitial))
                fyrConfig.minHeight = 80 
                fyrConfig.aspectRatio = 4 
                fyrConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                fyrConfig.minHeight = 310
                fyrConfig.aspectRatio = chartSpecs.baseChart.aspectRatio 
                fyrConfig.margins = {top: 10, left: 45, right: 30, bottom: 30}
                fyrConfig.colors = [chartSpecs.baseChart.color]
                var fyrChart = dchelpers.getOrdinalBarChart(fyrConfig)

                fyrChart
                    .elasticX(true)
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
                fyrChart.barPadding(0.2)
                fyrChart.filter('2018')
 
 
                //Education Level Barchart
                var edLevelConfig = {}
                edLevelConfig.id = 'edlevel'
                edLevelConfig.dim = this.ndx.dimension(function(d){
                    return d.edlevel;
                })
                var edLevelGroup = removeEmptyBins(edLevelConfig.dim.group().reduce(highEdAdd, highEdRemove, highEdInitial))
                edLevelConfig.group = removeError(edLevelGroup)
                edLevelConfig.minHeight = 300
                edLevelConfig.aspectRatio = 3
                edLevelConfig.margins = {top: 10, left: 100, right: 30, bottom: 130}
                edLevelConfig.colors = ["#108b52"]
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
                var gradegroup = removeEmptyBins(gradeConfig.dim.group().reduce(highEdAdd, highEdRemove, highEdInitial))
                gradeConfig.group = removeError(gradegroup)
                gradeConfig.minHeight = 280
                gradeConfig.aspectRatio = 5
                gradeConfig.margins = {top: 30, left: 20, right: 30, bottom: 50}
                gradeConfig.colors = d3.scale.category10()

                var gradeChart = dchelpers.getRowChart(gradeConfig)
                
                gradeChart
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
                var cafscGroup = removeEmptyBins(cafscConfig.dim.group().reduce(highEdAdd, highEdRemove, highEdInitial))
                cafscConfig.group = removeError(cafscGroup)
                cafscConfig.minHeight = 400
                cafscConfig.aspectRatio = 3
                cafscConfig.margins = {top: 10, left: 20, right: 20, bottom: 200}
                cafscConfig.colors = ["#333cff"]
                var cafscChart = dchelpers.getOrdinalBarChart(cafscConfig)
                cafscChart
                    .valueAccessor(function(d) {return d.value.totalCount;})
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-cafsc-barchart')
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

                var percentGroup = this.ndx.groupAll().reduce(highEdAdd,highEdRemove,highEdInitial)
                var percentND = dc.numberDisplay("#totalPercent")
                percentND.group(percentGroup)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.stemPercent})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
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

<style src="../../../node_modules/dc/dc.css">
</style>
<style scoped>
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