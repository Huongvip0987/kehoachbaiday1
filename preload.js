const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('navBridge', {
  openLesson:  (path) => ipcRenderer.invoke('open-lesson', path),
  openLibrary: ()     => ipcRenderer.invoke('open-library')
});

contextBridge.exposeInMainWorld('pyBridge', {
  runSteps: (code) => ipcRenderer.invoke('run-python-steps', code)
});

contextBridge.exposeInMainWorld('quizBridge', {
  openQuiz: () => ipcRenderer.invoke('open-quiz')
});

contextBridge.exposeInMainWorld('caroBridge', {
  openCaro: () => ipcRenderer.invoke('open-caro')
});

contextBridge.exposeInMainWorld('pptxBridge', {
  showSaveDialog: ()     => ipcRenderer.invoke('pptx-save-dialog'),
  captureSlide:   ()     => ipcRenderer.invoke('pptx-capture-slide'),
  saveFile:       (data) => ipcRenderer.invoke('pptx-save-file', data)
});

contextBridge.exposeInMainWorld('audioBridge', {
  openSoundSettings: () => ipcRenderer.invoke('open-sound-settings')
});
