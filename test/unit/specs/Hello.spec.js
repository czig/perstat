import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld'
import { shallow } from 'avoriaz'

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
    //const Constructor = Vue.extend(HelloWorld)
    //const vm = new Constructor().$mount()
    const wrapper = shallow(HelloWorld, {attachToDocument: true})
    const h1 = wrapper.find('h1')[0]
    expect(h1.text()).to.equal('Welcome to Your Vue.js App')
  })
})
