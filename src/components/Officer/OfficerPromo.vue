<template>
    <div class="container">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
                    <div id="radioSelect" class="col form-group">
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio" type="radio" id="radio1" value="percent" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio1">
                                Promotion Rate
                            </label>
                        </div>
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
                    <div class="col-auto">
                    </div>
                </div>
                <div class="row">
                    <div class="col-auto">
                        Selects:        
                        <span id="sel"></span>
                    </div>
                    <div class="col-auto">
                        Eligibles: 
                        <span id="elig"></span>
                    </div>
                    <div class="col-auto">
                        Promotion Rate: 
                        <span id="selRate"></span>
                    </div>
                </div>
                <div v-show='showAlert' class="alert alert-warning alert-dismissible fade show" role="alert" key="first">
                    Data prefiltered to IPZ Zone Promotion Rate
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close" style="cursor: pointer;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="row">
                    <div id="grade" class="col-4">
                        <div id="dc-grade-barchart">
                            <h3 class="mb-0">Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <!--<font-awesome-icon icon="info-circle" data-toggle="tooltip" data-placement="bottom" title="Competitive Category" style="display: inline-block;"></font-awesome-icon>-->
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-grade-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="zone" class="col-4">
                        <div id="dc-zone-rowchart">
                            <h3>Zone <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-zone-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="highestPme" class="col-4">
                        <div id="dc-highestPme-barchart">
                            <h3 class="mb-0">Highest PME <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-highestPme-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="compCat" class="col-4">
                        <div id="dc-compCat-rowchart">
                            <h3 class="mb-0">CompCat <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-compCat-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="recommend" class="col-4">
                        <div id="dc-recommend-rowchart">
                            <h3 class="mb-0">Recommendation <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                <transition>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-recommend-rowchart')">Reset</button></transition>
                            </h3>
                        </div>
                    </div>
                    <div id="pmeMethod" class="col-4">
                        <div id="dc-pmeMethod-rowchart">
                            <h3 class="mb-0">PME Method<span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-pmeMethod-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
                <largeBarChart :id="'core'"         
                               :dimension="coreDim"
                               :group="coreGroup"
                               :widthFactor="0.90"
                               :aspectRatio="chartSpecs.coreChart.aspectRatio"
                               :minHeight="chartSpecs.coreChart.minHeight"
                               :selected="selected"
                               :ylabel="ylabel"
                               :reducer="promoAdd"
                               :accumulator="promoInitial"
                               :numBars="30"
                               :margin="chartSpecs.coreChart.margins"
                               :colorScale="coreColorScale"
                               :title="'Core'"
                               :loaded="loaded">
                </largeBarChart>
                <largeBarChart :id="'board'"         
                               :dimension="boardDim"
                               :group="boardGroup"
                               :widthFactor="0.90"
                               :aspectRatio="chartSpecs.boardChart.aspectRatio"
                               :minHeight="chartSpecs.boardChart.minHeight"
                               :selected="selected"
                               :ylabel="ylabel"
                               :reducer="promoAdd"
                               :accumulator="promoInitial"
                               :numBars="30"
                               :margin="chartSpecs.boardChart.margins"
                               :colorScale="boardColorScale"
                               :title="'Board'"
                               :loaded="loaded">
                </largeBarChart>

