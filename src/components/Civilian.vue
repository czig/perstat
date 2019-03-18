<template>
    <div class="container-fluid">
        <div class="row">
            <h1 class="col">Civilian</h1>
            <div class="col-4 text-right" style="margin-top:15px;">
                        Data as of: 
                        <span style="font-weight:bold;color:#4d8bf9"> {{asDate}} </span>
            </div>
        </div>
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
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
                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-3">
                        <div class="row">
                            <div id="grade" class="col-12">
                                <div id="dc-grade-rowchart">
                                    <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-grade-rowchart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-8 col-lg-8 col-md-8 col-sm-9">
                        <div class="row">
                            <div id="careerField" class="col-12">
                                <div id="dc-careerField-barchart">
                                    <h3>Career Field <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-careerField-barchart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                            <div id="age" class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                                <div id="dc-age-rowchart">
                                    <h3>Age <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-age-rowchart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                            <div id="gender" class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                                <div id="dc-gender-piechart">
                                    <h3>Gender <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-gender-piechart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                            <div id="prior" class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
                                <div id="dc-prior-rowchart">
                                    <h3>Prior Military Service <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-prior-rowchart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
<!--                 <largeBarChart :id="'majcom'"         
                               :dimension="majcomDim"
                               :group="majcomGroup"
                               :widthFactor="0.90"
                               :aspectRatio="chartSpecs.majcomChart.aspectRatio"
                               :minHeight="chartSpecs.majcomChart.minHeight"
                               :ylabel="ylabel"
                               :reducer="inventoryAdd"
                               :accumulator="inventoryInitial"
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
                    :normalToOverviewFactor="2.5"
                    :ylabel="ylabel"
                    :reducerAdd="inventoryAdd"
                    :reducerRemove="inventoryRemove"
                    :accumulator="inventoryInitial"
                    :numBars="15"
                    :margin="chartSpecs.majcomChart.margins"
                    :colorScale="majcomColorScale"
                    :title="'MAJCOM'"
                    :loaded="loaded">
                </overviewBarChart>
