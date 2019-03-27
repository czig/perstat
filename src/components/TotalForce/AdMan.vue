<template>
    <div class="container-fluid">
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
                        <button type="button" id="showMyFilters"
                                class="btn btn-info btn-rounded btn-sm waves-effect"
                                title="Filter">
                        <p class="d-none d-md-inline">Filter&nbsp;&nbsp;</p>   
                        <FontAwesomeIcon icon="filter" 
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
                                @click="resetAll">
                        <p class="d-none d-md-inline">Reset All&nbsp;&nbsp;</p>  
                        <FontAwesomeIcon icon="redo-alt" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button>                         
                    </div>
                </div>
                <div class="row">
                    <div id="type" class="col-xl-4 col-lg-5 col-md-5 col-sm-12 col-12">
                        <div id="dc-type-rowchart">
                            <h3>Type <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-type-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="grade" class="col-xl-8 col-lg-7 col-md-7 col-sm-12 col-12">
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
<!--                 <largeBarChart :id="'majcom'"         
                               :dimension="majcomDim"
                               :group="removeError(majcomGroup)"
                               :widthFactor="0.90"
                               :aspectRatio="3"
                               :minHeight="300"
                               :reducer="tfAdd"
                               :accumulator="tfInitial"
                               :numBars="30"
                               :margin="chartSpecs.majcomChart.margins"
                               :colorScale="majcomColorScale"
                               :title="'MAJCOM'"
                               :loaded="loaded">
                </largeBarChart> -->
                <overviewBarChart 
                    :id="'majcom'"
                    :dimension="majcomDim"
                    :aspectRatio="chartSpecs.majcomChart.aspectRatio"
                    :minHeight="chartSpecs.majcomChart.minHeight"
                    :normalToOverviewFactor="1.5"
                    :selected="selected"
                    :ylabel="ylabel"
                    :reducerAdd="tfAdd"
                    :reducerRemove="tfRemove"
                    :accumulator="tfInitial"
                    :numBars="15"
                    :margin="chartSpecs.majcomChart.margins"
                    :colorScale="majcomColorScale"
                    :title="'MAJCOM'"
                    :loaded="loaded">
                </overviewBarChart>                
