<template>
  <div id="app">
    <ProgressBar></ProgressBar>
  </div>
</template>

<script>
import ProgressBar from './ProgressBar'
export default {
  name: 'App',
  components: {
    ProgressBar
  },
  created() {
    if (window.electron) {
      window.electron.ipcRenderer.send('checkForUpdate');
    }
  }
}
</script>