<!--                  <largeBarChart :id="'loc'"         
                               :dimension="locDim"
                               :group="locGroup"
                               :widthFactor="0.90"
                               :aspectRatio="chartSpecs.baseChart.aspectRatio"
                               :minHeight="chartSpecs.baseChart.minHeight"
                               :ylabel="ylabel"
                               :reducer="inventoryAdd"
                               :accumulator="inventoryInitial"
                               :numBars="30"
                               :margin="chartSpecs.baseChart.margins"
                               :colorScale="locColorScale"
                               :title="'Servicing MPF'"
                               :loaded="loaded">
                </largeBarChart> -->
                <overviewBarChart 
                    :id="'loc'"
                    :dimension="locDim"
                    :aspectRatio="chartSpecs.baseChart.aspectRatio"
                    :minHeight="chartSpecs.baseChart.minHeight"
                    :normalToOverviewFactor="2.5"
                    :ylabel="ylabel"
                    :reducerAdd="inventoryAdd"
                    :reducerRemove="inventoryRemove"
                    :accumulator="inventoryInitial"
                    :numBars="15"
                    :margin="chartSpecs.baseChart.margins"
                    :colorScale="locColorScale"
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
import AutoComplete from '@/components/AutoComplete'
import searchBox from '@/components/searchBox'
import Loader from '@/components/Loader'
import { store } from '@/store/store'
import largeBarChart from '@/components/largeBarChart'
import overviewBarChart from '@/components/overviewBarChart'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import toastr from 'toastr'

    export default {
        data() {
            return {
                data: [],
                searchMajcom: "",
                searchBase: "",
                loaded: false,
                baseColor: chartSpecs.baseChart.color,
                pageName: 'Civilian',
                majcomColor: chartSpecs.majcomChart.color,
                chartSpecs: chartSpecs,
                locColorScale: d3.scale.ordinal().range([chartSpecs.baseChart.color]),
                majcomColorScale: d3.scale.ordinal().range([chartSpecs.majcomChart.color])
            }
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          asDate: function() {
            return store.state.asDate;
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
          ylabel: function() {
            return "Inventory"
          },
          downloadDim: function() {
            return this.ndx.dimension(function(d) {return d;});    
          },      
          locDim: function() {
              return this.ndx.dimension(d => d.MPF);
          },
          locGroup: function() {
              //return this.locDim.group().reduceSum(function(d) {return d.Inventory;}) 
              return this.removeError(this.locDim.group().reduce(this.inventoryAdd,this.inventoryRemove,this.inventoryInitial));
          },
          majcomDim: function() {
              return this.ndx.dimension(d => d.MAJCOM);
          },
          majcomGroup: function() {
              //return this.majcomDim.group().reduceSum(function(d) {return d.Inventory;}) 
              return this.removeError(this.majcomDim.group().reduce(this.inventoryAdd,this.inventoryRemove,this.inventoryInitial));
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
          inventoryAdd: function(p,v) {
              return p = p + v.Inventory
          },
          inventoryRemove: function(p,v) {
              return p = p - v.Inventory
          },
          inventoryInitial: function() {
            return 0;
          },
          toProperCase: function(s) {
            return s.toLowerCase().replace(/^(.)|\s(.)/g, 
              function($1) { return $1.toUpperCase(); });
          }
        },
        components: {
            'autocomplete': AutoComplete,
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
            
            //TEST AXIOS CALL:
            axios.post(axios_url_civ_inv).then(response => {
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
                    obj2 = testData(obj2, obj)
                   
                    // if (obj2.MAJCOM == "UNKNOWN"){
                    //     console.log('UNKNOWN MAJCOM')
                    //     console.log(obj)
                    //     console.log(obj2)
                    // }
                  
                    output.push(obj2);
                }
                return output;
            }

            var formatData = (given) =>{
                var obj = {}

                obj.Grade = formats.gradeFormat[given.grade]
                obj.MAJCOM = formats.majFormat[given.majcom]
                obj.Career_Field = formats.careerFieldFormat[given.career_field]
                obj.Age_Group = given.AgeGroup + '-' + String(+given.AgeGroup + 9);
                obj.MPF = formats.mpfFormat[given.mpf]
                obj.Gender = given.Gender
                obj.Prior_Military = formats.prior_mil[given.prior_mil]
                obj.Inventory = given.count

                return obj;
            }

            var testData = (formatted, original) =>{
                for (var key in formatted) {
                    if (formatted[key] === undefined){
                        // console.log('Empty Value of ' + key)
                        // console.log(original)
                        formatted[key] = "UNKNOWN"
                    }
                }
                return formatted;
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

                //Number Display for sel, elig, sel rate - show total for filtered content
                var numberGroup = this.ndx.groupAll().reduceSum(function(d) {return d.Inventory;})
                var invND = dc.numberDisplay("#inv")
                invND.group(numberGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })

                //Career Field
                var careerFieldConfig = {}
                careerFieldConfig.id = 'careerField'
                careerFieldConfig.dim = this.ndx.dimension(function(d){
                    return d.Career_Field;
                })
                careerFieldConfig.group = removeEmptyBins(careerFieldConfig.dim.group().reduceSum(function(d) {return d.Inventory;}))
                careerFieldConfig.minHeight = 200
                careerFieldConfig.aspectRatio = 3
                careerFieldConfig.margins = {top: 10, left: 45, right: 30, bottom: 110}
                careerFieldConfig.colors = ["#108b52"]
                var careerFieldChart = dchelpers.getOrdinalBarChart(careerFieldConfig)
                careerFieldChart
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

                    
                //grade
                var gradeConfig = {};
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return d.Grade;
                })
                gradeConfig.group = gradeConfig.dim.group().reduceSum(function(d) {return d.Inventory;})
                gradeConfig.minHeight = 450 
                gradeConfig.aspectRatio = 1
                gradeConfig.margins = {top: 0, left: 30, right: 30, bottom: 20}
                var c = d3.rgb(51,172,255)
                gradeConfig.colors = d3.scale.ordinal().range([c.brighter(1).toString(), c.brighter(0.9).toString(), c.brighter(0.8).toString(), 
                                            c.brighter(0.7).toString(), c.brighter(0.6).toString(), c.brighter(0.5).toString(), c.brighter(0.4).toString(), 
                                            c.brighter(0.3).toString(), c.brighter(0.2).toString(), c.brighter(0.1).toString(), c.darker(0.1).toString(), 
                                            c.darker(0.2).toString(), c.darker(0.3).toString(), c.darker(0.4).toString(), c.darker(0.5).toString(), 
                                            c.darker(0.6).toString(), c.darker(0.7).toString()])

                var gradeChart = dchelpers.getRowChart(gradeConfig)
                gradeChart
                .ordering(d=>{
                    return formats.civGradeOrder[d.key]
                })

                //age
                var ageConfig = {}
                ageConfig.id = 'age'
                ageConfig.dim = this.ndx.dimension(function(d) {
                    return d.Age_Group;
                })
                ageConfig.group = ageConfig.dim.group().reduceSum(function(d) {return d.Inventory;})
                ageConfig.minHeight = 150 
                ageConfig.aspectRatio = 2
                ageConfig.margins = {top: 0, left: 30, right: 30, bottom: 20}
                var c = d3.rgb("coral")
                ageConfig.colors = d3.scale.ordinal().range([c.brighter(1).toString(),c.brighter(0.7).toString(), c.brighter(0.3).toString(), c.toString(),c.darker(0.3).toString(),c.darker(0.6).toString()])
                var ageChart = dchelpers.getRowChart(ageConfig)
                ageChart
                    .ordering((d)=>{ return d.key })


                //gender piechart
                var genderConfig = {}
                genderConfig.id = 'gender'
                genderConfig.dim = this.ndx.dimension(function(d) {
                    return d.Gender;
                })
                genderConfig.group = genderConfig.dim.group().reduceSum(function(d) {return d.Inventory;})
                genderConfig.minHeight = 150 
                genderConfig.aspectRatio = 2 
                genderConfig.radius = 80 
                genderConfig.innerRadius = 0
                genderConfig.externalLabels = 0 
                genderConfig.externalRadiusPadding = 0
                var genderChart = dchelpers.getPieChart(genderConfig)
                genderChart
                    .slicesCap(2)
                    //uncomment following if showing percentages is necessary
//                    .on('pretransition',function(chart) {
//                        chart.selectAll('text.pie-slice').text(function(d) {
//                            return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) *100) + '%';
//                        })
//                    })

                //prior military service
                var priorConfig = {}
                priorConfig.id = 'prior'
                priorConfig.dim = this.ndx.dimension(function(d) {
                    return d.Prior_Military;
                })
                priorConfig.group = priorConfig.dim.group().reduceSum(function(d) {return d.Inventory;})
                priorConfig.minHeight = 120 
                priorConfig.aspectRatio = 3
                priorConfig.margins = {top: 0, left: 30, right: 30, bottom: 20}
                var c = d3.rgb("violet")
                priorConfig.colors = d3.scale.ordinal().range([c.brighter(0.5).toString(), c.toString(),c.darker(0.5).toString(),c.darker(1).toString()])
                var priorChart = dchelpers.getRowChart(priorConfig)

                //Curent Filters button
                d3.select('#showMyFilters')
                  .on('click', ()=>{
                    var myFilters = this.toProperCase(this.pageLabel) + ' filters ';

                    dc.chartRegistry.list().forEach((d)=>{ 
                    if (d.hasFilter() && d.anchor()!='#dc-overviewmajcom-barchart' && d.anchor()!='#dc-overviewloc-barchart') {
                        //console.log(d.anchor(), d.filters())
                        myFilters += '\n (' + d.filters() + ')'
                    } 
                    })
                    if (myFilters !== undefined) {
                      var counterVars = invND;
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

                    FileSaver.saveAs(blob, 'PERSTAT Civilian_Inventory' + ' ' + store.state.asDate + myFilters + ' .csv');
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
<!-- <style src="../../../node_modules/toastr/build/toastr.css"/> -->
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
