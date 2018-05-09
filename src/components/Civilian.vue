<template>
    <div class="container">
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
                    <div class="col-8">
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
                            <div id="age" class="col-4">
                                <div id="dc-age-rowchart">
                                    <h3>Age <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-age-rowchart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                            <div id="gender" class="col-4">
                                <div id="dc-gender-piechart">
                                    <h3>Gender <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-gender-piechart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                            <div id="prior" class="col-4">
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
                                v-model:value="searchMajcom"
                                size="3"
                                label="Search MAJCOM"
                                @sub="submit(searchMajcom,'dc-majcom-barchart')"
                                button="true"
                                :color="majcomColor"
                                :btnColor="majcomColor"
                            ></searchBox>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="base" class="col-12">
                        <div id="dc-base-barchart">
                            <h3>Base <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-base-barchart')">Reset</button>
                            </h3>
                            <searchBox
                                v-model:value="searchBase"
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
                searchMajcom: "",
                searchBase: "",
                loaded: false,
                baseColor: chartSpecs.baseChart.color,
                majcomColor: chartSpecs.majcomChart.color
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
            'autocomplete': AutoComplete,
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
                careerFieldConfig.group = careerFieldConfig.dim.group().reduceSum(function(d) {return d.Inventory;})
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
                            this.submit(d, 'dc-careerField-barchart')
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
                gradeConfig.minHeight = 400 
                gradeConfig.aspectRatio = 1
                gradeConfig.margins = {top: 0, left: 30, right: 30, bottom: 20}
                gradeConfig.colors = d3.scale.category10()
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

                //Majcom
                var majcomConfig = {}
                majcomConfig.id = 'majcom'
                majcomConfig.dim = this.ndx.dimension(function(d){return d.MAJCOM })
                var majcomPercent = majcomConfig.dim.group().reduceSum(function(d) {return d.Inventory;})
                majcomConfig.group = removeEmptyBins(majcomPercent)
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
                baseConfig.dim = this.ndx.dimension(function(d){return d.MPF })
                var basePercent = baseConfig.dim.group().reduceSum(function(d) {return d.Inventory;})
                baseConfig.group = removeEmptyBins(basePercent)
                baseConfig.minHeight = chartSpecs.baseChart.minHeight 
                baseConfig.aspectRatio = chartSpecs.baseChart.aspectRatio 
                baseConfig.margins = chartSpecs.baseChart.margins 
                baseConfig.colors = [chartSpecs.baseChart.color]
                var baseChart = dchelpers.getOrdinalBarChart(baseConfig)
                baseChart
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-base-barchart')
                        })
                    })

                //Download Raw Data button
                d3.select('#download')
                .on('click', ()=>{
                    var data = majcomConfig.dim.top(Infinity);
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
