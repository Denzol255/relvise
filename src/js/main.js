import '../index.html';
import '../scss/style.scss';
import webpChecker from './modules/functions';
import clickListner from './modules/clickListner';

// Checking the browser for webp support
webpChecker();

// clicks
clickListner();
