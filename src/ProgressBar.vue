<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :closable="false"
      :close-on-click-modal="false"
      :mask-closable="false"
      :close-on-press-escape="false"
      :show-close="false"
      :modal="false"
      title="发现新版本，更新中..."
    >
      <el-progress
        :percent="percent"
        :stroke-width="20"
        :text-inside="true"
      />
      <div slot="footer">
        <el-button type="primary" @click="handleClose">后台更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      percent: 0
    }
  },
  created() {
    if (window.electron) {
      window.electron.ipcRenderer.send('checkForUpdate')
    }
  },
  mounted() {
    window.electron.ipcRenderer.on('message', (event, data) => {
      console.log('message', event, data)
      switch (data.status) {
        case 0:
          this.$message({
            type: 'error',
            message: data.msg
          })
          break
        case 1:
        case 2:
        case 5:
          this.$message({
            type: 'info',
            message: data.msg
          })
          break
        case 3:
          this.dialogVisible = true
          this.$message({
            type: 'info',
            message: data.msg
          })
          break
        case 4:
          this.percent = parseInt(data.msg.percent)
          break
      }
    })
  },
  methods: {
    handleClose(done) {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
