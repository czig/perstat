
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
        <span style="font-size: 14pt; opacity: 0.87;"> {{ylabel}} </span>
        <button type="button" 
            class="btn btn-danger btn-sm btn-rounded reset" 
            style="visibility: hidden"
            @click="resetAfsc">Reset</button>
    </h3>
    <transition name="expandMid">
        <div v-show="anim" id="afsc" class="col-12" key="1">
    	    <div id="dc-afsc-rowchart">
    	    </div>
    	</div>
    </transition>
</div>


</div>
</template>

<script>

import dchelpers from '@/dchelpers'
import formats from '@/store/format'
import { store } from '@/store/store'

export default {
	props:{
        value: {
            type: String, 
            required: false
        },
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
        minHeight: {
            type: Number,
            required: false
        },
        aspectRatio: {
            type: Number,
            required: false
        }
	},
	data(){
		return {
			searchAfsc: '',
	        Group: [],
	        Dim: [],
	        Freeze: false,
	        Current: 1,
	        currOrd: '1st',
            anim: false
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
        searchAfsc: function(val){
            this.$emit('input', val);
        },
	},
	methods:{
		addDigit(val){
			//Put Error at the bottom on AFSC1
			if (val === 'E' && this.Current === 1)
				val = '*';
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
            if (len == 4)
            	len+=1;
            this.submitStart(this.searchAfsc, 'dc-afsc-select');
            dc.chartRegistry.list().filter(chart=>{
                return chart.anchorName() == 'dc-afsc-select' 
            }).forEach(chart=>{
                var results = chart.group().all().length;
                if ((!this.Freeze) && results < 15){
                    this.afscChangeGroup(5)
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

            //AFSC1 - With Labels
            xes = Array(5).join("X")
            this.Dim[0] = this.ndx.dimension((d)=> {
            	var temp = d[this.dataVar].substring(0,1);
            	if (temp === '*')
            		return 'ERROR - MISSING AFSC'; 
	            return temp + xes + ' - ' + formats.AFSC1[temp];
	        });

            this.Group[0] = this.removeEmptyBins(this.Dim[0].group()
                .reduce(this.reduceAdd,this.reduceRemove,this.reduceInitial)); 

            //AFSC2 - With Labels
            xes = Array(4).join("X")
            this.Dim[1] = this.ndx.dimension((d)=> {
	            var temp = d[this.dataVar].substring(0,2);
	            return temp + xes + ' - ' + formats.AFSC2[temp];
	        });

            this.Group[1] = this.removeEmptyBins(this.Dim[1].group()
                .reduce(this.reduceAdd,this.reduceRemove,this.reduceInitial));
			
			//AFSC3 WITH LABELS
			xes = Array(3).join("X")
            this.Dim[2] = this.ndx.dimension((d)=> {
	            var temp = d[this.dataVar].substring(0,3);
	            return temp + xes + ' - ' + formats.AFSC3[temp];
	        });

            this.Group[2] = this.removeEmptyBins(this.Dim[2].group()
                .reduce(this.reduceAdd,this.reduceRemove,this.reduceInitial));

            //AFSC4 WITH LABELS
            this.Dim[3] = this.Dim[2];
            this.Group[3] = this.Group[2];

			//AFSC5 WITH LABELS
			
            this.Dim[4] = this.ndx.dimension((d)=> {
	            var temp = d[this.dataVar];
	            return temp  + ' - ' + formats.AFSC6[temp];
	        });

            this.Group[4] = this.removeEmptyBins(this.Dim[4].group()
                .reduce(this.reduceAdd,this.reduceRemove,this.reduceInitial));

           	//AFSC6
           	this.Dim[5] = this.Dim[4];
            this.Group[5] = this.Group[4];
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
        var afscGrp = this.removeEmptyBins(afscDim.group()
            .reduce(this.reduceAdd,this.reduceRemove,this.reduceInitial));
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
        // console.log('minheight:')
        // console.log(this.minHeight)
        // console.log('aspectration:')
        // console.log(this.aspectRatio)
        afscConfig.minHeight = this.minHeight || 200 
        afscConfig.aspectRatio = this.aspectRatio || 1.8;
        afscConfig.margins = {top: 0, left: 20, right: 30, bottom: 20}
        afscConfig.colors = d3.scale.category10()
        var afscGraph = dchelpers.getRowChart(afscConfig)
        afscGraph
            .valueAccessor((d)=> {
            	if (!this.selected)
            		return d.value;	
                else return d.value[this.selected];
            })

        //afscGraph.transitionDuration(1500)
            //.fixedBarHeight(38)
        //On Filter change Dim/Group from Vue Method
        afscGraph.on('filtered', (chart,filter)=> {
        	if (filter && (!this.Freeze)){
                var len = this.searchAfsc.length;
                this.anim=false;
                setTimeout(()=>{ this.anim=true; }, 800);
                this.addDigit(filter.substring(len,len+1))
            }
            if (this.Freeze)
                this.$emit('input', filter);
        });

        /*
        afscGraph.on('pretransition', (chart)=> {
            var rowData=[];
            chart.select('svg').selectAll('.row rect').each(function(d){
                rowData.push(d);
            })
    	    chart.selectAll('g .row').on("click",function(d){
                console.log(rowData)
            })
        })
        */  
        this.anim=true;
        dc.renderAll()
        dc.redrawAll()
	}
	
}

</script>

<style scoped>
    #dc-afsc-select >>> .dc-select-menu{
        display:none;
    }

	#dc-afsc-select{
		padding-left: 0;
        /* height: 400px; */
	}

    .expandMid-enter-active, .expandMid-leave-active {
      /* transition: all 2s ease; */
      animation: bounce-in 1.1s;
      /* max-height: 600px; */
      overflow: hidden;
    }
/*     .expandMid-enter, .expandMid-leave-to {
      //animation: bounce-in .8s reverse;
      //max-height: 0;
    }
 */
    @keyframes bounce-in {
      0% {
        transform: scaleY(0);
      }
      
      100% {
        transform: scaleY(1);
      }
    }
</style>
