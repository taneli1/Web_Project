'use strict';

const urlExport = window.location.hostname === 'localhost'
    ? window.location.origin
    : window.location.origin + '/app';

export {
  urlExport
}