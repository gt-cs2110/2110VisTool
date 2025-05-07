import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import './style.css';
import { definePreset } from '@primevue/themes';
import type { PrimeVueConfiguration } from 'primevue';

createApp(App)
    .use(PrimeVue, {
        theme: {
            preset: definePreset(Aura, {
                semantic: {
                    colorScheme: {
                        light: {
                            primary: {
                                0: '{emerald.0}',
                                50: '{emerald.50}',
                                100: '{emerald.100}',
                                200: '{emerald.200}',
                                300: '{emerald.300}',
                                400: '{emerald.400}',
                                500: '{emerald.500}',
                                600: '{emerald.600}',
                                700: '{emerald.700}',
                                800: '{emerald.800}',
                                900: '{emerald.900}',
                                950: '{emerald.950}'
                            },
                            surface: {
                                0: '{stone.0}',
                                50: '{stone.50}',
                                100: '{stone.100}',
                                200: '{stone.200}',
                                300: '{stone.300}',
                                400: '{stone.400}',
                                500: '{stone.500}',
                                600: '{stone.600}',
                                700: '{stone.700}',
                                800: '{stone.800}',
                                900: '{stone.900}',
                                950: '{stone.950}'
                            },
                            content: {
                                background: '{surface.0}'
                            }
                        },
                        dark: {
                            primary: {
                                0: '{emerald.0}',
                                50: '{emerald.50}',
                                100: '{emerald.100}',
                                200: '{emerald.200}',
                                300: '{emerald.300}',
                                400: '{emerald.400}',
                                500: '{emerald.500}',
                                600: '{emerald.600}',
                                700: '{emerald.700}',
                                800: '{emerald.800}',
                                900: '{emerald.900}',
                                950: '{emerald.950}'
                            },
                            surface: {
                                0: '{stone.0}',
                                50: '{stone.50}',
                                100: '{stone.100}',
                                200: '{stone.200}',
                                300: '{stone.300}',
                                400: '{stone.400}',
                                500: '{stone.500}',
                                600: '{stone.600}',
                                700: '{stone.700}',
                                800: '{stone.800}',
                                900: '{stone.900}',
                                950: '{stone.950}'
                            },
                            content: {
                                background: '{surface.800}'
                            }
                        }
                    }
                }
            }),
            options: {
                cssLayer: {
                    name: 'primevue',
                    order: 'theme, base, primevue'
                }
            }
        },
    } satisfies PrimeVueConfiguration)
    .mount("#app");