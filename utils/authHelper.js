// src/utils/authHelper.js
let logoutHandler = null;

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

export const getLogoutHandler = () => logoutHandler;
