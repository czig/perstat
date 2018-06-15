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
        router
    })
    afterEach(() => {
        sandbox.restore()
    })
    it('says welcome', () => {
        //test here
        const wrapper = mount(Home)
        const Constructor = Vue.extend(Home);
        const HomeComponent = new Constructor().$mount();

        expect(HomeComponent.$el.textContent).to.contain('Welcome!')
    })
    it('is within a container', () => {
        const Constructor = Vue.extend(Home);
        const HomeComponent = new Constructor().$mount();
        expect(HomeComponent.$el.localName).to.equal('div')
        expect(HomeComponent.$el._prevClass).to.equal('container')
    })
    it('pushes "tf" route when clicking tf tile', () => {
        const wrapper = mount(Home, {router}) 
        routerPush = sandbox.spy(wrapper.vm.$router, 'push')
        const tfTile = wrapper.find('#tf-card')[0]
        tfTile.trigger('click')
        wrapper.update();
        expect(routerPush).to.have.been.calledWith('/tf')
    })
    
})
