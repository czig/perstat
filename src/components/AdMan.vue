<template>
    <div class="container">
        <div class="row">
            <h1 class="col">AD Manning</h1>
            <!--<div class="col-auto dc-data-count">-->
                <!--<span class="filter-count"></span> -->
                <!--PASCODEs selected out of -->
                <!--<span class="total-count"></span>-->
            <!--</div>-->
        </div>
        <div class="row pt-2"> 
            <div id="radioSelect" class="col form-group">
                <input name="radio" type="radio" id="radio1" checked="checked" value="percent" v-model="selected" @click="radioButton">
                <label for="radio">Percentage</label>
                <input name="group2" type="radio" id="radio2" value="asgn" v-model="selected" @click="radioButton">
                <label for="radio">Assigned</label>
                <input name="group3" type="radio" id="radio3" value="auth" v-model="selected" @click="radioButton">
                <label for="radio3">Authorized</label>
            </div>
            <div class="col-auto">
                <button type="button" 
                        class="btn btn-danger btn-rounded btn-sm waves-effect" 
                        @click="resetAll">Reset All</button>
            </div>
        </div>
        <div class="row">
            <div id="majcom" class="col-12">
                <div id="dc-majcom-barchart">
                    <h3>MAJCOM <small>{{ylabel}}</small>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-majcom-barchart')">Reset</button>
                    </h3>
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
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div id="grade" class="col-4">
                <div id="dc-grade-rowchart">
                    <h3>Grade <small>{{ylabel}}</small>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-grade-rowchart')">Reset</button>
                    </h3>
                </div>
            </div>
            <div id="afscGroup" class="col-8">
                <div id="dc-afscGroup-barchart">
                    <h3>AFSC Group <small>{{ylabel}}</small>
                    <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="display: none"
                            @click="resetChart('dc-afscGroup-barchart')">Reset</button>
                    </h3>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dchelpers from '@/dchelpers'

    export default {
        data() {
            return {
                data: [],
                selected: "percent"
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
            else {
                return "Authorized"
            }
          }
        },
        methods: {
          resetAll: (event)=>{
            //Emulate javascript:dc.filterAll();dc.redrawAll()
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
          }
        },
        created: function(){
          console.log('created')
          var data = require('@/assets/data/ps_off.csv')
          this.data = data
        },
        mounted() {
            console.log('mounted')
            dc.dataCount(".dc-data-count")
              .dimension(this.ndx)
              .group(this.allGroup)

            //radio button
            //d3.selectAll('#radioSelect')
            //    .on('click', function() {
            //        setTimeout(function(){
            //            dc.redrawAll();
            //        },10)
            //    })
            
            //reduce functions
            function manningAdd(p,v) {
                p.asgn = p.asgn + +v.ASGNCURR
                p.auth = p.auth + +v.AUTHCURR
                p.stp = p.stp + +v.STP
                //if divide by 0, set to 0, and if NaN, set to zero
                p.percent = p.asgn/p.auth === Infinity ? 0 : Math.round((p.asgn/p.auth)*1000)/10 || 0
                p.stpPercent = p.stp/p.auth === Infinity ? 0 : Math.round((p.stp/p.auth)*1000)/10 || 0
                return p
            }
            function manningRemove(p,v) {
                p.asgn = p.asgn - +v.ASGNCURR
                p.auth = p.auth - +v.AUTHCURR
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
            //stacking functions
            function multikey(x,y) {
                return x + 'x' + y
            }
            function splitkey(k) {
                return k.split('x');
            }
            function stack_second(group) {
                return {
                    all: function() {
                        var all = group.all(),
                        m = {};
                        //matrix of multikey/value pairs
                        all.forEach(function(kv) {
                            var ks = splitkey(kv.key);
                            m[ks[0]] = m[ks[0]] || {};
                            m[ks[0]][ks[1]] = kv.value;
                        });
                        //then produce multivalue key/value pairs
                        return Object.keys(m).map(function(k) {
                            return {key: k, value: m[k]};
                        });
                    }
                };
            }

            //Location
            var majcomConfig = {}
            majcomConfig.id = 'majcom'
            majcomConfig.dim = this.ndx.dimension(function(d){return d.MAJCOM_T12C})
            var majcomPercent = majcomConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
            majcomConfig.group = removeEmptyBins(majcomPercent)
            console.log(majcomConfig.group.all())
            majcomConfig.minHeight = 300
            majcomConfig.aspectRatio = 5
            majcomConfig.margins = {top: 30, left: 40, right: 30, bottom: 100}
            majcomConfig.colors = ["#1976d2"]
            var majcomChart = dchelpers.getOrdinalBarChart(majcomConfig)
            majcomChart
                .elasticX(true)
                .group(majcomConfig.group, "1",(d) => {
                    return d.value[this.selected]
                })
                .stack(majcomConfig.group, "2",(d) => {
                    return d.value[this.selected === "asgn" ? "stp" : 0]
                })
                .ordinalColors(["#1976d2","#ff4500"])
                .legend(dc.legend().horizontal(true).legendText((d) => {
                    if (d.name === '1') {
                        return 'PP'
                    } else {
                        return 'STP'
                    }
                }))
                .on('pretransition', function(chart) {
                    chart.selectAll('rect.bar')
                        .classed('stack-deselected', function(d) {
                            //d.x is majcom and d.layer is assigned or stp
                            return chart.filter() && chart.filters().indexOf(d.x) === -1
                        })
                        .on('click', function(d) {
                            chart.filter(d.x)
                            dc.redrawAll()
                        })
                })

            //Number Display for Auth, Asgn, STP - show total for filtered content
            var auth = this.ndx.groupAll().reduceSum(function(d) { return +d.AUTHCURR })
            var authND = dc.numberDisplay("#auth")
            authND.group(auth)
                .formatNumber(d3.format(".g"))
                .valueAccessor(function(d) { return d;})
                .html({
                    one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                })
            var asgn = this.ndx.groupAll().reduceSum(function(d) { return +d.ASGNCURR})
            var asgnND = dc.numberDisplay("#asgn")
            asgnND.group(asgn)
                .formatNumber(d3.format(".g"))
                .valueAccessor(function(d) {return d;})
                .html({
                    one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                })
            var stp = this.ndx.groupAll().reduceSum(function(d) { return +d.STP})
            var stpND = dc.numberDisplay("#stp")
            stpND.group(stp)
                .formatNumber(d3.format(".g"))
                .valueAccessor(function(d) {return d;})
                .html({
                    one:"<span style=\"color:steelblue; font-size: 20px;\">%number</span>"
                })
                
            //grade
            var gradeOrder = {
              "LTC": 5,
              "MAJ": 4,
              "CPT": 3,
              "1LT": 2,
              "2LT": 1
            }
            var gradeArray =["2LT","1LT","CPT","MAJ","LTC"]
            var gradeConfig = {}
            gradeConfig.id = 'grade'
            gradeConfig.dim = this.ndx.dimension(function(d){return gradeArray[+d.GRADE-1]})
            gradeConfig.group = gradeConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
            gradeConfig.minHeight = 200 
            gradeConfig.aspectRatio = 2
            gradeConfig.margins = {top: 10, left: 40, right: 30, bottom: 20}
            gradeConfig.colors = d3.scale.category10()
            var gradeChart = dchelpers.getRowChart(gradeConfig)
            gradeChart
                .valueAccessor((d)=> {
                    return d.value[this.selected];
                })
                .ordering(function(d){
                  return gradeOrder[d.key]
                })
            
            //afscGroup
            var afscGroupConfig = {}
            afscGroupConfig.id = 'afscGroup'
            afscGroupConfig.dim = this.ndx.dimension(function(d){return d.AFSC_GROUP})
            afscGroupConfig.group = afscGroupConfig.dim.group().reduce(manningAdd,manningRemove,manningInitial)
            afscGroupConfig.minHeight = 200 
            afscGroupConfig.aspectRatio = 3 
            afscGroupConfig.margins = {top: 10, left: 40, right: 30, bottom: 80}
            afscGroupConfig.colors = ["#108b52"] 
            var afscGroupChart = dchelpers.getOrdinalBarChart(afscGroupConfig)
            afscGroupChart
                .valueAccessor((d)=> {
                    return d.value[this.selected];
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
        },
        beforeUpdate() {
            console.log("beforeupdate")
        },
        beforeDestroy() {
            console.log("beforeDestroy")
            dc.chartRegistry.clear()
        },
        destroyed() {
            console.log("destroyed")
        }
    }
</script>

<style src="../../node_modules/dc/dc.css">
</style>
<style>
div[id*="-barchart"] .x.axis text{
    text-anchor: end !important;
    transform: rotate(-45deg);
  }

div[id*="-rowchart"] g.row text{
    fill: black;
}
</style>
