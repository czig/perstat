
<!--######################################
USAGE:

//Shell to display Header before chart
<div  v-if="!startAfsc" class="col-6">
                    <h3>
                        AFSC 
                        <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}  </span>
                        <button type="button" 
                            class="btn btn-danger btn-sm btn-rounded reset" 
                            style="visibility: hidden"
                            >Reset</button>
                    </h3>
</div>

//Parent Div must have a certain "size" such as col-x
<div v-else class="col-6">
<afsc
    :ndx="ndx"      	 //Data to Use
    :ylabel="ylabel"	 //Label - Not Required
    :selected="selected" //selected - Not Required

    :reduceAdd = "retentionAdd" 		
    :reduceRemove = "retentionRemove"
    :reduceInitial = "retentionInitial"

    dataVar="AFSC"		 //Var of data to crossfilter (Requires 6 digit ATM)
    removeBin = "I"      //Remove Empty value bins - Not Required
    					 //If Empty defaults to d.value[this.selected]
    					 //if (!selected) defaults to d.value
>
</afsc>
</div>

TODO: Find A way to load component (With Data) Without v-if
###########################################-->

<template>
<div>

<div id="dc-afsc-select" class="col-12">
    <h3>
        AFSC 
        <span v-if="Current>1">[ {{afscFilter}} ] </span>
        <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}}  </span>
        <button type="button" 
            class="btn btn-danger btn-sm btn-rounded reset" 
            style="visibility: hidden"
            @click="resetAfsc">Reset</button>
    </h3>
    <div id="afsc" class="col-12">
	    <div id="dc-afsc-rowchart">
	    </div>
	</div>
</div>


</div>
</template>

<script>

import dchelpers from '@/dchelpers'
import formats from '@/store/format'
import { store } from '@/store/store'

