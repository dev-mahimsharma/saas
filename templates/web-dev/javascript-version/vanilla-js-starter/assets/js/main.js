import { formatDate } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Hello World! Vanilla JS Starter Initialized.");
    
    const displayElement = document.getElementById('date-display');
    if (displayElement) {
        displayElement.textContent = `Today is ${formatDate(new Date())}`;
    }
});
