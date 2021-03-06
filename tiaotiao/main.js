import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
 
Vue.config.productionTip = false
Vue.prototype.serverUrl = 'http://localhost:3000';
App.mpType = 'app'

Vue.use(uView);


const app = new Vue({
	...App
})
app.$mount()
