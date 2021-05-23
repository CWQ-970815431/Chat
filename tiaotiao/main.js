import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
//引入socket模块
import io from "components/socket/weapp.socket.io.js"
 
 
Vue.config.productionTip = false

Vue.prototype.serverUrl = 'http://localhost:3000';
Vue.prototype.socket = io('http://localhost:8082');


App.mpType = 'app'

Vue.use(uView);


const app = new Vue({
	...App
})
app.$mount()
