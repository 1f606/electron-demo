const { autoUpdater } = require('electron-updater')
const { ipcMain } = require('electron')
let mainWindow = null;

exports.updateHandle = function updateHandle (window, feedUrl) {
  mainWindow = window;
  const returnData = {
    error: { status: 0, msg: '检测更新查询异常' },
    checking: { status: 1, msg: '正在检查应用程序更新' },
    updateNotAva: { status: 2, msg: '您现在使用的版本为最新版本,无需更新!' },
    updateAva: { status: 3, msg: '检测到新版本' },
    updateDone: { status: 5, msg: '更新完毕' },
  };
  autoUpdater.setFeedURL(feedUrl);
  //监听升级失败事件
  autoUpdater.on('error', function (error) {
    console.log(error)
    sendUpdateMessage(returnData.error)
  });
  //监听开始检测更新事件
  autoUpdater.on('checking-for-update', function (message) {
    sendUpdateMessage(returnData.checking)
  });
  autoUpdater.on('update-not-available', function (message) {
    sendUpdateMessage(returnData.updateNotAva)
  });
  autoUpdater.on('update-available', function (message) {
    sendUpdateMessage(returnData.updateAva)
  });
  autoUpdater.on('download-progress', function (progressObj) {
    sendUpdateMessage({ status: 4, msg: progressObj })
  });
  //监听下载完成事件
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
    sendUpdateMessage(returnData.updateDone)
    setTimeout(() => {
      autoUpdater.quitAndInstall()
    }, 1000);
  });

  ipcMain.on("checkForUpdate", (e, arg) => {
    console.log('开始检查更新')
    autoUpdater.checkForUpdates()
  })

}

//给渲染进程发送消息
function sendUpdateMessage (text) {
  mainWindow.webContents.send('message', text)
}