<!--                 <div class="row">
                    <div id="board" class="col-12">
                        <div id="dc-board-barchart">
                            <h3>Board <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-board-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
 -->            </div>
        </transition-group>
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import chartSpecs from '@/chartSpecs'
import axios from 'axios'
import formats from '@/store/format'
import AutoComplete from '@/components/AutoComplete'
import Loader from '@/components/Loader'
import { store } from '@/store/store'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import largeBarChart from '@/components/largeBarChart'

    export default {
        data() {
            return {
                data: [],
                selected: "percent",
                loaded: false,
                showAlert: true,
                width: document.documentElement.clientWidth,
                chartSpecs: chartSpecs,
                coreColorScale: d3.scale.ordinal().range([chartSpecs.coreChart.color]),
                boardColorScale: d3.scale.ordinal().range([chartSpecs.boardChart.color]),
            }
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
          ylabel: function() {
            if (this.selected === "percent") {
                return "(%)"
            }
            else if (this.selected === "sel") {
                return "Selects"
            }
            else if (this.selected === "elig") {
                return "Eligibles"
            }
          },
          downloadDim: function() {
            return this.ndx.dimension(function(d) {return d;});    
          },      
          coreDim: function() {
            return this.ndx.dimension(function(d) {return d.Core;});
          },
          coreGroup: function() {
            return this.coreDim.group().reduce(this.promoAdd,this.promoRemove,this.promoInitial);
          },
          boardDim: function() {
            return this.ndx.dimension(function(d) {return d.Board;});
          },
          boardGroup: function() {
            return this.boardDim.group().reduce(this.promoAdd,this.promoRemove,this.promoInitial);
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
          promoAdd: function(p,v) {
              p.elig = p.elig + +v.elig
              p.sel = p.sel + +v.sel
              //if divide by 0, set to 0, and if NaN, set to zero
              p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
              return p
          },
          promoRemove: function(p,v) {
              p.elig = p.elig - +v.elig
              p.sel = p.sel - +v.sel
              //if divide by 0, set to 0, and if NaN, set to zero
              p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
              return p
          },
          promoInitial: function() {
              return {
                  elig: 0,
                  sel: 0,
                  percent: 0,
              }
          }
        },
        components: {
            'autocomplete': AutoComplete,
            'loader': Loader,
            FontAwesomeIcon,
            largeBarChart
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')

            
            //TEST AXIOS CALL:
            axios.post(axios_url_off_pro).then(response => {
                store.state.asDate = response.data.ASOFDATE
                var promoData = response.data.data
                var objData = makeObject(promoData)
                this.data = objData 
                this.loaded = true
                renderCharts()
            }).catch(console.error)

            //TODO: import makeObject function and add new data
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

            var pmeMethodDecode = {
                'RES': 'Residence',
                'DES': 'Designee',
                'COR': 'Correspondence',
                'COM': 'Correspondence',
                'N/A': 'N/A'
            }
            var pmeMethodOrder = {
                'Residence': 0,
                'Designee': 1,
                'Correspondence': 2,
                'N/A': 3
            }
            var highestPmeOrder = {
                'SDE': 3,
                'IDE': 2,
                'PDE': 1,
                'NONE': 0
            }

            var formatData = (given) =>{
                var obj = {}

                obj.Grade = formats.gradeFormat[given.Board_ID.substring(1,3)]
                obj.Competitive_Category = formats.compCatFormat[given.Compcat]
                obj.Zone = formats.zoneFormat[given.Zone]
                obj.Recomendation = formats.recommendFormat[given.Promo_Recomendation];
                obj.PME = formats.pmeFormat[given.PME_Complete]
                obj.HighestPME = given.highpme.trim().split(" ")[0];
                obj.pmeMethod = pmeMethodDecode[given.highpme.trim().split(" ")[1] || 'N/A'];
                obj.Board = formats.gradeFormat[given.Board_ID.substring(1,3)] + "20" + given.Board_ID.substring(3,6)
                obj.Core = given.Core
                obj.sel = +given.num_select
                obj.elig = +given.num_eligible
                obj.Percent =  obj.sel/obj.elig === Infinity ? 0 : Math.round((obj.sel/obj.elig)*1000)/10 || 0;

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

                //reduce functions
                function promoAdd(p,v) {
                    p.elig = p.elig + +v.elig
                    p.sel = p.sel + +v.sel
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
                    return p
                }
                function promoRemove(p,v) {
                    p.elig = p.elig - +v.elig
                    p.sel = p.sel - +v.sel
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.sel/p.elig === Infinity ? 0 : Math.round((p.sel/p.elig)*1000)/10 || 0
                    return p
                }
                function promoInitial() {
                    return {
                        elig: 0,
                        sel: 0,
                        percent: 0,
                    }
                }
                //remove empty function (es6 syntax to keep correct scope)
                var removeEmptyBins = (source_group) => {
                    return {
                        all: () => {
                            return source_group.all().filter((d) => {
                                return d.value[this.selected] != 0
                            })
                        }
                    }
                }

                //Number Display for sel, elig, sel rate - show total for filtered content
                var numberGroup = this.ndx.groupAll().reduce(promoAdd, promoRemove, promoInitial)
                var selND = dc.numberDisplay("#sel")
                selND.group(numberGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d.sel;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var eligND = dc.numberDisplay("#elig")
                eligND.group(numberGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.elig;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var selRateND = dc.numberDisplay("#selRate")
                selRateND.group(numberGroup)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.percent;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
                    
                    
                //grade
                var gradeConfig = {};
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return d.Grade;
                })
                gradeConfig.group = removeEmptyBins(gradeConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial))
                gradeConfig.minHeight = 180 
                gradeConfig.aspectRatio = 5 
                gradeConfig.margins = {top: 10, left: 30, right: 10, bottom: 40}
                gradeConfig.colors = chartSpecs.gradeChartColorScale 
                var gradeChart = dchelpers.getOrdinalBarChart(gradeConfig)
                gradeChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d){
                        return formats.gradeOrder[d.key]
                    })                                    
                    .colorAccessor(function(d) {
                        return d.key;
                    })
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })

                //zone
                var zoneConfig = {};
                zoneConfig.id = 'zone'
                zoneConfig.dim = this.ndx.dimension(function (d) {
                    return d.Zone;
                })
                zoneConfig.group = zoneConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                zoneConfig.minHeight = 180 
                zoneConfig.aspectRatio = 5 
                zoneConfig.margins = {top: 10, left: 30, right: 10, bottom: 40}
                zoneConfig.colors = d3.scale.ordinal().range(["#1b9e77","#7570b3","#d95f02"])
                var zoneChart = dchelpers.getRowChart(zoneConfig)
                zoneChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d){
                      return formats.zoneOrder[d.key]
                    })                                    

                zoneChart.filter('IPZ')

                zoneChart.on("filtered", (d)=>{
                    this.showAlert = false;
                })

                //highestPme
                var highestPmeConfig = {}
                highestPmeConfig.id = 'highestPme'
                highestPmeConfig.dim = this.ndx.dimension(function(d){
                    return d.HighestPME;
                })
                highestPmeConfig.group = removeEmptyBins(highestPmeConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial))
                highestPmeConfig.minHeight = 180 
                highestPmeConfig.aspectRatio = 5
                highestPmeConfig.margins = {top: 10, left: 30, right: 10, bottom: 40}
                highestPmeConfig.colors = ["#fe9929"]
                var highestPmeChart = dchelpers.getOrdinalBarChart(highestPmeConfig)
                highestPmeChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering((d) => {
                        return highestPmeOrder[d.key]
                    })
                    .elasticX(true)
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                    })
                    .yAxis().tickFormat(function(v) {return v + "%";})


                //Compcat
                //TODO: lighter blue
                var compCatConfig = {}
                compCatConfig.id = 'compCat'
                compCatConfig.dim = this.ndx.dimension(function(d){
                    return d.Competitive_Category;
                })
                compCatConfig.group = compCatConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                compCatConfig.minHeight = 260
                compCatConfig.aspectRatio = 3
                compCatConfig.margins = {top: 10, left: 30, right: 10, bottom: 20}
                compCatConfig.colors = d3.scale.ordinal().range(["#6baed6"])
                var compCatChart = dchelpers.getRowChart(compCatConfig)
                compCatChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })

                //recommend
                var recommendConfig = {};
                recommendConfig.id = 'recommend'
                recommendConfig.dim = this.ndx.dimension(function (d) {
                    return d.Recomendation;
                })
                recommendConfig.group = recommendConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                recommendConfig.minHeight = 150 
                recommendConfig.aspectRatio = 2
                recommendConfig.margins = {top: 10, left: 30, right: 10, bottom: 20}
                recommendConfig.colors = d3.scale.ordinal().range(["#1a9641","#a6d96a","#fdae61","#d7191c"])
                var recommendChart = dchelpers.getRowChart(recommendConfig)
                recommendChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d) {
                        return formats.recommendOrder[d.key]
                    })

                //pme
                var pmeMethodConfig = {};
                pmeMethodConfig.id = 'pmeMethod'
                pmeMethodConfig.dim = this.ndx.dimension(function (d) {
                    return d.pmeMethod;
                })
                pmeMethodConfig.group = pmeMethodConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                pmeMethodConfig.minHeight = 150 
                pmeMethodConfig.aspectRatio = 2
                pmeMethodConfig.margins = {top: 10, left: 30, right: 10, bottom: 20}
                pmeMethodConfig.colors = d3.scale.ordinal().range(["#1a9850","#91cf60","#d9ef8b","#fee08b"])
                var pmeMethodChart = dchelpers.getRowChart(pmeMethodConfig)
                pmeMethodChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d){
                      return pmeMethodOrder[d.key]
                    })                                    
                

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

                    FileSaver.saveAs(blob, 'PERSTAT Officer_Promotion' + ' ' + store.state.asDate + myFilters + ' .csv');
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
<style>  /*should be scoped*/
#radioSelect div,input,label{
    cursor: pointer;
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
