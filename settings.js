'use strict';

const url = window.location.hostname == 'localhost'
    ? window.location.origin
    : window.location.origin + '/app';

export {
  url
}