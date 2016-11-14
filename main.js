'use strict';

// import main electron library
const electron = require('electron');
// Assign IPC for main file
const ipcMain = require('electron').ipcMain;
// Assign dialog module here (for displaying dialog boxes)
const dialog = require('electron').dialog
// Asign Browser Window module
const BrowserWindow = electron.BrowserWindow;

// Initialize app
const app = electron.app;

// Set up global variable for acccessing external data from JSON file
global.bingoes = require('./data.json')

// Declare windows we plan to use
var mainWindow, winnerWindow = null;

// On app start initialize main interface
app.on('ready', function() {
  mainWindow = new BrowserWindow({
    height: 620,
    width: 820,
    resizable: false,
    frame: false
  });

  // Disable web dev tools if they are attempted to open
  mainWindow.webContents.on("devtools-opened", () => {
    mainWindow.webContents.closeDevTools();
  });

  // Load the index.html page on teh main window
  mainWindow.loadURL('file://' + __dirname + '/index.html');

});


// When a message from IPC is received from renderer process that game has ended, show dialog box
ipcMain.on('open-game-end-page', function (event) {
  const options = {
    type: 'info',
    title: 'Play Again?',
    message: "Want to play again?",
    buttons: ['Yes', 'No, quit']
  }
  // Check user's response to determine if message should be sent back to reload game or quit out of the app
  dialog.showMessageBox(options, function (index) {
    if (index == 1) app.quit();
    event.sender.send('information-dialog-selection', index)
  })
})