export default {
	props:{
		ndx:{
			type: Object,
            required: true
		},
		ylabel:{
			type: String,
            required: false
		},
		selected:{
			type: String,
            required: false
		}, 
		reduceAdd:{
			type: Function,
			required: true
		},
		reduceRemove:{
			type:Function, 
			required: true
		},
		reduceInitial:{
			type:Function,
			required: true
		},
		dataVar:{
			type:String,
			required: true
		},
		removeBin:{
			type:String,
			required: false
		},
	},
	data(){
		return {
			searchAfsc: '',
	        Group: [],
	        Dim: [],
	        Freeze: false,
	        Current: 1,
	        currOrd: '1st',
		}
	},
	computed:{
		afscFilter: function(){
	    	var word = this.searchAfsc.substring(0,this.Current);
	        return word;
	    },
	    parentReset: function(){
	    	return store.state.resetAfsc;
	    },
	},
	watch:{
		parentReset: function(val){
			if (val === true){
				this.resetAfsc();
				store.state.resetAfsc = false;
			}
		},
	},
	methods:{
		addDigit(val){
	        this.searchAfsc += '' + val;
	        //console.log(this.searchAfsc)
	        this.chooseAfscGroup();
      	},
	    updateAfsc(suggest, index){
	        //Reset AFSC
	        this.resetAfsc();
	        //set searchAfsc
	        this.searchAfsc = suggest.substring(0,index+1);
	        //Update Charts
	        this.chooseAfscGroup();
	    },
	    resetAfsc(){
	        this.searchAfsc = '';
	        this.Freeze = false;
	        //resetChart('dc-afsc-rowchart')
	        this.afscChangeGroup(0);
	        //this.resetChart('dc-afsc-select')
	        this.resetChart('dc-afsc-select')
	        this.resetChart('dc-afsc-rowchart')
	    },
	    chooseAfscGroup(){
            var len = this.searchAfsc.length;
            this.submitStart(this.searchAfsc, 'dc-afsc-select');
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == 'dc-afsc-select' 
            }).forEach(chart=>{
                var results = chart.group().all().length;
                if ((!this.Freeze) && results < 15){
                    this.afscChangeGroup(6)
                    this.Freeze = true;
                } else if (results >=15){
                    this.afscChangeGroup(len)
                    this.Freeze = false;
                }
            })
        },
        afscChangeGroup(val){
            this.currOrd = formats.ordinalNum[val+1];
            this.Current = val+1;
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == 'dc-afsc-rowchart' 
            }).forEach(chart=>{
                chart.filterAll()
                chart.dimension(this.Dim[val]).group(this.Group[val])
                //this.resetChart('dc-afsc-rowchart')
                dc.redrawAll()
            })
        },
        createAfscTools(){
            var xes = '';
            for (var i = 0;i<6;i++){
                xes = Array(5-i).join("X")
                this.Dim[i] = this.ndx.dimension((d)=> {
                        return d[this.dataVar].substring(0,i+1) + xes;
                });

                this.Group[i] = this.removeEmptyBins(this.Dim[i].group().reduce(this.reduceAdd,this.reduceRemove,this.reduceInitial));
            }
            this.Dim[6] = this.ndx.dimension((d)=> {
                        return d[this.dataVar];
                }
            );
            this.Group[6] = this.removeEmptyBins(this.Dim[6].group().reduce(this.reduceAdd,this.reduceRemove,this.reduceInitial));
        },
        resetChart: (id)=>{
            dc.chartRegistry.list().filter(chart=>{
              return chart.anchorName().indexOf(id) !== -1
            }).forEach(chart=>{
              chart.filterAll()
            })
            dc.redrawAll()
        },
        submitStart: (text,id) => {
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == id 
            }).forEach(chart=>{
                var mainArray = []
                chart.dimension().group().all().forEach((d) => {
                    mainArray.push(String(d.key))
                })
                var filterArray = mainArray.filter((d) => {
                    var element = d.toUpperCase() 
                    return element.startsWith(text.toUpperCase())
                })

                chart.filter(null)
              
                if (filterArray.length != mainArray.length) {
                    chart.filter([filterArray])
                }
            })
            dc.redrawAll()
        },
        removeEmptyBins(source_group){
            return {
                all: () => {
                    return source_group.all().filter((d) => {
                    	if (this.removeBin)
                    		return d.value[this.removeBin] != 0;
                    	else if (!this.selected)
            				return d.value !=0;	
                        else return d.value[this.selected] != 0;
                    })
                }
            }
        },
	},
	mounted(){
		console.log('AFSC MOUNTED  ' + this.dataVar);
		var afscDim = this.ndx.dimension((d)=>{
			return d[this.dataVar];
		})
		//console.log(afscDim.group().top(Infinity))
        var afscGrp = this.removeEmptyBins(afscDim.group().reduce(this.reduceAdd,this.reduceRemove,this.reduceInitial));
        var afscChart = dc.selectMenu('#dc-afsc-select');
        afscChart
                .dimension(afscDim)
                .group(afscGrp)       
                .numberVisible(10)
                .controlsUseVisibility(true);

        //AFSC Graph
        //Groups and Dim are Created by Vue for CONROL
        this.createAfscTools();

        var afscConfig = {};
        afscConfig.id = 'afsc';
        afscConfig.dim = this.Dim[0];
        afscConfig.group = this.Group[0];
        afscConfig.minHeight = 200 
        afscConfig.aspectRatio = 2.15;
        afscConfig.margins = {top: 0, left: 20, right: 30, bottom: 20}
        afscConfig.colors = d3.scale.category10()
        var afscGraph = dchelpers.getRowChart(afscConfig)
        afscGraph
            .valueAccessor((d)=> {
            	if (!this.selected)
            		return d.value;	
                else return d.value[this.selected];
            })
            //.fixedBarHeight(38)
        //On Filter change Dim/Group from Vue Method
        afscGraph.on('filtered', (chart,filter)=> {
        	if (filter && (!this.Freeze)){
                var len = this.searchAfsc.length;
                this.addDigit(filter.substring(len,len+1))
            }
        });

    	
        dc.renderAll()
        dc.redrawAll()
	}
	
}

</script>

<style scoped>
	#dc-afsc-select{
		padding-left: 0;
	}
</style>