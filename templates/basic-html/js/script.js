import { APP_NAME } from "./config.js";

const el = document.querySelector("#app-title");
if (el) el.textContent = APP_NAME;
console.log("Bootnode ready");
