const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('oracleDesktop', {
  isDesktop: true,
  platform: process.platform,
});
