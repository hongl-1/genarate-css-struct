#!/usr/bin/env node
// const commander = require('commander');
// const path = require('path')
// const program = commander.program
//
// // 配置command
// program
//   .command(`init`)
//   .description('初始化一个插件sample项目')
//   .action((options) => {
//     console.log(options)
//   })
// program
//   .command(`file`)
//   .description('初始化获取一个文件')
//   .argument('<string>', 'a file name')
//   .action((fileName) => {
//     const filePath = path.resolve(__dirname, fileName)
//     console.log(filePath)
//   })
//
// program.version('1.0.0')
//
// program.parse(process.argv)
require('../lib/bundle.cjs.js')

