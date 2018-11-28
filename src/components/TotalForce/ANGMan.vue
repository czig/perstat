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
                                            style="visibility: hidden"
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
                                    style="visibility: hidden"
                                    @click="resetChart('dc-grade-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="empCat" class="col-12">
                        <div id="dc-empCat-barchart">
                            <h3>EMPLOYEE CATEGORY <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-empCat-barchart')">Reset</button>
                            </h3>
                            <searchBox
                                v-model="searchempCat"
                                size="3"
                                label="Search Employee Category"
                                @sub="submit(searchempCat,'dc-empCat-barchart')"
                                button="true"
                            ></searchBox>
                        </div>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div id="us" class="col-12">
                        <div id="dc-us-geoChoroplethChart">
                            <h3>US Map <span style="font-size: 14pt; opacity: 0.87; text-align: center;"></span>
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
import Loader from '@/components/Loader'
import { store } from '@/store/store'
import searchBox from '@/components/searchBox'
import largeBarChart from '@/components/largeBarChart'

    export default {
        data() {
            return {
                data: [],
                searchempCat: '',
                selected: "percent",
                ylabel: 'Inventory',
                loaded: false,
/*                 baseColor: chartSpecs.baseChart.color, */
                chartSpecs: chartSpecs,
                baseColor: chartSpecs.baseChart.color,
                baseLen: 0,
                baseHasFilter: false,
                showBase: false

/*                 stateColorScale: d3.scale.ordinal().range([chartSpecs.stateChart.color]), */
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
/*             stateDim: function() {
                return this.ndx.dimension(function(d) {return d.state;});
            },
            stateGroup: function() {
                return this.stateDim.group().reduceSum(function(d) {return d.Inventory;});
            }                        
 */
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
          },
          angAdd: function(p,v) {
              return p + v
          },
          angRemove: function(p,v) {
              return p - v
          },
          angInitial: function() {
            return 0;
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
               

        },
        components: {
            'loader': Loader,
            searchBox,
            largeBarChart
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
            axios.post(axios_url_angman).then(response => {
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
                    //obj2 = testData(obj2, obj) 
                    output.push(obj2);
                }
                return output;
            }

            var formatData = (given) =>{
                var obj = {}

                obj.File_Type = formats.type[given.type]
                obj.Grade = formats.gradeFormat[given.grade]
                obj.MAJCOM = formats.majFormat[given.maj]
                obj.Inventory = given.freq
                obj.empCat = given.empcat
                obj.state = given.state

                return obj;
            }

/*             var testData = (formatted, original) =>{
                for (var key in formatted) {
                    if (formatted[key] === undefined){
                        console.log('Empty Value of ' + key)
                        console.log(original)
                        formatted[key] = "UNKNOWN"
                    }
                }
                return formatted;
            }
 */
            var renderCharts = () => {
                dc.dataCount(".dc-data-count")
                  .dimension(this.ndx)
                  .group(this.allGroup)

                //console.log(this.data[0])
                //reduce functions

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
                var removeError = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.key != "**ERROR**"
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
                typeConfig.group = typeConfig.dim.group().reduceSum(function(d) {return +d.Inventory;})
                typeConfig.minHeight = chartSpecs.typeChart.minHeight
                typeConfig.aspectRatio = chartSpecs.typeChart.aspectRatio
                typeConfig.margins = chartSpecs.typeChart.margins
                typeConfig.colors = chartSpecs.typeChart.color
                var typeChart = dchelpers.getRowChart(typeConfig)   
                typeChart.controlsUseVisibility(true)

                //empCat
                var empCatConfig = {}
                empCatConfig.id = 'empCat'
                empCatConfig.dim = this.ndx.dimension(function(d){return d.empCat})
                var empCatGroup = removeEmptyBins(empCatConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                empCatConfig.group = removeError(empCatGroup)
                empCatConfig.minHeight = chartSpecs.empCatChart.minHeight
                empCatConfig.aspectRatio = chartSpecs.empCatChart.aspectRatio
                empCatConfig.margins = chartSpecs.empCatChart.margins
                empCatConfig.colors = [chartSpecs.empCatChart.color]
                var empCatChart = dchelpers.getOrdinalBarChart(empCatConfig)
                empCatChart
                    .elasticX(true)
                    .controlsUseVisibility(true)
                    //.ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                             .attr('transform', 'translate(-8,0)rotate(-45)')
                             .on('click', (d)=>{
                                this.submit(d, 'dc-empCat-barchart')
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
                gradeConfig.group = removeEmptyBins(gradeConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                gradeConfig.minHeight = 250
                gradeConfig.aspectRatio = 3
                gradeConfig.margins = {top: 10, left: 50, right: 30, bottom: 70}
                var c = d3.rgb(51,172,255)
                var gradeChart = dchelpers.getOrdinalBarChart(gradeConfig)
                gradeChart
                    .elasticX(true)
                    .colorAccessor(function(d){
                        return d.key;
                    })
                    .controlsUseVisibility(true)
                    .colors(d3.scale.ordinal().domain(["[01-02] LT", "CPT", "MAJ", "LTC", "COL", "BG", "MG", "LTG", "[31-33] AMN", "SRA", "SSG", "TSG", "MSG", "SMS", "CMS"])
                    .range([c.brighter(1).toString(), c.brighter(0.8).toString(), c.brighter(0.7).toString(), 
                                            c.brighter(0.6).toString(), c.brighter(0.5).toString(), c.brighter(0.4).toString(),  
                                            c.brighter(0.3).toString(), c.brighter(0.2).toString(), c.brighter(0.1).toString(), c.toString(),
                                            c.darker(0.2).toString(), c.darker(0.4).toString(), c.darker(0.6).toString(), c.darker(0.8).toString(), 
                                            c.darker(0.9).toString()]))
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

                //CONUS 
                var usConfig = {}
                usConfig.id = 'us';
                usConfig.dim = this.ndx.dimension(function(d){
                    return d.state;
                })
                usConfig.group = removeError(usConfig.dim.group().reduceSum(function(d) {return +d.Inventory;}))
                usConfig.scale = 1
                usConfig.minHeight = 200
                usConfig.aspectRatio = 2.1 
                usConfig.xRatio = 2.0
                usConfig.yRatio = 2.0 
                usConfig.colors = d3.scale.quantize().range(["#E2F2FF","#d4eafc","#C4E4FF","#badefc","#a6d4fc","#9ED2FF","#81C5FF","#75bfff","#6BBAFF","#51AEFF","#40a4f9","#36A2FF","#2798f9","#1E96FF","#0089FF","#0061B5"])
                usConfig.valueAccessor = function(d) {
                    if (d.value) {
                        return d.value
                    }
                }
                usConfig.colorAccessor = function(d) {
                    if (d) {
                        return d;   
                    } else {
                        return 0;
                    }
                }
            
                var statesJson = require('../../assets/geoUS.json')
                usConfig.json = statesJson
                usConfig.geoName = "state"
                usConfig.propName = 'name' 
                usConfig.projection = d3.geo.albersUsa()

                var usChart = dchelpers.getGeoChart(usConfig)
                usChart.title(function(d) {
                    return formats.geoCS[formats.stateFormat[d.key]] + ": " + d.value ;
                });
                usChart.controlsUseVisibility(true);


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
