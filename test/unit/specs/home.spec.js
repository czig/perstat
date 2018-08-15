import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import { mount } from 'avoriaz'
import sinon from 'sinon'
import router from '@/router/index'
Vue.use(VueRouter)


describe('Home', () => {
    let sandbox
    let routerPush
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })
    afterEach(() => {
        sandbox.restore()
    })
    //trivial test
    it('says welcome', () => {
        const wrapper = mount(Home)
        expect(wrapper.text()).to.contain('Welcome!')
    })
    //another trival test, but slightly more useful, but not much
    it('is within a container', () => {
        const wrapper = mount(Home)
        const Constructor = Vue.extend(Home);
        const HomeComponent = new Constructor().$mount();
        expect(wrapper.first('div').getAttribute('class')).to.equal('container')
    })
    //beginning of relevant tests - test whether clicking on cards pushes a new route to the router
    it('pushes "/totalforce" route when clicking tf tile', () => {
        const wrapper = mount(Home, {router}) 
        routerPush = sandbox.spy(wrapper.vm.$router, 'push')
        const tfTile = wrapper.find('#tf-card')[0]
        tfTile.trigger('click')
        wrapper.update();
        expect(routerPush).to.have.been.calledWith('/totalforce')
    })
    it('pushes "/officer" route when clicking officer tile', () => {
        const wrapper = mount(Home, {router}) 
        routerPush = sandbox.spy(wrapper.vm.$router, 'push')
        const officerTile = wrapper.find('#officer-card')[0]
        officerTile.trigger('click')
        wrapper.update();
        expect(routerPush).to.have.been.calledWith('/officer')
    })
    it('pushes "/enlisted" route when clicking enlisted tile', () => {
        const wrapper = mount(Home, {router}) 
        routerPush = sandbox.spy(wrapper.vm.$router, 'push')
        const enlistedTile = wrapper.find('#enlisted-card')[0]
        enlistedTile.trigger('click')
        wrapper.update();
        expect(routerPush).to.have.been.calledWith('/enlisted')
    })
    it('pushes "/civilian" route when clicking civilian tile', () => {
        const wrapper = mount(Home, {router}) 
        routerPush = sandbox.spy(wrapper.vm.$router, 'push')
        const civilianTile = wrapper.find('#civilian-card')[0]
        civilianTile.trigger('click')
        wrapper.update();
        expect(routerPush).to.have.been.calledWith('/civilian')
    })
    it('pushes "/assignments" route when clicking assignments tile', () => {
        const wrapper = mount(Home, {router}) 
        routerPush = sandbox.spy(wrapper.vm.$router, 'push')
        const assignmentsTile = wrapper.find('#assignments-card')[0]
        assignmentsTile.trigger('click')
        wrapper.update();
        expect(routerPush).to.have.been.calledWith('/assignments')
    })
    
})
