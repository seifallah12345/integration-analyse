const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./sqlserver.js'); // Updated to use sqlserver.js

let mainWindow;
let inventoryWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  mainWindow.loadFile('index.html');
}

function createInventoryWindow() {
  inventoryWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  inventoryWindow.loadFile('inventory.html');
}

function createAccountWindow() {
  const accountWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  accountWindow.loadFile('createAccount.html');
}

app.whenReady().then(async () => {
  createWindow();
  await db.connectToDatabase(); // Connect to the database when the app is ready

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('login-attempt', async (event, { email_phone, password }) => {
  try {
    const user = await db.findUser(email_phone, password);
    if (user) {
      createInventoryWindow();
      mainWindow.close();
    } else {
      mainWindow.webContents.send('login-failed', 'User does not exist');
    }
  } catch (err) {
    mainWindow.webContents.send('login-failed', 'An error occurred');
  }
});

ipcMain.on('open-create-account', () => {
  createAccountWindow();
});

ipcMain.on('add-plant', async (event, plant) => {
  try {
    const { URLSearchParams } = await import('url');
    const formData = new URLSearchParams(plant);
    const fetch = await import('node-fetch');
    const response = await fetch.default('http://localhost/addPlant.php', {
      method: 'POST',
      body: formData
    });
    const text = await response.text();
    console.log('Response text:', text);
    const data = JSON.parse(text); // Try to parse the JSON response
    if (data.success) {
      const plants = await fetchPlants();
      event.sender.send('add-plant-result', { success: true, plants });
    } else {
      event.sender.send('add-plant-result', { success: false, message: data.error });
    }
  } catch (err) {
    event.sender.send('add-plant-result', { success: false, message: err.message });
  }
});

ipcMain.on('remove-plant', async (event, { plant_id }) => {
  try {
    const { URLSearchParams } = await import('url');
    const formData = new URLSearchParams({ plant_id });
    const fetch = await import('node-fetch');
    const response = await fetch.default('http://localhost/removePlant.php', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.success) {
      const plants = await fetchPlants();
      event.sender.send('remove-plant-result', { success: true, plants });
    } else {
      event.sender.send('remove-plant-result', { success: false, message: data.error });
    }
  } catch (err) {
    event.sender.send('remove-plant-result', { success: false, message: err.message });
  }
});

ipcMain.on('edit-plant', async (event, plant) => {
  try {
    const { URLSearchParams } = await import('url');
    const formData = new URLSearchParams(plant);
    const fetch = await import('node-fetch');
    const response = await fetch.default('http://localhost/editPlant.php', {
      method: 'POST',
      body: formData
    });

    const text = await response.text(); // Get the raw response text
    let data;
    try {
      data = JSON.parse(text); // Attempt to parse the JSON
    } catch (e) {
      throw new Error('Failed to parse JSON response');
    }

    if (data.success) {
      const plants = await fetchPlants();
      event.sender.send('edit-plant-result', { success: true, plants });
    } else {
      event.sender.send('edit-plant-result', { success: false, message: data.error });
    }
  } catch (err) {
    event.sender.send('edit-plant-result', { success: false, message: err.message });
  }
});

ipcMain.on('get-all-plants', async (event) => {
  try {
    const plants = await fetchPlants();
    event.reply('get-all-plants-result', plants);
  } catch (error) {
    event.reply('get-all-plants-result', { error: 'Failed to fetch plants' });
  }
});

ipcMain.on('add-user', async (event, user) => {
  try {
    const { URLSearchParams } = await import('url');
    const formData = new URLSearchParams(user);
    const fetch = await import('node-fetch');
    const response = await fetch.default('http://localhost/addUser.php', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.success) {
      event.sender.send('add-user-result', { success: true });
    } else {
      event.sender.send('add-user-result', { success: false, message: data.error });
    }
  } catch (err) {
    event.sender.send('add-user-result', { success: false, message: err.message });
  }
});

async function fetchPlants() {
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch('http://localhost/getPlants.php');
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch plants');
  }
}
