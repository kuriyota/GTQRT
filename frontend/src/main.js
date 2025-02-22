
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { StyleProvider, Themes } from "@varlet/ui";

import './style/main.css'
import '@varlet/ui/es/button/style/index'
import '@varlet/ui/es/style'

const app = createApp(App);

StyleProvider(Themes.md3Dark)

app.use(router);
app.mount("#app");