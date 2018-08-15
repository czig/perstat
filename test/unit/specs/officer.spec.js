import Vue from 'vue'
import Officer from '@/components/Officer/OfficerManning'
import { mount, shallow } from 'avoriaz'
import sinon from 'sinon'
import moxios from 'moxios'
import axios from 'axios'
import chartSpecs from '@/chartSpecs'

// testing
describe('OfficerManning', () => {
    // Data for testing 
    // newdata - must give new data that sets loaded to true 
    let newData = {
        data: [],
        selected: "percent",
        searchMajcom: "",
        searchBase: "",
        loaded: true,
        baseColor: chartSpecs.baseChart.color,
        majcomColor: chartSpecs.majcomChart.color
    }
    // data to be sent over axios
    let sentData = [["AFSC_GROUP", "ASGNCURR", "AUTHCURR", "GRADE", "MAJCOM_T12C", "MPF", "STP"],["14",39,41,"03","02","KV",3]];
    let decodedData = [{'Grade': 'CPT', 'MAJCOM': 'AFIA', 'AFSC_Group': 'MSN SPT', 'MPF': 'KIRTLAND', 'Assigned': 39, 'Authorized': 41, 'STP': 3,'PERCENT_ASSIGNED': 95.1}];

    beforeEach(function() {
        moxios.install()

    })
    afterEach(function() {
        moxios.uninstall()
    })

    describe('axios call', () => {
        it('receives data through axios post and correctly decodes data', (done) => {
            const wrapper = shallow(Officer,{data: newData, attachToDocument: true})

            moxios.wait(() => {
                let request = moxios.requests.mostRecent()
                //have to make a copy of variable with slice because variable is being mutated - TODO: fix this 
                request.respondWith({
                    status: 200,
                    response: {"ASOFDATE": "18-MAY-2018", "data": sentData.slice()}
                }).then(() => {
                    //must use deep equality here when comparing objects
                    //accessing first (and only) element here because error log makes more sense 
                    expect(wrapper.data().data[0]).to.deep.equal(decodedData[0])
                    //need done here to finish if successful test
                    done()
                // need to catch done here to finish if failed test
                }).catch(done)
            })
        })
    })

    describe('radio buttons', () => {
        //test radio buttons
        it('changes "selected" data property to "asgn" after clicking "assigned" radio button', () => {
            const wrapper = shallow(Officer,{data: newData, attachToDocument: true})
            $('#radio2').click()
            expect(wrapper.data().selected).to.equal("asgn")
        })
        it('changes "selected" data property to "auth" after clicking "authorized" radio button', () => {
            const wrapper = shallow(Officer,{data: newData, attachToDocument: true})
            $('#radio3').click()
            expect(wrapper.data().selected).to.equal("auth")
        })
        it('changes "selected" data property to "stp" after clicking "stp" radio button', () => {
            const wrapper = shallow(Officer,{data: newData, attachToDocument: true})
            $('#radio4').click()
            expect(wrapper.data().selected).to.equal("stp")
        })
        it('changes "selected" data property to "percent" after clicking "percent" radio button', () => {
            const wrapper = shallow(Officer,{data: newData, attachToDocument: true})
            $('#radio1').click()
            expect(wrapper.data().selected).to.equal("percent")
        })
    })

    describe('grade row chart', () => {
        it('builds a grade row chart', (done) => {
            const wrapper = mount(Officer,{data: newData, attachToDocument: true})
            //var decodedData = [{'Grade': 'CPT', 'MAJCOM': 'AFIA', 'AFSC_Group': 'MSN SPT', 'MPF': 'KIRTLAND', 'Assigned': 39, 'Authorized': 41, 'STP': 3,'PERCENT_ASSIGNED': 95.1}]        
            moxios.wait(() => {
                let request = moxios.requests.mostRecent()
                // TODO: fix mutability of sentData when put in response
                request.respondWith({
                    status: 200,
                    response: {"ASOFDATE": "18-MAY-2018", "data": sentData.slice()}
                }).then(() => {
                    wrapper.update()
                    console.log(wrapper.data().gradeChart.selectAll('rect'))
                    console.log(wrapper.data().gradeChart.selectAll('rect')[0][0].__data__)
                    console.log(wrapper.data().gradeChart.selectAll('rect'))
                    expect(wrapper.data().gradeChart.selectAll('rect')[0].length).to.equal(1)
                    done()
                }).catch(done)
            })
        })
    })

})
