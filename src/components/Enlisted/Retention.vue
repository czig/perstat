
<template>
    <div class="container-fluid">
        <transition-group name="fade" mode="out-in">
            <loader v-show="!loaded" key="loader"></loader>
            <div v-show="loaded" key="content">
                <div class="row pt-2"> 
                    <div id="radioSelect" class="col" data-step="1" data-intro="Toggle the radio buttons to change the data element being shown in the charts.">
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio" type="radio" id="radio1" value="reEnlRate" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio1">
                                Reenlistment Rate 
                            </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                           <input class="custom-control-input" name="radio2" type="radio" id="radio2" value="keepRate" v-model="selected" @click="radioButton">
                           <label class="custom-control-label" for="radio2">
                                Keep Rate 
                            </label>
                        </div>
                    </div>
                    <div class="col-auto">
                        <button type="button" id="demo"
                            class="btn btn-info btn-rounded btn-sm waves-effect"
                            title="Demo"
                            @click="startDemo">
                            <p class="d-none d-md-inline">Demo&nbsp;&nbsp;</p>  
                            <FontAwesomeIcon icon="eye" 
                                            size="lg">
                            </FontAwesomeIcon>
                            
                        </button>
                        <button type="button" id="showMyFilters"
                                class="btn btn-info btn-rounded btn-sm waves-effect"
                                data-step="7" data-intro="See the currently applied filters here!"
                                title="Filter">
                        <p class="d-none d-md-inline">Filter&nbsp;&nbsp;</p>  
                        <FontAwesomeIcon icon="filter" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button> 
                        <button type="button" id="download"
                                class="btn btn-info btn-rounded btn-sm waves-effect"
                                data-step="6" data-intro="Download data in tabular form here!"
                                title="Download Raw Data">
                        <p class="d-none d-md-inline">Download&nbsp;&nbsp;</p>  
                        <FontAwesomeIcon icon="download" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button>
                        <button type="button" 
                                class="btn btn-danger btn-rounded btn-sm waves-effect"
                                data-step="4" data-intro="Click here to reset filters on all charts."
                                title="Reset All"
                                @click="searchAfsc='';searchMajcom='';searchBase='';resetAll()">
                        <p class="d-none d-md-inline">Reset All&nbsp;&nbsp;</p>  
                        <FontAwesomeIcon icon="redo-alt" 
                                         size="lg">
                        </FontAwesomeIcon>
                        </button>                        
                    </div>
                </div>
                <div id="counts" class="row" data-step="2" data-intro="Summary statistics for the data elements are shown here. These numbers change as filters are applied.">
                    <div class="col-auto">
                        Inventory:
                        <span id="inv"></span>
                    </div>
                    <div class="col-auto">
                        Eligible:
                        <span id="elig"></span>
                    </div>
                    <div class="col-auto">
                        Keep:
                        <span id="keep"></span>
                    </div>
                    <div class="col-auto">
                        Re-Enlist Rate:
                        <span id="reEnlRate"></span>
                    </div>
                    <div class="col-auto">
                        Keep Rate:
                        <span id="keepRate"></span>
                    <span class="h3 mt-0 pt-0 align-middle">
                        <span class="ico-tooltip"
                            data-toggle="tooltip" 
                            title="This is the percentage of people who reenlisted out of those who are eligible to reenlist or separate within the term.">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="25px" style="vertical-align:top; margin-top:2px;" viewBox="0 0 512 512">
                            <path d="M256,0C114.613,0,0,114.617,0,256c0,141.391,114.613,256,256,256s256-114.609,256-256C512,114.617,397.387,0,256,0z   M256,128c17.674,0,32,14.328,32,32c0,17.68-14.326,32-32,32s-32-14.32-32-32C224,142.328,238.326,128,256,128z M304,384h-96  c-8.836,0-16-7.156-16-16c0-8.836,7.164-16,16-16h16v-96h-16c-8.836,0-16-7.156-16-16c0-8.836,7.164-16,16-16h64  c8.836,0,16,7.164,16,16v112h16c8.836,0,16,7.164,16,16C320,376.844,312.836,384,304,384z"></path>
                        </svg>
                        </span>
                    </span>
                       <!-- <span data-toggle="tooltip" 
                          data-placement="bottom"
                          title="This is the percentage of people who reenlisted out of those who are eligible to reenlist or separate within the term.">
                        <FontAwesomeIcon icon="info-circle" 
                                         size="sm"
                                         >
                        </FontAwesomeIcon>
                    </span> -->

                    </div>
                </div>
                <div class="row">
                    <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                        <!-- <div class="row"> -->
                            <div id="year" class="col-12">
                                <div id="dc-year-rowchart" data-step="3" data-intro="Clicking the bars applies filters to the chart. Click on one of the bars and watch the other charts update!">>>
                                    <h3>Year<span style="font-size: 14pt; opacity: 0.87;"> &nbsp {{ylabel}}</span>
                                    </h3>
                                </div>
                            </div>
                            <div v-show="true" id="cat" class="col-12">
                                <div id="dc-cat-rowchart">
                                    <h3>Category <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}</span>
                                    </h3>
                                </div>
                            </div>
                        <!-- </div> -->
                    </div>
                    <template class="AFSC-SECTION">
                        <div  v-if="!startAfsc" id="afsc" class="col-xl-8 col-lg-8 col-md-8 col-sm-6 col-12"> 
                            <h3>
                                AFSC 
                                <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}  </span>
                                <button type="button" 
                                    class="btn btn-danger btn-sm btn-rounded reset" 
                                    style="visibility: hidden"
                                    >Reset</button>
                            </h3>
                        </div>
                        <div v-else id="afsc" class="col-xl-8 col-lg-8 col-md-8 col-sm-6 col-12">
                            <afsc
                                v-model="sa"
                                :ndx="ndx"
                                :ylabel="ylabel"
                                :selected="selected"
                                :reduceAdd = "retentionAdd"
                                :reduceRemove = "retentionRemove"
                                :reduceInitial = "retentionInitial"
                                dataVar="AFSC"
                                removeBin = "inv"
                                :minHeight = "225"
                                :aspectRatio = "2.5"
                            >
                            </afsc>
                        </div>
                    </template>
                </div>
