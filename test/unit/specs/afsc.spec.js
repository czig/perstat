import Vue from 'vue'
import afsc from '@/components/afsc'
import { mount , shallow } from 'avoriaz'
import sinon from 'sinon'

describe('afsc.vue', () => {
    let documentStub;

    //create stub for document object before each test
    //beforeEach(function() {
    //    //stubbed function will return dummy object with required properties
    //    var dummy = {
    //        id: 'afsc',
    //        className: 'col-8'
    //    }
    //    //stub getElementById calls on document object
    //    documentStub = sinon.stub(document,'getElementById')
    //    documentStub.withArgs('afsc').returns(dummy)
    //})

    //afterEach(function() {
    //    documentStub.restore();
    //})

	var data1 = [
		{AFSC: '11111', cat:1, value: 11, value1: 111},
		{AFSC: '22222', cat:2, value: 22, value1: 222}
	];
	var data2 = [
		{AFSC2: '11111', cat:1, value: 11},
		{AFSC2: '22222', cat:2, value: 22}
	];
	var data3 = [
		{AFSC: '11111', cat:1, value: 0, value1: 111},
		{AFSC: '22222', cat:2, value: 22, value1: 222}
	];

	var ndx1 = crossfilter(data1);
	var ndx2 = crossfilter(data2);
	var ndx3 = crossfilter(data3);

	var label = 'Good Label';

	var sel = 'val1';

	function add1(p,v){
		p.val += +v.value
		p.val1 += +v.value1
		return p
	}

	function remove1(p,v){
		p.val -= +v.value
		p.val1 -= +v.value1
		return p
	}

	function initial1(){
		return {
			val: 0,
			val1: 0
		}
	}

	var dVar = "AFSC"
	var remBin = "val"

	var props1 = {
		ndx: ndx1,
		ylabel: label,
		selected: sel,
		reduceAdd: add1,
		reduceRemove: remove1,
		reduceInitial: initial1,
		dataVar: dVar,
		removeBin: remBin
	}
/*
	:ndx="ndx"      	 //Data to Use
    :ylabel="ylabel"	 //Label - Not Required
    :selected="selected" //selected - Not Required

    :reduceAdd = "retentionAdd" 		
    :reduceRemove = "retentionRemove"
    :reduceInitial = "retentionInitial"

    dataVar="AFSC"		 //Var of data to crossfilter (Requires 6 digit ATM)
    removeBin = "I"  
*/
	
  function getMe(val){
  	return val;
  }

  it('should render correct contents', () => {
    const wrapper = shallow(afsc, { propsData: props1, attachToDocument: true})

    expect(wrapper.data().Group[0].all()[0].key.substr(0,5)).to.equal('1XXXX')
    expect(wrapper.data().Group[1].all()[0].key.substr(0,5)).to.equal('11XXX')
    expect(wrapper.data().Group[2].all()[0].key.substr(0,5)).to.equal('111XX')
    expect(wrapper.data().Group[3].all()[0].key.substr(0,5)).to.equal('111XX')
    expect(wrapper.data().Group[4].all()[0].key.substr(0,5)).to.equal('11111')

    expect(wrapper.data().Group[0].all()[0].value.val).to.equal(11)
    expect(wrapper.data().Group[0].all()[0].value.val1).to.equal(111)


    expect(wrapper.data().Group[0].all()[1].key.substr(0,2)).to.equal('2X')
    expect(wrapper.data().Group[1].all()[1].key.substr(0,5)).to.equal('22XXX')
    expect(wrapper.data().Group[2].all()[1].key.substr(0,5)).to.equal('222XX')
    expect(wrapper.data().Group[3].all()[1].key.substr(0,5)).to.equal('222XX')
    expect(wrapper.data().Group[4].all()[1].key.substr(0,5)).to.equal('22222')

    expect(wrapper.data().Group[0].all()[1].value.val).to.equal(22)
    expect(wrapper.data().Group[0].all()[1].value.val1).to.equal(222)

  })

  var props2 = {
		ndx: ndx3,
		ylabel: label,
		selected: sel,
		reduceAdd: add1,
		reduceRemove: remove1,
		reduceInitial: initial1,
		dataVar: dVar,
		removeBin: ''
	}

  it('should not require "removeBin" prop', () => {
    const wrapper = shallow(afsc, { propsData: props2, attachToDocument: true})

    expect(wrapper.data().Group[0].all()[0].key.substr(0,2)).to.equal('1X')
    expect(wrapper.data().Group[0].all()[0].value.val).to.equal(0)
    expect(wrapper.data().Group[0].all()[0].value.val1).to.equal(111)


    expect(wrapper.data().Group[0].all()[1].key.substr(0,2)).to.equal('2X')
    expect(wrapper.data().Group[0].all()[1].value.val).to.equal(22)
    expect(wrapper.data().Group[0].all()[1].value.val1).to.equal(222)

  })

  var props3 = {
    	ndx: ndx3,
    	ylabel: label,
    	selected: sel,
    	reduceAdd: add1,
    	reduceRemove: remove1,
    	reduceInitial: initial1,
    	dataVar: dVar,
    	removeBin: 'val'
    }

  it(' "removeBin" prop should remove empty bins by value', () => {
    const wrapper = shallow(afsc, { propsData: props3, attachToDocument: true})

    expect(wrapper.data().Group[0].all()[0].key.substr(0,2)).to.equal('2X')
    expect(wrapper.data().Group[0].all()[0].value.val).to.equal(22)
    expect(wrapper.data().Group[0].all()[0].value.val1).to.equal(222)

    //Only one left -- Since val=0 gets removed
    expect(wrapper.data().Group[0].all().length).to.equal(1)

  })

  var props4 = {
    	ndx: ndx3,
    	ylabel: label,
    	selected: 'val',
    	reduceAdd: add1,
    	reduceRemove: remove1,
    	reduceInitial: initial1,
    	dataVar: dVar,
    	removeBin: ''
    }

  it(' "removeBin" empty should default to removing by "selected"', () => {
    const wrapper = shallow(afsc, { propsData: props4, attachToDocument: true})

    expect(wrapper.data().Group[0].all()[0].key.substr(0,2)).to.equal('2X')
    expect(wrapper.data().Group[0].all()[0].value.val).to.equal(22)
    expect(wrapper.data().Group[0].all()[0].value.val1).to.equal(222)

    //Only one left -- Since val=0 gets removed
    expect(wrapper.data().Group[0].all().length).to.equal(1)

  })

  var props5 = {
    	ndx: ndx1,
    	ylabel: label,
    	selected: '',
    	reduceAdd: add1,
    	reduceRemove: remove1,
    	reduceInitial: initial1,
    	dataVar: dVar,
    	removeBin: ''
    }

  it(' "selected" can be empty', () => {
    const wrapper = shallow(afsc, { propsData: props5, attachToDocument: true})

    expect(wrapper.data().Group[0].all()[0].key.substr(0,5)).to.equal('1XXXX')
    expect(wrapper.data().Group[1].all()[0].key.substr(0,5)).to.equal('11XXX')
    expect(wrapper.data().Group[2].all()[0].key.substr(0,5)).to.equal('111XX')
    expect(wrapper.data().Group[3].all()[0].key.substr(0,5)).to.equal('111XX')
    expect(wrapper.data().Group[4].all()[0].key.substr(0,5)).to.equal('11111')

    expect(wrapper.data().Group[0].all()[0].value.val).to.equal(11)
    expect(wrapper.data().Group[0].all()[0].value.val1).to.equal(111)


    expect(wrapper.data().Group[0].all()[1].key.substr(0,2)).to.equal('2X')
    expect(wrapper.data().Group[1].all()[1].key.substr(0,5)).to.equal('22XXX')
    expect(wrapper.data().Group[2].all()[1].key.substr(0,5)).to.equal('222XX')
    expect(wrapper.data().Group[3].all()[1].key.substr(0,5)).to.equal('222XX')
    expect(wrapper.data().Group[4].all()[1].key.substr(0,5)).to.equal('22222')

    expect(wrapper.data().Group[0].all()[1].value.val).to.equal(22)
    expect(wrapper.data().Group[0].all()[1].value.val1).to.equal(222)

  })

  var props6 = {
    	ndx: ndx1,
    	ylabel: '',
    	selected: '',
    	reduceAdd: add1,
    	reduceRemove: remove1,
    	reduceInitial: initial1,
    	dataVar: dVar,
    	removeBin: ''
    }

  it(' "ylabel" is optional', () => {
    const wrapper = shallow(afsc, { propsData: props6, attachToDocument: true})

    expect(wrapper.getProp('ylabel')).to.equal('')
  })

})
