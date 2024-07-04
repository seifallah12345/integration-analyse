const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      const validChannels = ['login-attempt', 'add-plant', 'remove-plant', 'edit-plant', 'get-all-plants', 'open-create-account', 'create-account', 'open-user-management', 'get-all-users', 'add-user', 'remove-user', 'edit-user'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      const validChannels = ['login-failed', 'add-plant-result', 'remove-plant-result', 'edit-plant-result', 'get-all-plants-result', 'create-account-result', 'get-all-users-result', 'add-user-result', 'remove-user-result', 'edit-user-result'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  }
});
