const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()
const generateConfig = require('NeteaseCloudMusicApi/generateConfig')
const {serveNcmApi} = require('NeteaseCloudMusicApi/server')

async function startServe() {
  // 检测是否存在 anonymous_token 文件,没有则生成
  if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
  }
  // 启动时更新anonymous_token
  await generateConfig()
  await serveNcmApi({
    checkVersion: true,
  })
}
module.exports = {startServe}
