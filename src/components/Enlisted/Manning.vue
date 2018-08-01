<template>
    <div>
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 

                    <div id="radioSelect" class="col form-group">
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radio" type="radio" id="radio1" value="percent" v-model="selected" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Percentage</span>
                        </label>
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radio" type="radio" id="radio2" value="asgn" v-model="selected" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Assigned</span>
                        </label>
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radio" type="radio" id="radio3" value="auth" v-model="selected" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">Authorized</span>
                        </label>
                        <label class="custom-control custom-radio" >
                            <input class="custom-control-input" name="radio" type="radio" id="radio4" value="stp" v-model="selected" @click="radioButton">
                            <span class="custom-control-indicator"></span>
                            <span class="custom-control-description">STP</span>
                        </label>
                    </div>
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
                    <div id="grade" class="col-4">
                        <div id="dc-grade-rowchart">
                            <h3>Grade <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-grade-rowchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                    <div id="afscGroup" class="col-8">
                        <div id="dc-afscGroup-barchart">
                            <h3>AFSC Group <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-afscGroup-barchart')">Reset</button>
                            </h3>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="base" class="col-12">
                        <div id="dc-base-barchart">
                            <h3>MPF <span style="font-size: 14pt; opacity: 0.87;">{{ylabel}}</span>
                            <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="display: none"
                                    @click="resetChart('dc-base-barchart')">Reset</button>
                            </h3>
                            <searchBox
                                v-model:value="searchBase"
                                size="3"
                                label="Search MPF"
                                @sub="submit(searchBase,'dc-base-barchart')"
                                button="true"
                                :color="baseColor"
                                :btnColor="baseColor"
                            ></searchBox>
                            <!-- <form class="form-inline">
                                <div class="form-group">
                                    <input id="searchBase" v-model="searchBase" placeholder="Search Installation" @keydown.enter="submit(searchBase,'dc-base-barchart')">
                                    <button class="btn btn-primary btn-sm" @click="submit(searchBase,'dc-base-barchart')">Submit</button>
                                </div>
                            </form> -->
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

    export default {
        data() {
            return {
                data: [],
                selected: "percent",
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
            'loader': Loader,
            searchBox, 
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')

            //TEST AXIOS CALL:
            axios.post(axios_url_enl_man).then(response => {
                store.state.asDate = response.data.ASOFDATE
                var axiosData = response.data.data
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
                    obj2 = {};
                    obj2 = formatData(obj)
                    //obj2 = testData(obj2, obj)
                    output.push(obj2);
                }
                return output;
            }

            var formatData = (given) =>{
                var obj = {}

                obj.Grade = formats.gradeFormat[given.GRADE]
                obj.MAJCOM = formats.majFormat[given.MAJCOM_T12C]
                if (given.AFSC_GROUP == '**ERROR**') 
                    obj.AFSC_Group = 'PENDING UPDATE'   
                else obj.AFSC_Group = given.AFSC_GROUP
                obj.MPF = formats.mpfFormat[given.MPF]
                obj.Assigned = +given.ASGNCURR
                obj.Authorized = +given.AUTHCURR
                obj.STP = given.STP
                obj.PERCENT_ASSIGNED = obj.Assigned/obj.Authorized === Infinity ? 0 : Math.round((obj.Assigned/obj.Authorized)*1000)/10 || 0;

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
                function manningAdd(p,v) {
                    p.asgn = p.asgn + +v.Assigned
                    p.auth = p.auth + +v.Authorized
                    p.stp = p.stp + +v.STP
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.asgn/p.auth === Infinity ? 0 : Math.round((p.asgn/p.auth)*1000)/10 || 0
                    p.stpPercent = p.stp/p.auth === Infinity ? 0 : Math.round((p.stp/p.auth)*1000)/10 || 0
                    return p
                }
                function manningRemove(p,v) {
                    p.asgn = p.asgn - +v.Assigned
                    p.auth = p.auth - +v.Authorized
                    p.stp = p.stp - +v.STP
                    //if divide by 0, set to 0, and if NaN, set to zero
                    p.percent = p.asgn/p.auth === Infinity ? 0 : Math.round((p.asgn/p.auth)*1000)/10 || 0
                    p.stpPercent = p.stp/p.auth === Infinity ? 0 : Math.round((p.stp/p.auth)*1000)/10 || 0
                    return p
                }
                function manningInitial() {
                    return {
                        asgn: 0,
                        auth: 0,
                        stp: 0,
                        percent: 0,
                        stpPercent: 0,
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

                //MAJCOM
                var majcomConfig = {}
                majcomConfig.id = 'majcom'
                majcomConfig.dim = this.ndx.dimension(function(d){return d.MAJCOM})
                var majcomPercent = majcomConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                majcomConfig.group = removeEmptyBins(majcomPercent)
                majcomConfig.minHeight = chartSpecs.majcomChart.minHeight 
                majcomConfig.aspectRatio = chartSpecs.majcomChart.aspectRatio 
                majcomConfig.margins = chartSpecs.majcomChart.margins 
                majcomConfig.colors = [chartSpecs.majcomChart.color]
                var majcomChart = dchelpers.getOrdinalBarChart(majcomConfig)
                majcomChart
                    .elasticX(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
                    .ordinalColors(["#1976d2","#ff4500"])
                    .on('pretransition', (chart)=> {
                        chart.selectAll('g.x text')
                        .attr('transform', 'translate(-8,0)rotate(-45)')
                        .on('click', (d)=>{
                            this.submit(d, 'dc-majcom-barchart')
                        })
                    })

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
                var percentGroup = this.ndx.groupAll().reduce(manningAdd,manningRemove,manningInitial)
                var percentND = dc.numberDisplay("#percent")
                percentND.group(percentGroup)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.percent})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
                    
                //grade
                
                var gradeConfig = {};
                gradeConfig.id = 'grade';
                gradeConfig.dim = this.ndx.dimension(function (d) {
                    return d.Grade;
                })
                gradeConfig.group = gradeConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                gradeConfig.minHeight = 200
                gradeConfig.aspectRatio = 4
                gradeConfig.margins = {top: 10, left: 50, right: 30, bottom: 5}
                var c = d3.rgb(51,172,255)
                gradeConfig.colors = d3.scale.ordinal().range([c.brighter(1).toString(),c.brighter(0.8).toString(), c.brighter(0.6).toString(), c.brighter(0.4).toString(),c.brighter(0.2).toString(),c.darker(0.2).toString(),c.darker(0.4).toString()])
                var gradeChart = dchelpers.getRowChart(gradeConfig)
                gradeChart
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    .ordering(function(d){
                      return formats.gradeOrder[d.key]
                    })                                    
                
                //afscGroup
                var afscGroupConfig = {}
                afscGroupConfig.id = 'afscGroup'
                afscGroupConfig.dim = this.ndx.dimension(function(d){return d.AFSC_Group})
                afscGroupConfig.group = removeEmptyBins(afscGroupConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial))
                afscGroupConfig.minHeight = chartSpecs.afscGroupChart.minHeight
                afscGroupConfig.aspectRatio = chartSpecs.afscGroupChart.aspectRatio
                afscGroupConfig.margins = chartSpecs.afscGroupChart.margins
                afscGroupConfig.colors = [chartSpecs.afscGroupChart.color]
                var afscGroupChart = dchelpers.getOrdinalBarChart(afscGroupConfig)
                afscGroupChart
                    .elasticX(true)
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

                //base(mpf)
                var baseConfig = {}
                baseConfig.id = 'base'
                baseConfig.dim = this.ndx.dimension(function(d){return d.MPF})
                var basePercent = baseConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
                baseConfig.group = removeEmptyBins(basePercent)
                baseConfig.minHeight = chartSpecs.baseChart.minHeight 
                baseConfig.aspectRatio = chartSpecs.baseChart.aspectRatio 
                baseConfig.margins = chartSpecs.baseChart.margins 
                baseConfig.colors = [chartSpecs.baseChart.color]
                var baseChart = dchelpers.getOrdinalBarChart(baseConfig)
                baseChart
                    .elasticX(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected]
                    })
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

                    FileSaver.saveAs(blob, 'PERSTAT Enlisted_Manning' + ' ' + store.state.asDate + myFilters + ' .csv');
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

