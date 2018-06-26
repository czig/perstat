import Vue from 'vue'
import Officer from '@/components/Officer/OfficerManning'
import { mount, shallow } from 'avoriaz'
import sinon from 'sinon'
import moxios from 'moxios'
import axios from 'axios'
import chartSpecs from '@/chartSpecs'

describe('OfficerManning', () => {
    beforeEach(function() {
        moxios.install()

    })
    afterEach(function() {
        moxios.uninstall()
    })
    // must give new data that sets loaded to true 
    var newData = {
        data: [],
        selected: "percent",
        searchMajcom: "",
        searchBase: "",
        loaded: true,
        baseColor: chartSpecs.baseChart.color,
        majcomColor: chartSpecs.majcomChart.color
    }

    it('receives data through axios post and correctly decodes data', (done) => {
        const wrapper = shallow(Officer,{data: newData, attachToDocument: true})

        var sentData = [["AFSC_GROUP", "ASGNCURR", "AUTHCURR", "GRADE", "MAJCOM_T12C", "MPF", "STP"],["14",39,41,"03","02","KV",3]]
        var decodedData = [{'Grade': 'CPT', 'MAJCOM': 'AFIA', 'AFSC_Group': 'MSN SPT', 'MPF': 'KIRTLAND', 'Assigned': 39, 'Authorized': 41, 'STP': 3,'PERCENT_ASSIGNED': 95.1}]        
        moxios.wait(() => {
            let request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: {"ASOFDATE": "18-MAY-2018", "data": sentData}
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
    it('changes "selected" data property to "asgn" after clicking "assigned" radio button', () => {
        const wrapper = shallow(Officer,{data: newData, attachToDocument: true})
        $('#radio2').click()
        expect(wrapper.data().selected).to.equal("asgn")
    })
})
