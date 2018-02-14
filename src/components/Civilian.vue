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
                            <div id="age" class="col-6">
                                <div id="dc-age-piechart">
                                    <h3>Age <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-age-piechart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                            <div id="gender" class="col-6">
                                <div id="dc-gender-piechart">
                                    <h3>Gender <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-gender-piechart')">Reset</button>
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
                                color="#dfaf00"
                                btnColor="#dfaf00"
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
                loaded: false 

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

                //Number Display for sel, elig, sel rate - show total for filtered content
                var numberGroup = this.ndx.groupAll().reduceSum(function(d) {return d.count;})
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
                    return formats.careerFieldFormat[d.career_field];
                })
                careerFieldConfig.group = careerFieldConfig.dim.group().reduceSum(function(d) {return d.count;})
                careerFieldConfig.minHeight = 260
                careerFieldConfig.aspectRatio = 5
                careerFieldConfig.margins = {top: 30, left: 40, right: 30, bottom: 110}
                careerFieldConfig.colors = ["#108b52"]
                var careerFieldChart = dchelpers.getOrdinalBarChart(careerFieldConfig)
                careerFieldChart
                    .elasticX(true)
                    .on('pretransition', function(chart) {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})

                    
                //grade
                var gradeConfig = {};
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return d.grade.substr(0,2);
                })
                gradeConfig.group = gradeConfig.dim.group().reduceSum(function(d) {return d.count;})
                gradeConfig.minHeight = 400 
                gradeConfig.aspectRatio = 1
                gradeConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                gradeConfig.colors = d3.scale.category10()
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                gradeChart
                    .cap(10)
                    .othersLabel("Other")

                //age piechart
                var ageConfig = {}
                ageConfig.id = 'age'
                ageConfig.dim = this.ndx.dimension(function(d) {
                    return d.age + '-' + String(+d.age + 9);
                })
                ageConfig.group = ageConfig.dim.group().reduceSum(function(d) {return d.count;})
                ageConfig.minHeight = 150 
                ageConfig.aspectRatio = 2 
                ageConfig.radius = 100
                ageConfig.innerRadius = 20
                ageConfig.externalLabels = 20 
                ageConfig.externalRadiusPadding = 30
                var ageChart = dchelpers.getPieChart(ageConfig)
                ageChart
                    .slicesCap(4)
//                    .on('pretransition',function(chart) {
//                        chart.selectAll('text.pie-slice').text(function(d) {
//                            return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) *100) + '%';
//                        })
//                    })

                //gender piechart
                var genderConfig = {}
                genderConfig.id = 'gender'
                genderConfig.dim = this.ndx.dimension(function(d) {
                    return d.gender;
                })
                genderConfig.group = genderConfig.dim.group().reduceSum(function(d) {return d.count;})
                genderConfig.minHeight = 150 
                genderConfig.aspectRatio = 2 
                genderConfig.radius = 70 
                genderConfig.innerRadius = 0
                genderConfig.externalLabels = 0 
                genderConfig.externalRadiusPadding = 0
                var genderChart = dchelpers.getPieChart(genderConfig)
                genderChart
                    .slicesCap(2)
//                    .on('pretransition',function(chart) {
//                        chart.selectAll('text.pie-slice').text(function(d) {
//                            return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) *100) + '%';
//                        })
//                    })

                //Majcom
                var majcomConfig = {}
                majcomConfig.id = 'majcom'
                majcomConfig.dim = this.ndx.dimension(function(d){return formats.majFormat[d.majcom]})
                var majcomPercent = majcomConfig.dim.group().reduceSum(function(d) {return d.count;})
                majcomConfig.group = removeEmptyBins(majcomPercent)
                majcomConfig.minHeight = 300
                majcomConfig.aspectRatio = 5
                majcomConfig.margins = {top: 30, left: 40, right: 30, bottom: 100}
                majcomConfig.colors = ["#1976d2"]
                var majcomChart = dchelpers.getOrdinalBarChart(majcomConfig)
                majcomChart
                    .elasticX(true)
                    .ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', function(chart) {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })

                //base(mpf)
                var baseConfig = {}
                baseConfig.id = 'base'
                baseConfig.dim = this.ndx.dimension(function(d){return formats.mpfFormat[d.mpf]})
                var basePercent = baseConfig.dim.group().reduceSum(function(d) {return d.count;})
                baseConfig.group = removeEmptyBins(basePercent)
                baseConfig.minHeight = 400
                baseConfig.aspectRatio = 5
                baseConfig.margins = {top: 30, left: 110, right: 30, bottom: 200}
                baseConfig.colors = ["#dfaf00"]
                var baseChart = dchelpers.getOrdinalBarChart(baseConfig)
                baseChart
                    .elasticX(true)
                    .on('pretransition', function(chart) {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
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
