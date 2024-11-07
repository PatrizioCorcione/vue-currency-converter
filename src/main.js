// main.js
import { createApp } from 'vue';
import AppMain from './components/AppMain.vue';
import './assets/main.css';
import VueApexCharts from "vue3-apexcharts";

const app = createApp(AppMain);
app.use(VueApexCharts);
app.mount('#app');

