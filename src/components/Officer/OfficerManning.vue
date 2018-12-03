<template>
    <div class="container">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
                    <div id="radioSelect" class="col" data-step="1" data-intro="Toggle the radio buttons to change the data element being shown in the charts.">
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio" type="radio" id="radio1" value="percent" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio1">
                                Percentage
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline" data-step="6" data-intro="Assigned">
                           <input class="custom-control-input" name="radio2" type="radio" id="radio2" value="asgn" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio2">
                                Assigned 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio3" type="radio" id="radio3" value="auth" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio3">
                                Authorized 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio4" type="radio" id="radio4" value="stp" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio4">
                                STP 
                            </label>
                        </div>
                    </div>
                    <div class="col-auto">
                        <button type="button" id="demo"
                                              class="btn btn-primary btn-sm"
                                              @click="startDemo">
                            Demo 
                        </button>
                        <button type="button" id="download"
                                        class="btn btn-info btn-rounded btn-sm waves-effect" 
                                        data-step="5" data-intro="Download data in tabular form here!"
                                        >Download Raw Data</button>
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect" 
                                data-step="4" data-intro="Click here to reset filters on all charts."
                                @click="resetAll">Reset All</button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-auto">
                    </div>
                </div>
                <div class="row" data-step="2" data-intro="Summary statistics for the data elements are shown here.">
                    <div class="col-auto">
                        Assigned:
                        <span id="asgn"></span>
                    </div>
                    <div class="col-auto">
                        STP:
                        <span id="stp"></span>
                    </div>
                    <div class="col-auto">
                        Authorized:
                        <span id="auth"></span>
                    </div>
                    <div class="col-auto">
                        Manning Percent:
                        <span id="percent"></span>
                    </div>
                </div>
                <largeBarChart :id="'majcom'"         
                                :dimension="majcomDim"
                                :group="majcomGroup"
                                :widthFactor="0.90"
                                :aspectRatio="chartSpecs.majcomChart.aspectRatio"
                                :minHeight="chartSpecs.majcomChart.minHeight"
                                :selected="selected"
                                :ylabel="ylabel"
                                :reducer="manningAddLarge"
                                :accumulator="manningInitial"
                                :numBars="30"
                                :margin="chartSpecs.majcomChart.margins"
                                :colorScale="majcomColorScale"
                                :title="'MAJCOM'"
                                :loaded="loaded"
                                >
                </largeBarChart>

                    <div class="row">
                    <div id="grade" class="col-4">
                        <div id="dc-grade-rowchart" data-step="3" data-intro="Click the bars to filter the chart!">
                            <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-grade-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="afscGroup" class="col-8">
                        <div id="dc-afscGroup-barchart">
                            <h3>AFSC Group <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    @click="resetChart('dc-afscGroup-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
                <overviewBarChart :id="'mpf'"
                                  :dimension="mpfDim"
                                  :aspectRatio="3.8"
                                  :minHeight="240"
                                  :normalToOverviewFactor="2.5"
                                  :selected="selected"
                                  :ylabel="ylabel"
                                  :reducerAdd="manningAdd"
                                  :reducerRemove="manningRemove"
                                  :accumulator="manningInitial"
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
import AutoComplete from '@/components/AutoComplete'
import Loader from '@/components/Loader'
import { store } from '@/store/store'
import searchBox from '@/components/searchBox'
import largeBarChart from '@/components/largeBarChart'
import overviewBarChart from '@/components/overviewBarChart'

    export default {
        data() {
            return {
                data: [],
                selected: "percent",
                searchMajcom: "",
                searchBase: "",
                loaded: false,
                chartSpecs: chartSpecs,
                majcomColorScale: d3.scale.ordinal().range([chartSpecs.majcomChart.color]),
                baseColorScale: d3.scale.ordinal().range([chartSpecs.baseChart.color]),
                afscGroupChart: {},
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
                return "Manning Percent (%)"
            }
            else if (this.selected === "asgn") {
                return "Assigned"
            }
            else if (this.selected === "stp") {
                return "STP"
            }
            else {
                return "Authorized"
            }
          },
          downloadDim: function() {
            return this.ndx.dimension(function(d) {return d;});    
          },      
          majcomDim: function() {
            return this.ndx.dimension(function(d) {return d.MAJCOM;});
          },
          majcomGroup: function() {
            return this.majcomDim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial);
          },
          mpfDim: function() {
            return this.ndx.dimension(function(d) {return d.MPF;});
          },
          mpfGroup: function() {
            return this.mpfDim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial);
          },
          gradeDim: function() {
            return this.ndx.dimension(function(d) {return d.Grade;});
          },
          gradeConfig: function() {
            return  {
                        'id': 'grade',
                        'dim': this.gradeDim,
                        'group': this.gradeDim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial),
                        'minHeight': 220,
                        'aspectRatio': 4,
                        'margins': {top: 10, left: 50, right: 30, bottom: 20},
                        'colors': this.chartSpecs.gradeChartColorScale
                    }
          },
          afscGroupDim: function() {
            return this.ndx.dimension(function(d) {return d.AFSC_Group}); 
          },
          afscGroupConfig: function() {
            return  {
                        'id': 'afscGroup',
                        'dim': this.afscGroupDim,
                        'group': this.removeEmptyBins(this.afscGroupDim.group().reduce(this.manningAdd,this.manningRemove,this.manningInitial)),
                        'minHeight': chartSpecs.afscGroupChart.minHeight,
                        'aspectRatio': chartSpecs.afscGroupChart.aspectRatio,
                        'margins': chartSpecs.afscGroupChart.margins,
                        'colors': [chartSpecs.afscGroupChart.color], 
                    }
          }

        },
        methods: {
          startDemo: function() {
            introJs().start()
          },
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
            manningAdd: function(p,v) {
                p.asgn = p.asgn + +v.Assigned
                p.auth = p.auth + +v.Authorized
                p.stp = p.stp + +v.STP
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent = p.asgn/p.auth === Infinity ? 0 : Math.round((p.asgn/p.auth)*1000)/10 || 0
                p.stpPercent = p.stp/p.auth === Infinity ? 0 : Math.round((p.stp/p.auth)*1000)/10 || 0
                return p
            },
            manningRemove: function(p,v) {
                p.asgn = p.asgn - +v.Assigned
                p.auth = p.auth - +v.Authorized
                p.stp = p.stp - +v.STP
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent = p.asgn/p.auth === Infinity ? 0 : Math.round((p.asgn/p.auth)*1000)/10 || 0
                p.stpPercent = p.stp/p.auth === Infinity ? 0 : Math.round((p.stp/p.auth)*1000)/10 || 0
                return p
            },
            manningInitial: function() {
                return {
                    asgn: 0,
                    auth: 0,
                    stp: 0,
                    percent: 0,
                    stpPercent: 0,
                }
            },
            manningAddLarge: function(p,v) {
                p.asgn = p.asgn + +v.asgn
                p.auth = p.auth + +v.auth
                p.stp = p.stp + +v.stp
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent = p.asgn/p.auth === Infinity ? 0 : Math.round((p.asgn/p.auth)*1000)/10 || 0
                p.stpPercent = p.stp/p.auth === Infinity ? 0 : Math.round((p.stp/p.auth)*1000)/10 || 0
                return p
            },
            removeEmptyBins: function(source_group) {
                return {
                    all: () => {
                        return source_group.all().filter((d) => {
                            return d.value[this.selected] != 0
                        })
                    }
                }
            },
            formatData: function(given) {
                var obj = {}

                obj.Grade = formats.gradeFormat[given.GRADE]
                obj.MAJCOM = formats.majFormat[given.MAJCOM_T12C]
                if (given.AFSC_GROUP == '**ERROR**') {
                    obj.AFSC_Group = 'PENDING UPDATE'   
                } else {
                    obj.AFSC_Group = given.AFSC_GROUP
                }
                obj.MPF = formats.mpfFormat[given.MPF]
                obj.Assigned = +given.ASGNCURR
                obj.Authorized = +given.AUTHCURR
                obj.STP = given.STP
                obj.PERCENT_ASSIGNED = obj.Assigned/obj.Authorized === Infinity ? 0 : Math.round((obj.Assigned/obj.Authorized)*1000)/10 || 0;

                return obj;
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
                    obj2 = {};
                    obj2 = this.formatData(obj)
                    output.push(obj2);
                }
                return output;
            },
            renderCharts: function () {

                //Number Display for Auth, Asgn, STP - show total for filtered content
                var auth = this.ndx.groupAll().reduceSum(function(d) { return +d.Authorized })
                var authND = dc.numberDisplay("#auth")
                authND.group(auth)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var asgn = this.ndx.groupAll().reduceSum(function(d) { return +d.Assigned})
                var asgnND = dc.numberDisplay("#asgn")
                asgnND.group(asgn)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var stp = this.ndx.groupAll().reduceSum(function(d) { return +d.STP})
                var stpND = dc.numberDisplay("#stp")
                stpND.group(stp)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                var percentGroup = this.ndx.groupAll().reduce(this.manningAdd,this.manningRemove,this.manningInitial)
                var percentND = dc.numberDisplay("#percent")
                percentND.group(percentGroup)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.percent})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })

                //grade
                var gradeChart = dchelpers.getRowChart(this.gradeConfig)
                gradeChart
                    .controlsUseVisibility(true)
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })                                    
                this.gradeChart = gradeChart

                //afscGroup
                var afscGroupChart = dchelpers.getOrdinalBarChart(this.afscGroupConfig)
                afscGroupChart
                    .elasticX(true)
                    .controlsUseVisibility(true)
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-afscGroup-barchart')
                        })
                    })
                this.afscGroupChart = afscGroupChart

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

                    FileSaver.saveAs(blob, 'PERSTAT Officer_Manning' + ' ' + store.state.asDate + myFilters + ' .csv');
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
            'autocomplete': AutoComplete,
            'loader': Loader,
            searchBox,
            largeBarChart,
            overviewBarChart
        },
        created: function(){
        },
        mounted() {

            //axios request - can change to a get request and change to the "get" endpoint to see a get request
            
            //PROD AXIOS CALL:  
            /*
                var querystring = require('querystring');
                const formData = {
                    _PROGRAM:"/REN - Dashboard Home V1/makeHTML_collab",
                    nPage:"off"
                }
                var myData = axios.post('', querystring.stringify(formData)).then(response => {
            */
                        
            //TEST AXIOS CALL:
            axios.post(axios_url_off_man).then(response => {
                store.state.asDate = response.data.ASOFDATE
                var axiosData = response.data.data
                var objData = this.makeObject(axiosData)
                this.data = objData
                this.loaded = true 
                this.renderCharts()
            }).catch(console.error)

        },
        beforeUpdate() {
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
div[id*="-barchart"] .x.axis text{
    text-anchor: end !important;
    transform: rotate(-45deg);
  }

div[id*="-rowchart"] g.row text{
    fill: black;
}
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