<!--                 <largeBarChart :id="'majcom'"         
                                :dimension="majcomDim"
                                :group="majcomGroup"
                                :widthFactor="0.90"
                                :aspectRatio="chartSpecs.majcomChart.aspectRatio"
                                :minHeight="chartSpecs.majcomChart.minHeight"
                                :selected="selected"
                                :ylabel="ylabel"
                                :reducer="retentionAddLarge"
                                :accumulator="retentionInitial"
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
                   :reducerAdd="retentionAdd"
                   :reducerRemove="retentionRemove"
                   :accumulator="retentionInitial"
                   :numBars="15"
                   :margin="chartSpecs.majcomChart.margins"
                   :colorScale="majcomColorScale"
                   :title="'MAJCOM'"
                   :loaded="loaded">
                </overviewBarChart>
<!--                  <largeBarChart :id="'mpf'"         
                                :dimension="mpfDim"
                                :group="mpfGroup"
                                :widthFactor="0.90"
                                :aspectRatio="chartSpecs.baseChart.aspectRatio"
                                :minHeight="chartSpecs.baseChart.minHeight"
                                :selected="selected"
                                :ylabel="ylabel"
                                :reducer="retentionAddLarge"
                                :accumulator="retentionInitial"
                                :numBars="30"
                                :margin="chartSpecs.baseChart.margins"
                                :colorScale="baseColorScale"
                                :title="'Servicing MPF'"
                                :loaded="loaded">
                </largeBarChart> -->
                <overviewBarChart 
                   :id="'mpf'"
                   :dimension="mpfDim"
                   :aspectRatio="chartSpecs.baseChart.aspectRatio"
                   :minHeight="chartSpecs.baseChart.minHeight"
                   :normalToOverviewFactor="1.5"
                   :selected="selected"
                   :ylabel="ylabel"
                   :reducerAdd="retentionAdd"
                   :reducerRemove="retentionRemove"
                   :accumulator="retentionInitial"
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
    import afsc from '@/components/afsc'
    import { store } from '@/store/store'
    import Loader from '@/components/Loader'
    import searchBox from '@/components/searchBox'
    import largeBarChart from '@/components/largeBarChart'    
    import FontAwesomeIcon from '@fortawesome/vue-fontawesome' 
    import overviewBarChart from '@/components/overviewBarChart'
    import toastr from 'toastr'

    export default {
        data() {
            return {
                data: [],
                selected:'reEnlRate',
                searchMajcom: "",
                searchBase: "",
                sa: "",
                startAfsc:false,
                loaded: false,
                chartSpecs: chartSpecs,
                asDate: 'Undetermined',
                baseColorScale: d3.scale.ordinal().range([chartSpecs.baseChart.color]),
                majcomColorScale: d3.scale.ordinal().range([chartSpecs.majcomChart.color]),
                pageName: 'Enlisted Retention',
                category: '1ST TERM',
                year: '2018'
            }
        },
        components:{
            'afsc': afsc,
            'loader': Loader,
            'searchBox': searchBox,
            largeBarChart,
            FontAwesomeIcon,
            overviewBarChart   
        },
        computed: {
          ndx: function(){
            return crossfilter(this.data)
          },
          allGroup: function(){
            return this.ndx.groupAll()
          },
          ylabel: function() {
            if (this.selected === "inv") {
                return "Inventory"
            }
            else if (this.selected === "elig") {
                return "Eligible"
            }
            else if (this.selected === "keep") {
                return "Keep"
            }
            else if (this.selected === "reEnlRate") {
                return "% Reenlist Rate"
            }
            else {
                return "% Keep Rate"
            }
          },
          downloadDim: function() {
            return this.ndx.dimension(function(d) {return d;});    
          },      
          majcomDim: function() {
            return this.ndx.dimension(function(d) {return d.MAJCOM;});
          },
          majcomGroup: function() {
            return this.majcomDim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial);
          },
          mpfDim: function() {
            return this.ndx.dimension(function(d) {return d.MPF;});
          },
          mpfGroup: function() {
            return this.mpfDim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial);
          },
          pageLabel: function() {
            return this.pageName
          }
        },
        methods: {
          resetAll(){
            this.category = '1ST TERM';
            this.selected = 'reEnlRate';
            this.year = '2018'
            store.state.resetAfsc = true;
            dc.filterAll();
            this.singleSubmit('2018', 'dc-year-rowchart')
            this.singleSubmit('1ST TERM', 'dc-cat-rowchart')
          },
          startDemo: function() {
            introJs().start()
          },
          resetChart: function(id) {
            dc.chartRegistry.list().filter(chart=>{
              return chart.anchorName().indexOf(id) !== -1
            }).forEach(chart=>{
              chart.filterAll()
            })
            dc.redrawAll()
          },
          resetChartSingle: function(id) {
              dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName().indexOf(id) !== -1
              }).forEach(chart=>{
                  chart.filterAll()
                  if (_.includes(id,'year')) {
                    this.singleSubmit('2018', id)
                  } else {
                    this.singleSubmit('1ST TERM', id)
                  }
              })
              dc.redrawAll();
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
          singleSubmit: (text,id) => {
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == id
            }).forEach(chart=>{
                chart.filterAll()
                chart.filter(text)
            })
            dc.redrawAll()
          },
          retentionAdd(p,v) {
            p.inv = p.inv + +v.Inventory
            p.elig = p.elig + +v.Eligible
            p.keep = p.keep + +v.Keep
            //if divide by 0, set to 0, and if NaN, set to zero
            p.keepRate = p.keep/p.inv === Infinity ? 0 : Math.round((p.keep/p.inv)*1000)/10 || 0
            p.reEnlRate = p.keep/p.elig === Infinity ? 0 : Math.round((p.keep/p.elig)*1000)/10 || 0
            return p
          },
          retentionRemove(p,v) {
            p.inv = p.inv - +v.Inventory
            p.elig = p.elig - +v.Eligible
            p.keep = p.keep - +v.Keep
            //if divide by 0, set to 0, and if NaN, set to zero
            p.keepRate = p.keep/p.inv === Infinity ? 0 : Math.round((p.keep/p.inv)*1000)/10 || 0
            p.reEnlRate = p.keep/p.elig === Infinity ? 0 : Math.round((p.keep/p.elig)*1000)/10 || 0
            return p
          },
          retentionInitial() {
            return {
                inv: 0,
                elig: 0,
                keep: 0,
                reEnlRate: 0,
                keepRate: 0,
            }
          },
          retentionAddLarge: function(p,v) {
              p.inv = p.inv + +v.inv
              p.elig = p.elig + +v.elig
              p.keep = p.keep + +v.keep
              //if divide by 0, set to 0, and if NaN, set to zero
              p.keepRate = p.keep/p.inv === Infinity ? 0 : Math.round((p.keep/p.inv)*1000)/10 || 0
              p.reEnlRate = p.keep/p.elig === Infinity ? 0 : Math.round((p.keep/p.elig)*1000)/10 || 0
              return p
          },

          removeEmptyBins:(source_group) => {
            return {
                all: () => {
                    return source_group.all().filter((d) => {
                        return d.value[this.selected] != 0
                    })
                }
            }
          },
          toProperCase: function(s) {
            return s.toLowerCase().replace(/^(.)|\s(.)/g, 
                function($1) { return $1.toUpperCase(); });
          }  
        },
        created: function(){
          console.log('created')
          //var data = require('@/assets/data/ps_off.csv')
          //this.data = data
        },
        mounted() {
            console.log('mounted')
            //TEST AXIOS CALL:
            axios.post(axios_url_enl_ret).then(response => {
                var axiosData = response.data.data
                store.state.asDate = response.data.ASOFDATE
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
                    obj2 = testData(obj2, obj)
                    output.push(obj2);
                }
                return output;
            }
            var formatData = (given) =>{
                var obj = {}

                obj.MAJCOM = formats.majFormat[given.MAJ]
                obj.AFSC = given.AFSC
                obj.MPF = formats.mpfFormat[given.MPF]
                obj.Year = "20" + given.FY
                obj.Category = formats.catFormat[given.CAT]
                obj.Inventory = given.INV
                obj.Eligible  = given.ELIG
                obj.Keep = given.KEEP
                obj.Keep_Rate = obj.Keep/obj.Inventory === Infinity ? 0 : Math.round((obj.Keep/obj.Inventory)*1000)/10 || 0;
                obj.Reenlistment_Rate = obj.Keep/obj.Eligible === Infinity ? 0 : Math.round((obj.Keep/obj.Eligible)*1000)/10 || 0;

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

                //***Totals***
                var tots = this.ndx.groupAll().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial)
                //INV
                var invND = dc.numberDisplay("#inv")
                invND.group(tots)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) { return d.inv;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                //ELIG
                var eligND = dc.numberDisplay("#elig")
                eligND.group(tots)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.elig;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                //KEEP
                var keepND = dc.numberDisplay("#keep")
                keepND.group(tots)
                    .formatNumber(d3.format("d"))
                    .valueAccessor(function(d) {return d.keep;})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                    })
                //Re-enlist Rate
                var reEnlRateND = dc.numberDisplay("#reEnlRate")
                reEnlRateND.group(tots)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.reEnlRate})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
                //Keep Rate
                var keepRateND = dc.numberDisplay("#keepRate")
                keepRateND.group(tots)
                    .formatNumber(d3.format(".1f"))
                    .valueAccessor(function(d) {return d.keepRate})
                    .html({
                        one:"<span style=\"color:steelblue; font-size: 20px;\">%number%</span>"
                    })
                
                //YEAR
                var yearConfig = {};
                yearConfig.id = 'year';
                yearConfig.dim = this.ndx.dimension(function (d) {
                    return d.Year;
                })
                yearConfig.group = yearConfig.dim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial)
                yearConfig.minHeight = 150
                yearConfig.aspectRatio = chartSpecs.baseChart.aspectRatio 
                yearConfig.margins = {top: 10, left: 40, right: 20, bottom: 20}
                yearConfig.colors = [chartSpecs.baseChart.color]
                var yearChart = dchelpers.getRowChart(yearConfig)
                yearChart
                    .elasticX(true)
                    .valueAccessor((d) => {
                        return d.value[this.selected];
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll("rect").on("click", (d)=>{
                            this.year = d.key
                            this.singleSubmit(d.key, 'dc-year-rowchart')
                        });
                    })
                    .controlsUseVisibility(true);
                yearChart.filter('2018')

                //CAT
                var catConfig = {};
                catConfig.id = 'cat';
                catConfig.dim = this.ndx.dimension(function (d) {
                    return d.Category;
                })
                catConfig.group = catConfig.dim.group().reduce(this.retentionAdd,this.retentionRemove,this.retentionInitial)
                catConfig.minHeight = 210
                catConfig.aspectRatio = 3 
                catConfig.margins = {top: 10, left: 40, right: 20, bottom: 20}
                catConfig.colors = d3.scale.category10()
                var catChart = dchelpers.getRowChart(catConfig)
                catChart
                    .valueAccessor((d)=> {
                        return d.value[this.selected];
                    })
                    .on('pretransition', (chart)=> {
                        chart.selectAll("rect").on("click", (d)=>{
                            this.year = d.key
                            this.singleSubmit(d.key, 'dc-cat-rowchart')
                        });
                    })
                    .controlsUseVisibility(true);

                catChart.filter('1ST TERM')

                //Call The AFSC Component HERE
                this.startAfsc = true;

                //Curent Filters button
                d3.select('#showMyFilters')
                  .on('click', ()=>{
                    var myFilters = this.toProperCase(this.pageLabel) + ' filters ';

                    dc.chartRegistry.list().forEach((d)=>{ 
                    if (d.hasFilter() && d.anchor()!='#dc-overviewmajcom-barchart' && d.anchor()!='#dc-overviewmpf-barchart') {
                        myFilters += '\n (' + d.filters() + ')'
                    } 
                    })
                     if (myFilters !== undefined) {
                        var myCheckValue = 0;
                        if (this.selected == "reEnlRate") {myCheckValue = reEnlRateND.value; };
                        if (this.selected == "keepRate") { myCheckValue = keepRateND.value };
                      // Override global options
                      toastr.options = {
                        "positionClass": "toast-bottom-full-width",
                        "closeButton":"true",
                        "preventDuplicates":"true"
                      }
                      if (myCheckValue() <= '0') {
                        toastr.warning('Your ' + this.toProperCase(this.pageLabel) + ' filter(s) returned no results. Please reset and try again.');
                      }
                      else if (myCheckValue() == '1') {
                        myFilters += ' return ' + myCheckValue() + ' ' + this.ylabel + ' result.'
                        toastr.info(myFilters);                         
                      }
                      else {
                        myFilters += ' return ' + myCheckValue() + ' ' + this.ylabel + ' results.'
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

                    FileSaver.saveAs(blob, 'PERSTAT Enlisted_Retention' + ' ' + store.state.asDate + myFilters + '.csv');
                });

                // after DOM updated redraw to make chart widths update
                this.$nextTick(() => {
                    dc.redrawAll()
                })

                //Resize
                var temp
                window.onresize = function(event) {
                    clearTimeout(temp)
                    temp = setTimeout(dc.redrawAll(), 500)
                }
                //create charts
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
        },
    }
</script>
<style src="../../../node_modules/toastr/build/toastr.css"/>
<style src="../../../node_modules/dc/dc.css"/>
<style>
#year, #cat, #afsc, #majcom, #mpf {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
<style scoped>
/* need to make this scoped */
#radioSelect div,input,label{
    cursor: pointer;
}

.form-group{
    align-content: center;
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

#category .custom-control-input:checked~.custom-control-indicator {
    background-color: rgb(18, 153, 60);
}

#category .custom-control-input:focus~.custom-control-indicator {
    box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(18, 153, 60,.25);
}

#category{
    margin-top: .5rem;
}
</style>
