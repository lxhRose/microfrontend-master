import * as singleSpa from 'single-spa'; // waiting for this to be merged: https://github.com/CanopyTax/single-spa/pull/156
window.SystemJS = window.System;

export function hashPrefix(prefix) {
  if (!prefix) {
    return () => true;
  }
  return function (location) {
    return location.hash.startsWith(`#${prefix}`);
  };
}

export async function loadApp(name, hash, appURL) {
  singleSpa.registerApplication(
    name,
    () => SystemJS.import(appURL),
    hashPrefix(hash)
  );
}
