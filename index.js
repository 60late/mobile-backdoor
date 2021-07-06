export default class MobieBackdoor {
  constructor(option) {
    const defaultElement =
      document.getElementsByTagName('html') &&
      document.getElementsByTagName('html')[0]
    // 默认option
    this._options = {
      element: defaultElement, // 触发事件的element
      mode: 'both', // 触发模式 click X秒内快速点击  touch 长按X秒  both: 快速点击和长按 custom 自定义，需要配套传入 customFunction ，并且在该方法中调用callback回调
      clickActiveTime: 3000, // 快速点击激活时间，3秒10次
      touchActiveTime: 10000, // 长按激活时间
      erudaConfig: {
        // eruda的配置,参考其官网
        useShadowDom: true,
      },
    }
    // 用户option
    this.userOptions = option
    // 是否已加载
    this.erudaLoaded = false
  }

  // 初始化，
  init() {
    this._options = this.mergeOptions(this._options, this.userOptions)
    this.bindEvent()
  }

  // 合并option
  mergeOptions(defaultOptions, userOptions) {
    const results = {}
    let attrname
    for (attrname in defaultOptions) {
      results[attrname] = defaultOptions[attrname]
    }
    for (attrname in userOptions) {
      results[attrname] = userOptions[attrname]
    }
    return results
  }

  // 绑定事件
  bindEvent() {
    const { mode } = this._options

    // 可选配何种方式启动
    if (mode === 'click') {
      this.showConsoleByFastClick()
    } else if (mode === 'touch') {
      this.showConsoleByLongTouch()
    } else if (mode === 'custom') {
      // 自定义触发显示方法
      this._options.customFunction &&
        this._options.customFunction(this.loadEruda.bind(this))
    } else if (mode === 'both') {
      this.showConsoleByFastClick()
      this.showConsoleByLongTouch()
    }
  }

  // 快速点击出现
  showConsoleByFastClick() {
    let clickCount = 0
    let startTime, endTime
    const { clickActiveTime } = this._options
    this._options.element.addEventListener('click', () => {
      clickCount++
      if (clickCount === 1) {
        startTime = new Date()
      } else if (clickCount === 10) {
        clickCount = 0
        endTime = new Date()
        const processTime = endTime - startTime
        if (processTime < clickActiveTime) {
          this.loadEruda()
        }
      } else {
        // 未满10次检测时间是否超出范围，超出则从头开始计算
        endTime = new Date()
        const expireTime = endTime - startTime
        if (expireTime > clickActiveTime) {
          clickCount = 0
        }
      }
    })
  }

  // 长按出现
  showConsoleByLongTouch() {
    let timeOutEvent = null
    const { touchActiveTime } = this._options
    this._options.element.addEventListener('touchstart', () => {
      timeOutEvent = setTimeout(() => {
        clearTimeout(timeOutEvent)
        timeOutEvent = 0
        this.loadEruda()
      }, touchActiveTime)
    })

    this._options.element.addEventListener('touchmove', () => {
      clearTimeout(timeOutEvent)
      timeOutEvent = 0
    })

    this._options.element.addEventListener('touchend', () => {
      clearTimeout(timeOutEvent)
    })
  }

  // 加载eruda
  loadEruda() {
    // 如果window上已经有了eruda，那不继续执行（测试环境中会加载）
    if (this.erudaLoaded || window.eruda) {
      return
    }
    const { erudaConfig } = this._options
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/eruda'
    document.head.appendChild(script)
    script.onload = () => {
      console.log('eruda加载完毕')
      eruda && eruda.init(erudaConfig)
      this.erudaLoaded = true
    }
  }
}

window.mobieBackdoor = MobieBackdoor
