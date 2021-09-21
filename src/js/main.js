import '../index.html';
import '../scss/style.scss';
import webpChecker from './modules/functions';
import clickListner from './modules/clickListner';
import sendForm from './modules/sendForm';

// Checking the browser for webp support
webpChecker();

// Clicks
clickListner();

// Sending email form
sendForm();
