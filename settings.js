'use strict';

window.url = window.location.hostname === 'localhost'
    ? 'https://localhost:8000'
    : window.location.origin + '/app';
