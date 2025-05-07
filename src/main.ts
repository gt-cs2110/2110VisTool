import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import './style.css';

createApp(App)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        },
        options: {
            cssLayer: {
                name: 'primevue',
                order: 'theme, primevue, base'
            }
        }
    })
    .mount("#app");