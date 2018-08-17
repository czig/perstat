import Vue from 'vue'
import Officer from '@/components/Officer/OfficerManning'
//import { mount, shallow } from 'avoriaz'
import { mount, shallowMount } from '@vue/test-utils'
import sinon from 'sinon'
import moxios from 'moxios'
import axios from 'axios'
import chartSpecs from '@/chartSpecs'

function flushAllD3Transitions() {
    var now = Date.now;
    Date.now = function() {return Infinity;}
    d3.timer.flush()
    Date.now = now;
}

// testing
describe('OfficerManning', () => {
    // Data for testing 
    // newdata - must give new data that sets loaded to true 
    let defaultData = function() {
        return {
            data: [],
            selected: "percent",
            searchMajcom: "",
            searchBase: "",
            loaded: true,
            baseColor: chartSpecs.baseChart.color,
            majcomColor: chartSpecs.majcomChart.color
        }
    }    
    let asgnData = function() {
        return {
            data: [],
            selected: "asgn",
            searchMajcom: "",
            searchBase: "",
            loaded: true,
            baseColor: chartSpecs.baseChart.color,
            majcomColor: chartSpecs.majcomChart.color
        }
    }    
    // data to be sent over axios
    let sentData = function() {
        return [["AFSC_GROUP", "ASGNCURR", "AUTHCURR", "GRADE", "MAJCOM_T12C", "MPF", "STP"],["14",39,41,"03","02","KV",3]];
    }
    //data to test against
    let unformatObj = {'GRADE': '03', 'MAJCOM_T12C': '02', 'AFSC_GROUP': '14', 'MPF': 'KV', 'ASGNCURR': 39, 'AUTHCURR': 41, 'STP': 3};
    let decodedData = [{'Grade': 'CPT', 'MAJCOM': 'AFIA', 'AFSC_Group': 'MSN SPT', 'MPF': 'KIRTLAND', 'Assigned': 39, 'Authorized': 41, 'STP': 3,'PERCENT_ASSIGNED': 95.1}];
    let decodedData2 = [{'Grade': 'MAJ', 'MAJCOM': 'AFIA', 'AFSC_Group': 'MSN SPT', 'MPF': 'KIRTLAND', 'Assigned': 39, 'Authorized': 41, 'STP': 3,'PERCENT_ASSIGNED': 95.1}];
    let fakeGroup = {
        'all': function() {
            return [
                {'key': 'a', 'value': {'asgn': 1, 'auth':1, 'stp':1, 'percent': 100, 'stpPercent': 100}},
                {'key': 'b', 'value': {'asgn': 0, 'auth':0, 'stp':0, 'percent': 0, 'stpPercent': 0}}
            ]        
        }
    }

    var sandbox;
    const anonymousStub = sinon.stub()
    beforeEach(function() {
        moxios.install()
        //stub API endpoint
        moxios.stubRequest('http://localhost:5005/api/officer_post',{
            status: 200,
            response: {"ASOFDATE": "18-MAY-2018", "data": sentData()}
        })
        sandbox = sinon.sandbox.create();
    })
    afterEach(function() {
        moxios.uninstall();
        sandbox.restore();

    })

    describe('formatData function', () => {
        it('should return correctly formatted values', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: true})
            var formatObj = wrapper.vm.formatData(unformatObj)
            expect(formatObj).to.deep.equal(decodedData[0]) 
        })
    })

    describe('makeObject function', () => {
        it('should return array of correctly formatted objects', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: true})
            var formatArray = wrapper.vm.makeObject(sentData());
            expect(formatArray).to.deep.equal(decodedData)
        })
    })

    describe('axios call', (done) => {
        it('should receive data through axios post and correctly decode data', (done) => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: true})
            //stub dc when not testing charts 
            sandbox.stub(dc)
            //stub render charts to only test axios call
            wrapper.setMethods({ renderCharts: anonymousStub }) 

            moxios.wait(() => {
                wrapper.vm.$nextTick(() => {
                    //finish all d3 transitions
                    flushAllD3Transitions();
                    //must use deep equality here when comparing objects
                    //accessing first (and only) element here because error log makes more sense 
                    expect(wrapper.vm.data[0]).to.deep.equal(decodedData[0])
                    //need done here to finish if successful test
                    done()
                })
            })
        })
    })

    describe('radio buttons', () => {
        beforeEach(function() {
            //stub dc when not testing charts 
            sandbox.stub(dc)
        })
        //test radio buttons
        it('"selected" data property should be "percent" by default', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: true})
            //stub renderCharts to only test radio buttons
            wrapper.setMethods({ renderCharts: anonymousStub }) 
            expect(wrapper.vm.selected).to.equal("percent")
        })
        it('changes "selected" data property to "asgn" after clicking "assigned" radio button', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: true})
            //stub renderCharts to only test radio buttons
            wrapper.setMethods({ renderCharts: anonymousStub }) 
            wrapper.find('#radio2').trigger('change')
            expect(wrapper.vm.selected).to.equal("asgn")
        })
        it('changes "selected" data property to "auth" after clicking "authorized" radio button', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: true})
            //stub renderCharts to only test radio buttons
            wrapper.setMethods({ renderCharts: anonymousStub }) 
            wrapper.find('#radio3').trigger('change')
            expect(wrapper.vm.selected).to.equal("auth")
        })
        it('changes "selected" data property to "stp" after clicking "stp" radio button', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: true})
            //stub renderCharts to only test radio buttons
            wrapper.setMethods({ renderCharts: anonymousStub }) 
            wrapper.find('#radio4').setChecked(true)
            expect(wrapper.vm.selected).to.equal("stp")
        })
        it('changes "selected" data property to "percent" after clicking "percent" radio button', () => {
            const wrapper = shallowMount(Officer,{data: asgnData, attachToDocument: false})
            //stub renderCharts to only test radio buttons
            wrapper.setMethods({ renderCharts: anonymousStub }) 
            wrapper.find('#radio1').trigger('change')
            expect(wrapper.vm.selected).to.equal("percent")
        })
    })

    describe('manningInitial reduce function', () => {
        it('should return an object', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var initialObj = wrapper.vm.manningInitial()
            expect(initialObj).to.be.an('object');
            
        }) 
        it('should return object with correct properties', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var initialObj = wrapper.vm.manningInitial()
            var keys = Object.keys(initialObj)
            expect(keys).to.have.lengthOf(5)
            expect(keys).to.deep.equal(['asgn','auth','stp','percent','stpPercent']);
            
        }) 
        it('should return object with zero for all properties', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var initialObj = wrapper.vm.manningInitial()
            expect(initialObj).to.deep.equal({asgn: 0, auth: 0, stp: 0, percent: 0, stpPercent: 0});
            
        }) 
    })

    describe('manningAdd reduce function', () => {
        it('should return an object with correct count properties and percentages', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var accumulator = {asgn: 0, auth: 0, stp: 0, percent: 0, stpPercent: 0}
            var newObj = {Assigned: 1, Authorized: 1, STP: 1} 
            var resultObj = wrapper.vm.manningAdd(accumulator,newObj)
            expect(resultObj).to.deep.equal({asgn: 1, auth: 1, stp:1, percent: 100, stpPercent: 100})
            
        })
        it('should handle 0/0', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var accumulator = {asgn: 0, auth: 0, stp: 0, percent: 0, stpPercent: 0}
            var newObj = {Assigned: 0, Authorized: 0, STP: 0} 
            var resultObj = wrapper.vm.manningAdd(accumulator,newObj)
            expect(resultObj).to.deep.equal({asgn: 0, auth: 0, stp: 0, percent: 0, stpPercent: 0})
            
        })
        it('should handle 1/0', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var accumulator = {asgn: 0, auth: 0, stp: 0, percent: 0, stpPercent: 0}
            var newObj = {Assigned: 1, Authorized: 0, STP: 1} 
            var resultObj = wrapper.vm.manningAdd(accumulator,newObj)
            expect(resultObj).to.deep.equal({asgn: 1, auth: 0, stp: 1, percent: 0, stpPercent: 0})
            
        })
        it('should calculate percentages to 1 decimal place', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var accumulator = {asgn: 0, auth: 0, stp: 0, percent: 0, stpPercent: 0}
            var newObj = {Assigned: 1, Authorized: 3, STP: 1} 
            var resultObj = wrapper.vm.manningAdd(accumulator,newObj)
            expect(resultObj).to.deep.equal({asgn: 1, auth: 3, stp: 1, percent: 33.3, stpPercent: 33.3})
            
        })
    })

    describe('manningRemove reduce function', () => {
        it('should return an object with correct count properties and percentages', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var accumulator = {asgn: 2, auth: 2, stp: 2, percent: 100, stpPercent: 100}
            var newObj = {Assigned: 1, Authorized: 1, STP: 1} 
            var resultObj = wrapper.vm.manningRemove(accumulator,newObj)
            expect(resultObj).to.deep.equal({asgn: 1, auth: 1, stp:1, percent: 100, stpPercent: 100})
            
        })
        it('should handle 0/0', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var accumulator = {asgn: 0, auth: 0, stp: 0, percent: 0, stpPercent: 0}
            var newObj = {Assigned: 0, Authorized: 0, STP: 0} 
            var resultObj = wrapper.vm.manningRemove(accumulator,newObj)
            expect(resultObj).to.deep.equal({asgn: 0, auth: 0, stp: 0, percent: 0, stpPercent: 0})
            
        })
        it('should handle 1/0', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var accumulator = {asgn: 1, auth: 1, stp: 1, percent: 100, stpPercent: 100}
            var newObj = {Assigned: 0, Authorized: 1, STP: 0} 
            var resultObj = wrapper.vm.manningRemove(accumulator,newObj)
            expect(resultObj).to.deep.equal({asgn: 1, auth: 0, stp: 1, percent: 0, stpPercent: 0})
            
        })
        it('should calculate percentages to 1 decimal place', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var accumulator = {asgn: 1, auth: 4, stp: 1, percent: 25, stpPercent: 25}
            var newObj = {Assigned: 0, Authorized: 1, STP: 0} 
            var resultObj = wrapper.vm.manningRemove(accumulator,newObj)
            expect(resultObj).to.deep.equal({asgn: 1, auth: 3, stp: 1, percent: 33.3, stpPercent: 33.3})
            
        })
    })

    describe('removeEmptyBins function', () => {
        it('should remove one object from the group', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            var resultGroup = wrapper.vm.removeEmptyBins(fakeGroup)
            expect(resultGroup.all()).to.have.lengthOf(1)
            expect(resultGroup.all()[0]).to.deep.equal(fakeGroup.all()[0])
        })
        //TODO: test removing groups with 'selected' equal to different values 
    })

    describe('grade row chart', () => {
        it('should be an object', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            expect(wrapper.vm.gradeChart).to.be.an('object');
            
        })
        it('should render grade row chart with svg wrapper', (done) => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})

            moxios.wait(() => {
                wrapper.vm.$nextTick(() => {
                    //finish all d3 transitions
                    flushAllD3Transitions();
                    expect(wrapper.vm.gradeChart.svg()[0]).to.not.be.empty
                    done()
                })
            })
        })
        it('should render grade row chart with one bar', (done) => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            moxios.wait(() => {
                wrapper.vm.$nextTick(() => {
                    //finish all d3 transitions
                    flushAllD3Transitions();
                    expect(wrapper.vm.gradeChart.selectAll('rect')[0]).to.have.lengthOf(1);
                    done()
                })
            })
        })
        it('should have the correct data bound to it', (done) => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            moxios.wait(() => {
                wrapper.vm.$nextTick(() => {
                    //finish all d3 transitions
                    flushAllD3Transitions();
                    //have to check for correct length first, or else foreach loop gives erroneous test for 0 length arrays
                    expect(wrapper.vm.gradeChart.selectAll('rect')[0]).to.have.lengthOf(1);
                    wrapper.vm.gradeChart.selectAll('rect')[0].forEach((d,i) => {
                        //TODO: when we use more data, reduce data and compare to that reduced data
                        expect(d.__data__.key).to.equal(decodedData[i].Grade)
                        expect(d.__data__.value.asgn).to.equal(decodedData[i].Assigned) 
                        expect(d.__data__.value.auth).to.equal(decodedData[i].Authorized) 
                        expect(d.__data__.value.stp).to.equal(decodedData[i].STP) 
                        expect(d.__data__.value.percent).to.equal(decodedData[i].PERCENT_ASSIGNED) 
                    })
                    done()
                })
            })
        })
    })

    describe('afscGroup bar chart', () => {
        it('should be an object', () => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            expect(wrapper.vm.afscGroupChart).to.be.an('object');
            
        })
        it('should render afscGroup bar chart with svg wrapper', (done) => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})

            moxios.wait(() => {
                wrapper.vm.$nextTick(() => {
                    //finish all d3 transitions
                    flushAllD3Transitions();
                    expect(wrapper.vm.afscGroupChart.svg()[0]).to.not.be.empty
                    done()
                })
            })
        })
        it('should render afscGroup bar chart with two bars', (done) => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            moxios.wait(() => {
                wrapper.vm.$nextTick(() => {
                    //finish all d3 transitions
                    flushAllD3Transitions();
                    expect(wrapper.vm.afscGroupChart.selectAll('rect.bar')[0]).to.have.lengthOf(1);
                    done()
                })
            })
        })
        it('should have the correct data bound to it', (done) => {
            const wrapper = shallowMount(Officer,{data: defaultData, attachToDocument: false})
            moxios.wait(() => {
                wrapper.vm.$nextTick(() => {
                    //finish all d3 transitions
                    flushAllD3Transitions();
                    //have to check for correct length first, or else foreach loop gives erroneous test for 0 length arrays
                    expect(wrapper.vm.afscGroupChart.selectAll('rect.bar')[0]).to.have.lengthOf(1);
                    wrapper.vm.afscGroupChart.selectAll('rect.bar')[0].forEach((d,i) => {
                        //TODO: when we use more data, reduce data and compare to that reduced data
                        expect(d.__data__.data.key).to.equal(decodedData[i].AFSC_Group)
                        expect(d.__data__.data.value.asgn).to.equal(decodedData[i].Assigned) 
                        expect(d.__data__.data.value.auth).to.equal(decodedData[i].Authorized) 
                        expect(d.__data__.data.value.stp).to.equal(decodedData[i].STP) 
                        expect(d.__data__.data.value.percent).to.equal(decodedData[i].PERCENT_ASSIGNED) 
                    })
                    done()
                })
            })
        })
    })

})
