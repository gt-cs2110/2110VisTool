import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import './style.pcss';

createApp(App)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        },
        options: {
            cssLayer: {
                name: 'primevue',
                order: 'tailwind-base, primevue, tailwind-utilities'
            }
        }
    })
    .mount("#app");