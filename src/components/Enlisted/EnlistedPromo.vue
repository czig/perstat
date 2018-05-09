<template>
    <div class="container">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
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
                        <span id="Selects"></span>
                    </div>
                    <div class="col-auto">
                        Eligibles: 
                        <span id="Eligible"></span>
                    </div>
                    <div class="col-auto">
                        Promotion Rate: 
                        <span id="SelectsRate"></span>
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
                            <div id="look" class="col-12">
                                <div id="dc-look-rowchart">
                                    <h3>Look <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-look-rowchart')">Reset</button>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-8">
                        <div class="row">
                            <template class="AFSC-SECTION col-12">

                                <div v-if="!startAfsc" class="col-12"> 
                                    <h3>
                                        AFSC 
                                        <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}  </span>
                                        <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="visibility: hidden"
                                            >Reset</button>
                                    </h3>
                                </div>
                               
                                <div v-else class="col-12">
                                     
                                    <afsc 
                                        v-model:value="sa"
                                        :ndx="ndx"
                                        :ylabel="ylabel"
                                        :selected="selected"
                                        :reduceAdd = "promoAdd"
                                        :reduceRemove = "promoRemove"
                                        :reduceInitial = "promoInitial"
                                        dataVar="ACA43"
                                        :minHeight="200"
                                        :aspectRatio="3"
                                    >
                                    </afsc>
                                    
                                </div>
                               
                            </template>
                            <div id="recommend" class="col-12">
                                <div id="dc-recommend-rowchart">
                                    <h3>Recommendation <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                        <transition>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="display: none"
                                            @click="resetChart('dc-recommend-rowchart')">Reset</button></transition>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                </div>
                <div class="row">
                    <div id="board" class="col-12">
                        <div id="dc-board-barchart">
                            <h3>Board <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-board-barchart')">Reset</button>
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
import axios from 'axios'
import formats from '@/store/format'
import AutoComplete from '@/components/AutoComplete'
import Loader from '@/components/Loader'
import Afsc from '@/components/afsc'
import { store } from '@/store/store'

    export default {
        data() {
            return {
                data: [],
                selected: "percent",
                startAfsc: false,
                sa: '',
                loaded: false
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
                return "Promotion Rate (%)"
            }
            else if (this.selected === "Selects") {
                return "Selects"
            }
            else if (this.selected === "Eligible") {
                return "Eligibles"
            }
            else {
                return "PME Complete Rate (%)"
            }
          }
        },
        methods: {
            resetAll: (event)=>{
              store.state.resetAfsc = true;
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
            //reduce functions
            promoAdd: (p,v) => {
                p.Eligible += +v.Eligible
                p.Selects += +v.Selects
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent = p.Selects/p.Eligible === Infinity ? 0 : Math.round((p.Selects/p.Eligible)*1000)/10 || 0
                return p
            },
            promoRemove: (p,v) => {
                p.Eligible -= +v.Eligible
                p.Selects -= +v.Selects
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent = p.Selects/p.Eligible === Infinity ? 0 : Math.round((p.Selects/p.Eligible)*1000)/10 || 0
                return p
            },
            promoInitial: () => {
                return {
                    Eligible: 0,
                    Selects: 0,
                    percent: 0,
                }
            }
        },
        components: {
            'autocomplete': AutoComplete,
            'loader': Loader,
            'afsc': Afsc
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')

            
            //TEST AXIOS CALL:
            axios.post(axios_url_enl_promo).then(response => {
                var promoData = response.data.data
                store.state.asDate = response.data.ASOFDATE //TODO: properly set with mutation
                var objData = makeObject(promoData)
                this.data = objData
                this.loaded = true
                this.startAfsc = true
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

                obj.Grade = formats.gradeFormat[given.board.substring(6,8)]
                obj.Look = given.look.trim()
                obj.Recommendation = formats.enlRecommendFormat[given.Prom_rec]
                obj.Board = given.board
                obj.ACA43 = given.ACA43

                obj.Eligible = +given.Eligible
                obj.Selects = +given.Selects
                obj.Promotion_Rate = obj.Selects/obj.Eligible === Infinity ? 0 : Math.round((obj.Selects/obj.Eligible)*1000)/10 || 0

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
                    p.Eligible += +v.Eligible
                    p.Selects += +v.Selects
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.Selects/p.Eligible === Infinity ? 0 : Math.round((p.Selects/p.Eligible)*1000)/10 || 0
                    return p
                }
                function promoRemove(p,v) {
                    p.Eligible -= +v.Eligible
                    p.Selects -= +v.Selects
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.Selects/p.Eligible === Infinity ? 0 : Math.round((p.Selects/p.Eligible)*1000)/10 || 0
                    return p
                }
                function promoInitial() {
                    return {
                        Eligible: 0,
                        Selects: 0,
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

                //Number Display for Selects, Eligible, Selects rate - show total for filtered content
                var numberGroup = this.ndx.groupAll().reduce(promoAdd, promoRemove, promoInitial)
                var SelectsND = dc.numberDisplay("#Selects")
                SelectsND.group(numberGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d.Selects;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var EligibleND = dc.numberDisplay("#Eligible")
                EligibleND.group(numberGroup)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.Eligible;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var SelectsRateND = dc.numberDisplay("#SelectsRate")
                SelectsRateND.group(numberGroup)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.percent;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })

            //board, aca43, look, prom_rec, eligible, selects, select_rate, 
                    
                //grade
                var gradeConfig = {};
                gradeConfig.id = 'grade'
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return d.Grade
                })
                gradeConfig.group = gradeConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                gradeConfig.minHeight = 150 
                gradeConfig.aspectRatio = 2
                gradeConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                gradeConfig.colors = d3.scale.category10()
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                gradeChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })                                    

                //look
                var lookConfig = {};
                lookConfig.id = 'look'
                lookConfig.dim = this.ndx.dimension(function (d) {
                    return d.Look;
                })
                lookConfig.group = lookConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                lookConfig.minHeight = 150 
                lookConfig.aspectRatio = 2
                lookConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                lookConfig.colors = d3.scale.category10().domain([100,0])
                var lookChart = dchelpers.getRowChart(lookConfig)
                lookChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })

                //recommend
                var recommendConfig = {};
                recommendConfig.id = 'recommend'
                recommendConfig.dim = this.ndx.dimension(function (d) {
                    return d.Recommendation;
                })
                recommendConfig.group = recommendConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                recommendConfig.minHeight = 150 
                recommendConfig.aspectRatio = 5
                recommendConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                recommendConfig.colors = d3.scale.ordinal().range(["#1a9850","#91cf60","#d9ef8b","#fee08b","#fc8d59","#d73027"])
                var recommendChart = dchelpers.getRowChart(recommendConfig)
                recommendChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordering(function(d) {
                        return formats.enlRecommendOrder[d.key]
                    })

                //board
                var boardConfig = {}
                boardConfig.id = 'board'
                boardConfig.dim = this.ndx.dimension(function(d){ return d.Board })
                var boardGroup = boardConfig.dim.group().reduce(promoAdd, promoRemove, promoInitial)
                boardConfig.group = removeEmptyBins(boardGroup)
                boardConfig.minHeight = 250
                boardConfig.aspectRatio = 5
                boardConfig.margins = {top: 30, left: 40, right: 30, bottom: 60}
                boardConfig.colors = ["#1976d2"]
                var boardChart = dchelpers.getOrdinalBarChart(boardConfig)
                boardChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .elasticX(true)
                    .ordinalColors(["#1976d2","#ff4500"])
                    .ordering(function(d) {
                        return formats.gradeOrder[d.key.substring(0,3)] + d.key.substring(3,7)
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-board-barchart')
                        })
                    })

                //Download Raw Data button
                d3.select('#download')
                .on('click', ()=>{
                    var data = boardConfig.dim.top(Infinity);
                    var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"});

                    var myFilters = '';
                    dc.chartRegistry.list().forEach((d)=>{
                        console.log(d.anchorName().toUpperCase())
                        if (_.includes(d.anchorName().toUpperCase(),'AFSC')){
                            //console.log('AFSC Filter: ' + this.sa)
                            if (_.includes(d.anchorName().toUpperCase(),'ROW') && this.sa){
                                if (this.sa.length < 6){
                                    var num = 6 - this.sa.length;
                                    var txt = Array(num).join("X")
                                    myFilters += ' (AFSC_' + this.sa + txt + ')'
                                }   else myFilters += ' (' + this.sa + ')'
                            }
                        }else if (d.filters()[0])
                            myFilters += ' (' + d.filters() + ')'
                    })

                    FileSaver.saveAs(blob, 'PERSTAT Enlisted_Promotion' + ' ' + store.state.asDate + myFilters + '.csv');
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
