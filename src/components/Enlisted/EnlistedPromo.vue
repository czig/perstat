<template>
    <div class="container-fluid">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
<!--                     <div id="radioSelect" class="col form-group">
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio" type="radio" id="radio1" value="percent" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio1">
                                Promotion Rate
                            </label>
                        </div>
                    </div> -->
                    <div class="col"></div>
                    <div class="col-auto">
                    </div>
                </div>
                <div class="row">
                    <div class="col-auto">
                    </div>
                </div>
                <div class="row">
                    <div id="counts" class="row col-auto" data-step="3" data-intro="Summary statistics for the data elements are shown here. These numbers change as filters are applied.">
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
                    <div class="col"></div>
                    <div class="col-auto">   
                    </div>                    
                </div>
                <div class="row">

                    <div id="grade" class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                        <div id="dc-grade-rowchart" data-step="4" data-intro="Clicking the bars applies filters to the chart. Click on one of the bars and watch the other charts update!">
                            <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                <button type="button" 
                                        class="btn btn-danger btn-sm btn-rounded reset" 
                                        style="display: none"
                                        @click="resetChart('dc-grade-rowchart')">Reset</button>
                             </h3>
                        </div>
                    </div>
                    <div class="col-xl-8 col-lg-8 col-md-8 col-sm-6 col-12">
                        <template class="AFSC-SECTION col-12">
                            <div v-if="!startAfsc" id="afsc" class="col-12"> 
                                <h3>
                                    AFSC 
                                    <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}  </span>
                                    <button type="button" 
                                            class="btn btn-danger btn-sm btn-rounded reset" 
                                            style="visibility: hidden"
                                            >Reset</button>
                                </h3>
                            </div>
                               
                            <div v-else id="afsc" class="col-12">                                  
                                <afsc 
                                    v-model="sa"
                                    :ndx="ndx"
                                    :ylabel="ylabel"
                                    :selected="selected"
                                    :reduceAdd = "promoAdd"
                                    :reduceRemove = "promoRemove"
                                    :reduceInitial = "promoInitial"
                                    dataVar="ACA43"
                                    :minHeight="chartSpecs.standardBarChart.minHeight"
                                    :aspectRatio="chartSpecs.afscGroupChart.aspectRatio"
                                    >
                                </afsc>
                            </div>
                                   
                        </template>
                    </div>
                </div>
                <div class="row">    
                    <div id="look" class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                        <div id="dc-look-rowchart">
                            <h3>Look <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                                <button type="button" 
                                        class="btn btn-danger btn-sm btn-rounded reset" 
                                        style="display: none"
                                        @click="resetChart('dc-look-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="recommend" class="col-xl-8 col-lg-8 col-md-8 col-sm-6 col-12">
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
        <fab
            data-step="2"
            data-intro="Click here to Reset all filters for all charts, Download raw data in tab form, or View current filters applied to all charts."
            :position="position"
            :bg-color="bgColor"
            :actions="fabActions"
            @reset="resetAll"
            @download="fabDownload"
            @demo="startDemo"
            @showMyFilters="fabFilter"
            class="noselect"
        ></fab>         
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'
import chartSpecs from '@/chartSpecs'
import axios from 'axios'
import formats from '@/store/format'
import AutoComplete from '@/components/AutoComplete'
import Loader from '@/components/Loader'
import Afsc from '@/components/afsc'
import { store } from '@/store/store'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import toastr from 'toastr'
import fab from '@/components/FAB' 

    export default {
      data() {
        return {
          data: [],
          selected: "percent",
          startAfsc: false,
          sa: '',
          loaded: false,
          chartSpecs: chartSpecs,
          boardColor: chartSpecs.boardChart.color,
          pageName: 'Enlisted Promotions', 
          /* FAB items */
          bgColor: '#333333',
          position: 'bottom-right',  
          iconSize: 'md',        
          fabActions: [{ name: 'reset', icon: 'redo-alt', tooltip: 'Reset All', color: '#FF3547' },
                       { name: 'download', icon: 'download', tooltip: 'Download Raw Data', color: '#2F96B4'},
                       { name: 'demo', icon: 'eye', tooltip: 'Demo the page', color: '#2F96B4'},
                       { name: 'showMyFilters', icon: 'search-filters', tooltip: 'View current Filters', color: '#2F96B4'}],
          mainIcon: 'plus'                             
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
                return "% Promotion Rate"
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
          },
          downloadDim: function() {
              return this.ndx.dimension(function(d) {return d;});    
          }, 
          pageLabel: function() {
            return this.pageName
          }

        },
        methods: {
            resetAll: (event)=>{
              store.state.resetAfsc = true;
              dc.filterAll()
              //dc.redrawAll()
            },
          startDemo: function() {
            introJs().start()
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
            },
            toProperCase: function(s) {
                return s.toLowerCase().replace(/^(.)|\s(.)/g, 
                    function($1) { return $1.toUpperCase(); });
            },
            fabDownload: function(){
              var data = this.downloadDim.top(Infinity)
              var blob = new Blob([d3.csv.format(data)], {type: "text/csv;charset=utf-8"})

              var myFilters = ''
                dc.chartRegistry.list().forEach((d)=>{
                        //console.log(d.anchorName().toUpperCase())
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

              FileSaver.saveAs(blob, 'PERSTAT ' + this.pageName + ' ' + store.state.asDate + myFilters + ' .csv');
            },
            fabFilter: function(){
                //Curent Filters button
                var myFilters = this.toProperCase(this.pageLabel) + ' filters ';
                dc.chartRegistry.list().forEach((d)=>{                    
                //console.log("d.filter(): "+d.filter())
                if (d.hasFilter() && d.anchor()!='#dc-afsc-select') {
                    //console.log(d.anchor(), d.filters())
                    myFilters += '\n (' + d.filters() + ')'
                } 
                })
                if (myFilters !== undefined) {
                  var myCheckValue = SelectsRate.innerText.substr(0, SelectsRate.innerText.length-1);
                //console.log("myCheckValue.value: "+myCheckValue.value());
                // Override global options
                  toastr.options = {
                    "positionClass": "toast-bottom-full-width",
                    "closeButton":"true",
                    "preventDuplicates":"true"
                  }
                  if (myCheckValue == '0.0%' || myCheckValue == 0 ) {
                    toastr.warning('Your ' + this.toProperCase(this.pageLabel) + ' filter(s) returned no results. Please reset and try again.');
                  }
                  else if (myCheckValue == 1) {
                    myFilters += ' return ' + myCheckValue + ' ' + this.ylabel + ' result.'
                    toastr.info(myFilters);                         
                  }
                  else {
                    myFilters += ' return ' + myCheckValue + ' ' + this.ylabel + ' results.'
                    toastr.info(myFilters);  
                  }                      
                }
                if (myFilters == 'undefined' || myFilters == undefined) {
                    toastr.error('Something went wrong. Please reset and try again.')
                }                
            }

        },
        components: {
            'autocomplete': AutoComplete,
            'loader': Loader,
            'afsc': Afsc, 
            FontAwesomeIcon,
            fab
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
                gradeConfig.minHeight = 323 
                gradeConfig.aspectRatio = 2
                gradeConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
                gradeConfig.colors = this.chartSpecs.gradeChartColorScale 
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                gradeChart
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .colorAccessor((d) => {
                        return d.key;
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
                lookConfig.minHeight = chartSpecs.lookChart.minHeight 
                lookConfig.aspectRatio = chartSpecs.lookChart.aspectRatio
                lookConfig.margins = chartSpecs.lookChart.margins
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
                recommendConfig.minHeight = 253 
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
                boardConfig.minHeight = chartSpecs.standardBarChart.minHeight 
                boardConfig.aspectRatio = chartSpecs.baseChart.aspectRatio
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
                            chart.filter(d);
                            dc.redrawAll();
                        })
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
<style src="../../../node_modules/toastr/build/toastr.css"/>
<style src="@/../node_modules/dc/dc.css"/>
<style>
#grade, #afsc, #look, #recommend, #board {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
<style scoped>
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