<!--                  <largeBarChart :id="'base'"         
                               :dimension="baseDim"
                               :group="removeError(baseGroup)"
                               :widthFactor="0.90"
                               :aspectRatio="3"
                               :minHeight="300"
                               :reducer="tfAdd"
                               :accumulator="tfInitial"
                               :numBars="30"
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
                    :reducerAdd="tfAdd"
                    :reducerRemove="tfRemove"
                    :accumulator="tfInitial"
                    :numBars="15"
                    :margin="chartSpecs.baseChart.margins"
                    :colorScale="baseColorScale"
                    :title="'Servicing MPF'"
                    :loaded="loaded">
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
import Loader from '@/components/Loader'
import { store } from '@/store/store'
import searchBox from '@/components/searchBox'
import largeBarChart from '@/components/largeBarChart'
import overviewBarChart from '@/components/overviewBarChart'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import toastr from 'toastr'

    export default {
        data() {
            return {
                data: [],
                selected: 'percent',
                ylabel: 'Inventory',
                loaded: false,
                baseColor: chartSpecs.baseChart.color,
                pageName: 'Total Force Active Duty',
                chartSpecs: chartSpecs,
                majcomColorScale: d3.scale.ordinal().range([chartSpecs.majcomChart.color]),                
                baseColorScale: d3.scale.ordinal().range([chartSpecs.baseChart.color]),                                
                gradeChart: {},
                typeChart: {}
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
            downloadDim: function() {
                return this.ndx.dimension(function(d) {return d;});    
            },                  
            majcomDim: function() {
                return this.ndx.dimension(function(d) {return d.MAJCOM;});
            },
            majcomGroup: function() {
                //return this.majcomDim.group().reduceSum(function(d) {return d.Inventory;});
                return this.removeEmptyBins(this.majcomDim.group().reduce(this.tfAdd,this.tfRemove,this.tfInitial));
            },                      
            baseDim: function() {
                return this.ndx.dimension(function(d) {return d.MPF;});
            },
            baseGroup: function() {
                //return this.baseDim.group().reduceSum(function(d) {return d.Inventory;});
                return this.removeEmptyBins(this.baseDim.group().reduce(this.tfAdd,this.tfRemove,this.tfInitial));
            },           
            typeDim: function() {
                return this.ndx.dimension(function(d) {return d.File_Type});
            },
            typeConfig: function() {
                return {
                            'id': 'type',
                            'dim': this.typeDim,
<<<<<<< HEAD
                            'group': this.removeError(this.typeDim.group().reduceSum(function(d) {return +d.Inventory;})),
                            'minHeight': 300,
||||||| merged common ancestors
                            'group': this.removeError(this.typeDim.group().reduceSum(function(d) {return +d.Inventory;})),
                            'minHeight': 250,
=======
                            'group': this.removeEmptyBins(this.typeDim.group().reduceSum(function(d) {return +d.Inventory;})),
                            'minHeight': 250,
>>>>>>> 6f8be204e7e1468abc4a8945ce999ea7c8c130bb
                            'aspectRatio': 3,
                            'margins': {top: 0,left: 20, right: 30, bottom: 60},
                            'colors': chartSpecs.typeChart.color
   
                }
            },
            gradeDim: function() {
                return this.ndx.dimension(function(d) {return d.grade;});
            },
            gradeConfig: function() {
                return {
                            'id': 'grade',
                            'dim': this.gradeDim,
                            'group': this.removeEmptyBins(this.gradeDim.group().reduceSum(function(d) {return +d.Inventory;})),
                            'minHeight': 250,
                            'aspectRatio': 5,
                            'margins': {top: 10, left: 50, right: 30, bottom: 60},
                            'colors': this.chartSpecs.gradeChartColorScale 
                       }
            },
            pageLabel: function() {
                return this.pageName
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
            },
            tfAdd: function(p,v) {
                p = p + +v.Inventory
                //p = p/p === Infinity ? 0 : Math.round((p/p)*1000)/10 || 0
                return p
            },
            tfRemove: function(p,v) {
                p = p - +v.Inventory
                //p = p/p === Infinity ? 0 : Math.round((p/p)*1000)/10 || 0                
                return p
            },
            tfInitial: function() {
                return 0 
            },          
            //remove empty function (es6 syntax to keep correct scope)
            removeError: function(source_group) {
                return {
                    all: () => {
                        return source_group.all().filter((d) => {
                            return d.key != "error" && d.key != "**ERROR**"
                        })
                    }
                }
            },  
            //remove empty function (es6 syntax to keep correct scope)
            removeEmptyBins: function(source_group)  {
                return {
                    all: () => {
                        return source_group.all().filter((d) => {
                            return d.value != 0
                        })
                    }
                }
            },
            formatData: function(given) {
                var obj = {}

                obj.File_Type = formats.type[given.type]
                obj.grade = formats.gradeFormat[given.grade]
                obj.MAJCOM = formats.majFormat[given.maj]
                obj.MPF = formats.mpfFormat[given.mpf]
                obj.Inventory = given.freq

                return obj;
            },            
            toProperCase: function(s) {
                return s.toLowerCase().replace(/^(.)|\s(.)/g, 
                    function($1) { return $1.toUpperCase(); });
            },

            testData: function(formatted, original) {
                for (var key in formatted) {
                    if (formatted[key] === undefined){
                        console.log('Empty Value of ' + key)
                        console.log(original)
                        formatted[key] = "UNKNOWN"
                    }
                }
                return formatted;
            },

            makeObject: function(data) {
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
                    obj2 = this.formatData(obj)
                    obj2 = this.testData(obj2, obj)
                    output.push(obj2);
                }
                return output;
            },
            renderCharts: function() {

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
                //Number Display for Auth, Asgn, STP - show total for filtered content
                var inv = this.ndx.groupAll().reduceSum(function(d) { return +d.Inventory })
                var invND = dc.numberDisplay("#inv")
                invND.group(inv)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                //type 
                var typeChart = dchelpers.getRowChart(this.typeConfig)  
                typeChart.controlsUseVisibility(true)
                
                this.typeChart = typeChart

                 //grade
                var gradeChart = dchelpers.getOrdinalBarChart(this.gradeConfig)
                gradeChart
                    .elasticX(true)
                    .controlsUseVisibility(true)
                    .colorAccessor(function(d,i){
                        return d.key;
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            chart.filter(d);
                            dc.redrawAll();
                        })
                    })
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })  
                    .yAxis().tickFormat(function(v) {return v + "%";})


                this.gradeChart = gradeChart


                //Curent Filters button
                d3.select('#showMyFilters')
                  .on('click', ()=>{
                    var myFilters = this.toProperCase(this.pageLabel) + ' filters ';

                    dc.chartRegistry.list().forEach((d)=>{                    
                    //console.log("d.filter(): "+d.filter())
                    //if (d.hasFilter()) {console.log("d.filter(): "+d.filters())}
                    if (d.hasFilter() && d.anchor()!='#dc-overviewmajcom-barchart' && d.anchor()!='#dc-overviewbase-barchart') {
                        //console.log(d.anchor(), d.filters())
                        myFilters += '\n (' + d.filters() + ')'
                    } 
                    })
                    if (myFilters !== undefined) {
                      var counterVars = inv;
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
                  });

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

                    FileSaver.saveAs(blob, 'PERSTAT TF Active Duty' + ' ' + store.state.asDate + myFilters + ' .csv');
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
        components: {
            'loader': Loader,
            searchBox,
            FontAwesomeIcon,
            largeBarChart,
            overviewBarChart
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
            axios.post(axios_url_adman).then(response => {
                //console.log(response)
                store.state.asDate = response.data.ASOFDATE
                var axiosData = response.data.data
                //console.log(axiosData)
                var objData = this.makeObject(axiosData)
                this.data = objData
                this.loaded = true
                this.renderCharts()
            }).catch(console.error)
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
#type, #grade, #majcom, #base {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
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
