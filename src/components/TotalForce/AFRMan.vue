<template>
    <div class="container">
       <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" id="loader" key="loader"></loader>
            <div v-show="loaded" id="content" key="content">
                <div class="row">
                    <div class="col-auto">
                        Inventory:
                        <span id="inv"></span>
                    </div>
                    <div class="col"></div>
                    <div class="col-auto">
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect" 
                                >Download Raw Data</button>
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect" 
                                @click="resetAll">Reset All</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <div class="row">
                            <div id="type" class="col-12">
                                <div id="dc-type-rowchart">
                                    <h3>Type <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-type-rowchart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="grade" class="col-8">
                        <div id="dc-grade-barchart">
                            <h3> Grade/Rank <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-grade-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="empcat" class="col-12">
                        <div id="dc-empcat-barchart">
                            <h3>EMPLOYEE CATEGORY <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-empcat-barchart')">Reset</button>
                            </h3>
                            <searchBox
                                v-model="searchEMPCAT"
                                size="3"
                                label="Search Employee Category"
                                @sub="submit(searchEMPCAT,'dc-empcat-barchart')"
                                button="true"
                            ></searchBox>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="majcom" class="col-12">
                        <div id="dc-majcom-barchart">
                            <h3>MAJCOM <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-majcom-barchart')">Reset</button>
                            </h3>
                            <searchBox
                                v-model="searchMajcom"
                                size="3"
                                label="Search MAJCOM"
                                @sub="submit(searchMajcom,'dc-majcom-barchart')"
                                button="true"
                            ></searchBox>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="base" class="col-12">
                        <div id="dc-base-barchart">
                            <h3>Installation <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-base-barchart')">Reset</button>
                            </h3>
                            <searchBox
                                v-model="searchBase"
                                size="3"
                                label="Search Installation"
                                @sub="submit(searchBase,'dc-base-barchart')"
                                button="true"
                                :color="baseColor"
                                :btnColor="baseColor"
                            ></searchBox>
                        </div>
                    </div>
                </div>
                <!--<div class ="row">-->
                    <!--<div id="majcom-chart-wrapper" class="col-12"></div>-->
                <!--</div>-->
            </div>
        </transition-group>
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

    export default {
        data() {
            return {
                data: [],
                searchMajcom: '',
                searchBase: '',
                searchEMPCAT: '',
                selected: "percent",
                ylabel: 'Inventory',
                loaded: false,
                baseColor: chartSpecs.baseChart.color,
                majcomColor: chartSpecs.majcomChart.color,
            }
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          asDate: function(){
            return store.state.asDate;
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
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
            'loader': Loader,
            searchBox
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')       
            $('[data-toggle="tooltip"]').tooltip({delay: {"show":100, "hide":100}})
            //TEST AXIOS CALL:
            axios.post(axios_url_afrman).then(response => {
                //console.log(response)
                store.state.asDate = response.data.ASOFDATE
                var axiosData = response.data.data
                //console.log(axiosData)
                var objData = makeObject(axiosData)
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
                    var obj2 = {};
                    obj2 = formatData(obj)
                    obj2 = testData(obj2, obj)
                    output.push(obj2);
                }
                return output;
            }

            var formatData = (given) =>{
                var obj = {}

                obj.File_Type = formats.type[given.type]
                obj.Grade = formats.gradeFormat[given.grade]
                obj.MAJCOM = formats.majFormat[given.maj]
                obj.MPF = formats.mpfFormat[given.mpf]
                obj.Inventory = given.freq
                obj.empcat = given.afr_cat

                return obj;
            }

            var testData = (formatted, original) =>{
                for (var key in formatted) {
                    if (formatted[key] === undefined){
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

                //console.log(this.data[0])

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
                                return d.value != 0
                            })
                        }
                    }
                }

                //remove empty function (es6 syntax to keep correct scope)
                var removeEmptyBins = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.value.inventory != 0
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
                

                //type 
                var typeConfig = {};
                typeConfig.id = 'type'
                typeConfig.dim = this.ndx.dimension(function (d) {
                    return d.File_Type;
                })
                var typeGroup = removeEmptyBins(typeConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                typeConfig.group = removeError(typeGroup)
                typeConfig.minHeight = 200 
                typeConfig.aspectRatio = 3
                typeConfig.margins = {top: 0, left: 30, right: 30, bottom: 25}
                typeConfig.colors = d3.scale.category10()
                var typeChart = dchelpers.getRowChart(typeConfig)   

                //EMPCAT
                var empcatConfig = {}
                empcatConfig.id = 'empcat'
                empcatConfig.dim = this.ndx.dimension(function(d){return d.empcat})
                var empcatGroup = removeEmptyBins(empcatConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                empcatConfig.group = removeError(empcatGroup)
                empcatConfig.minHeight = 300
                empcatConfig.aspectRatio = 3
                empcatConfig.margins = {top: 30, left: 50, right: 30, bottom: 100}
                empcatConfig.colors = ["#FF8C00"]
                var empcatChart = dchelpers.getOrdinalBarChart(empcatConfig)
                empcatChart
                    .elasticX(true)
                    //.ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                             .attr('transform', 'translate(-8,0)rotate(-45)')
                             .on('click', (d)=>{
                                this.submit(d, 'dc-empcat-barchart')
                             })
                    })
                

                //MAJCOM
                var majcomConfig = {}
                majcomConfig.id = 'majcom'
                majcomConfig.dim = this.ndx.dimension(function(d){return d.MAJCOM})
                var majcomPercent = majcomConfig.dim.group().reduceSum(function(d){
                    return +d.Inventory 
                })
                var majcomGroup = removeEmptyBins(majcomConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                majcomConfig.group = removeError(majcomGroup)
                majcomConfig.minHeight = chartSpecs.majcomChart.minHeight 
                majcomConfig.aspectRatio = chartSpecs.majcomChart.aspectRatio 
                majcomConfig.margins = chartSpecs.majcomChart.margins 
                majcomConfig.colors = [chartSpecs.majcomChart.color]
                var majcomChart = dchelpers.getOrdinalBarChart(majcomConfig)
                majcomChart
                    .elasticX(true)
                    .ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                             .attr('transform', 'translate(-8,0)rotate(-45)')
                             .on('click', (d)=>{
                                this.submit(d, 'dc-majcom-barchart')
                             })
                    })

                //base(mpf)
                var baseConfig = {}
                baseConfig.id = 'base'
                baseConfig.dim = this.ndx.dimension(function(d){return d.MPF})
                var baseGroup = removeEmptyBins(baseConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                baseConfig.group = removeError(baseGroup)
                baseConfig.minHeight = chartSpecs.baseChart.minHeight 
                baseConfig.aspectRatio = chartSpecs.baseChart.aspectRatio 
                baseConfig.margins = chartSpecs.baseChart.margins 
                baseConfig.colors = [chartSpecs.baseChart.color]
                var baseChart = dchelpers.getOrdinalBarChart(baseConfig)
                baseChart
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                             .attr('transform', 'translate(-9,0)rotate(-45)')
                             .on('click', (d)=>{
                                 this.submit(d, 'dc-base-barchart')
                             })
                    })

                //Number Display for Auth, Asgn, STP - show total for filtered content
                var inv = this.ndx.groupAll().reduceSum(function(d) { return +d.Inventory })
                var invND = dc.numberDisplay("#inv")
                invND.group(inv)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })


                 //grade
                var gradeConfig = {}
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function(d){
                    return d.Grade;
                })
                var gradeGroup = removeEmptyBins(gradeConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                gradeConfig.group = removeError(gradeGroup)
                gradeConfig.minHeight = 200
                gradeConfig.aspectRatio = 2.6
                gradeConfig.margins = {top: 10, left: 45, right: 30, bottom: 110}
                gradeConfig.colors = ["#108b52"]
                var gradeChart = dchelpers.getOrdinalBarChart(gradeConfig)
                gradeChart
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-grade-barchart')
                        })
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})

                gradeChart
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })  

                //Download Raw Data button
                d3.select('#download')
                .on('click', ()=>{
                    var data = typeConfig.dim.top(Infinity);
                    var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});

                    var myFilters = '';
                    dc.chartRegistry.list().forEach((d)=>{
                        if (d.filters()[0])
                            myFilters += ' (' + d.filters() + ')'
                    })

                    FileSaver.saveAs(blob, 'PERSTAT ' + this.pageName + ' ' + store.state.asDate + myFilters + ' .csv');
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
