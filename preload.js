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

contextBridge.exposeInMainWorld('audioBridge', {
  openSoundSettings: () => ipcRenderer.invoke('open-sound-settings')
});

contextBridge.exposeInMainWorld('pptViewBridge', {
  openDialog:       ()     => ipcRenderer.invoke('ppt-open-dialog'),
  convertAndOpen:   (path) => ipcRenderer.invoke('ppt-convert-and-open', path)
});
