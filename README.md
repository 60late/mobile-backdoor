# BROKER CONSOLE 移动端后门调试程序

## 组件简介

本组件主用于解决移动端线上问题排查困难的痛点，通过用户的特殊操作（3 秒内连续点击屏幕 10 次或者长按屏幕 10 秒），调出 eruda 查看页面报错，进行问题排查

## 快速上手

1. 安装

```
npm install @broker/console
```

tip： 因为是发到 58npm 上的，如果安装失败在 .npmrc 文件中中加入：

```
@broker:registry=http://ires.58corp.com/repository/npm/
```

2. 使用

```
import BrokerConsole from '@broker/console'
const brokerConsole = new BrokerConsole({})
brokerConsole.init()
```

## 例子

- 只使用长按唤出

```
const brokerConsole = new BrokerConsole({
    element: document.getElementById('testDiv') // 触发事件的element
    mode: 'touch', // 触发模式 click X秒内快速点击  touch 长按X秒  both: 快速点击和长按
    touchActiveTime: 1000, // 长按激活时间
    erudaConfig: {
        // eruda的配置,参考其官网
        useShadowDom: true,
    },
})
brokerConsole.init()
```

- 使用自定义方法

```

const brokerConsole = new BrokerConsole({
    element: document.getElementById('testDiv') // 触发事件的element
    mode: 'custom', // 触发模式 click X秒内快速点击  touch 长按X秒  both: 快速点击和长按 custom 自定义，需要配套传入 customFunction ，并且在该方法中调用callback回调
    customFunction:(callback)=>{
        console.log('调用了自定义方法')
            setTimeout(()=>{
            callback()
        },3000)
    }
    erudaConfig: {
        // eruda的配置,参考其官网
        useShadowDom: true,
    },
})
brokerConsole.init()
```

## 配置项

目前所有配置项均非必须，组件内部有设置兜底默认值，但是建议自行对某些值进行配置

| 名称            | 说明                                                                                                                                                                          | 类型               | 默认值                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------- |
| element         | 点击哪个元素触发后门调试程序                                                                                                                                                  | HTML DOM           | html 标签，即点击整个页面时触发 |
| mode            | 后门触发的模式, click:X 秒内快速点击,touch:长按 X 秒, both: 快速点击和长按均可触发,custom: 外部自定义触发方法，需要配套传入 customFunction ，并且在该方法中调用 callback 函数 | 单元格             | 'both'                          |
| clickActiveTime | 快速点击唤起时间,mode 为 click 或者 both 时生效                                                                                                                               | Number             | 3000 (毫秒)                     |
| touchActiveTime | 长按屏幕唤起时间，mode 为 touch 或者 both 时生 e 效                                                                                                                           | Number             | 10000 （毫秒）                  |
| erudaConfig     | eruda 的配置，具体配置见 [eruda 官网](https://github.com/liriliri/eruda/blob/master/doc/README_CN.md)                                                                         | Object             | { useShadowDom: true }          |
| customFunction  | 自定义唤起方法，mode 为 custom 时生效,使用该方法一定要调用 callback 函数，否则唤起不会生效数                                                                                  | (callback) => void | -                               |

### 方法

| 名称 | 说明       |
| ---- | ---------- |
| init | 初始化程序 |
