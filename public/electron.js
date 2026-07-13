const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");

let mainWindow;

// Electron 官方推荐
const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    autoHideMenuBar: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  // 隐藏菜单
  Menu.setApplicationMenu(null);

  // 加载页面
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Electron Ready
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 全部关闭
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// ========================
// Image Processor
// ========================

const imageProcessor = require("./imageProcessor");

// 批量处理图片
ipcMain.handle("process-images", async (event, files, options) => {
  try {
    const results = await imageProcessor.processImages(files, options);

    return {
      success: true,
      results
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: err.message
    };
  }
});

// 选择输入目录
ipcMain.handle("select-input-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"]
  });

  if (result.canceled) return null;

  return result.filePaths[0];
});

// 选择输出目录
ipcMain.handle("select-output-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"]
  });

  if (result.canceled) return null;

  return result.filePaths[0];
});

// 选择图片
ipcMain.handle("select-images", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile", "multiSelections"],
    filters: [
      {
        name: "Images",
        extensions: [
          "jpg",
          "jpeg",
          "png",
          "webp",
          "gif",
          "bmp",
          "tiff",
          "avif"
        ]
      }
    ]
  });

  if (result.canceled) return [];

  return result.filePaths;
});
