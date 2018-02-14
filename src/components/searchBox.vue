
<!--##########################################
<searchBox
    v-model:value="searchMajcom"
    label="Search MAJCOM"
    size="3"
    @sub="submit(searchMajcom,'dc-majcom-barchart')"
    color="red"
    button="true"
    buttonLabel="Feeling Lucky"
    btnColor="#5a95f5"
></searchBox>

TODO: Prevent typed text to overflow in the 'close-icon'
###########################################-->
<template>
<div class="row" style="margin-top:13px">
	<div :class="'col-' + size">
		<div class="md-form">
			<div  style="position:relative;top: 10px;">
		        <div class='searchTip' :style="getColor">
		            <span v-show="searchVar.length>0">
		                {{ label }}
		            </span>
		        </div>
		        <input 	type="text"  class="form-control" v-model="searchVar" :placeholder="label"
										@keydown.enter.stop.prevent="action" @focus="focus = true" @blur="focus = false"
										:style="[getShadow,getBorderBottom]">
		        <div v-show="searchVar.length>0"
		             class='searchRemove'
		             @click="searchVar=''">
		            <i 	class="close-icon" @mouseenter="hover=true" @mouseleave="hover=false"
										:style="[getBackground, getIconShadow,]"></i>
		        </div>
		    </div>
		</div>
	</div>
	<div class="col-auto" style="top:-3px">
		<button v-if="bIf" class="btn btn-primary btn-sm" @click="action" :style="getBackgroundColor"> {{ bLabel }} </button>
	</div>
</div>
</template>

<script>

export default {
	props:{
		size:{
			type: String,
			required: true
		},
		value: {
			type: String,
            required: true
		},
		label:{
			type: String,
            required: true
		},
		button:{
			type: String,
			required: false
		},
		buttonLabel:{
			type: String,
			required: false
		},
		color:{
			type: String,
			required: false
		},
		btnColor:{
			type:String,
			required: false
		}
	},
	data(){
		return {
			searchVar: this.value,
			bLabel: this.buttonLabel ? this.buttonLabel : "Search",
			bIf: this.button ? true : false,
			colorGiven: this.color ? this.color : "#4d8bf9",
			buttonColor: this.btnColor ? this.btnColor : this.color,
			hover: false,
			focus: false,
		}
	},
	computed:{
		getColor(){
			return {
				color: this.colorGiven
			}
		},
		getBackgroundColor(){
			return {
				'background-color': this.buttonColor + ' !important'
			}
		},
		getBackground(){
			if (this.msieversion())
				return {
				background: '-ms-linear-gradient(-45deg, transparent 0%, transparent 46%,' +
										this.colorGiven + ' 46%,' + this.colorGiven +
										' 56%,transparent 56%, transparent 100%), -webkit-linear-gradient(45deg, transparent 0%, transparent 46%,' +
										this.colorGiven + ' 46%,' + this.colorGiven + ' 56%,transparent 56%, transparent 100%)'
				}
			else return {
				background: '-webkit-linear-gradient(-45deg, transparent 0%, transparent 46%,' +
										this.colorGiven + ' 46%,' +  this.colorGiven +
										' 56%,transparent 56%, transparent 100%), -webkit-linear-gradient(45deg, transparent 0%, transparent 46%,' +
										this.colorGiven + ' 46%,' + this.colorGiven + ' 56%,transparent 56%, transparent 100%)'
				}
		},
		getIconShadow(){
			if (this.hover)
				return {
					'box-shadow': '0px 0px 5px 3px ' + this.colorGiven,
				}
			else return {}
		},
		getShadow(){
			if (this.focus)
				return {
					'box-shadow': '0 1px 0 ' + this.colorGiven + ',0px 2px 6px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.24)',
				}
			else return {}
		},
		getBorderBottom(){
			if (this.focus)
				return {
					'border-bottom': '2px solid ' + this.colorGiven,
				}
			else return {}
		}
	},
	watch: {
	    searchVar(val) {
	      	//Update Parent
	      	this.$emit('input', val);
	    },
	    value(val){
	    	//Update this from Parent
	    	this.searchVar = val;
	    },
	},
	methods:{
		action(){
			//tell Parent we want to submit input field
			this.$emit('sub');
		},
		msieversion() {
		    var ua = window.navigator.userAgent;
		    var msie = ua.indexOf("MSIE ");
		    var trident = ua.indexOf('Trident/');
		    var edge = ua.indexOf('Edge/');

		    if (msie > 0 || trident > 0 || edge > 0 || !!
							navigator.userAgent.match(/Trident.*rv\:11\./))
		       return true
		    return false;
		}
	},
}

</script>

<style scoped>

.searchTip{
    position: absolute;
    top: -90%;
    left: 0;
    padding-left: 5px;
    font-size: 10px;
    font-weight:bold;
    height: 10px;
}
.close-icon
{
  display:block;
  box-sizing:border-box;
  width:18px;
  height:18px;
  border: none;
  border-color:transparent;
  border-radius:100%;
  background-color:transparent;
  //box-shadow:0px 0px 5px 2px rgba(0,0,0,0.5);
  transition: all 0.3s ease;
}
.close-icon:hover{
    //border-width:3px;
    //border-style: solid;
    //box-shadow:0px 0px 5px 2px blue;
    //background-color:white;
}
.searchRemove{
    position: absolute;
    top: -30%;
    right: 0;
    color: black;
    padding-left: 5px;
    //font-size: 10px;
    height: 30px;
    width: 30px;
    cursor:pointer;
}
input[type="text"].form-control{
    color:black;
    padding:5px;
    border-radius: 5px;
    position: relative;
    transform: translateY(-50%);
    margin-bottom: 0px;
    box-sizing: border-box;
    background-color: #ffffff;
    box-shadow:0px 1px 3px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.24);
}

.md-form{
	margin-bottom: 0;
}
button.btn.btn-primary.btn-sm {
	margin: 0;
	padding: .5rem 1.5rem;
}

</style>
