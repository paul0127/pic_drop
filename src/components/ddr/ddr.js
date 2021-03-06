import {
    getHandler,
    getPoints,
    getSize,
    heightMap,
    pointMap,
    rad2deg,
    tr2bl,
    widthMap,
  } from '../help/helper'
  
  export default {
    name: 'ddr',
    props: {
      value: {
        default: function() {
          return {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            rotation: 88,
            active: false,
            zIndex:1
          }
        },
        type: Object,
      },
      handlerSize: {
        type: Number,
        default: 13,
      },
      zoom: {
        type: Number,
        default: 1,
      },
      isActive: {
        default: false,
        type: Boolean,
      },
      preventActiveBehavior: {
        type: Boolean,
        default: false,
      },
      resizeHandler: {
        default: function() {
          return ['tl', 'tm', 'tr', 'r', 'br', 'bm', 'bl', 'l']
        },
        type: Array,
      },
      resizable: {
        default: true,
        type: Boolean,
      },
      rotatable: {
        default: true,
        type: Boolean,
      },
      draggable: {
        default: true,
        type: Boolean,
      },
      acceptRatio: {
        default: false,
        type: Boolean,
      },
      minWidth: {
        type: Number,
        default: 1,
      },
      minHeight: {
        type: Number,
        default: 1,
      },
    },
    data() {
      return {
        transform: Object.assign({}, this.value),
        active: this.isActive,
      }
    },
    watch: {
      value(t) {
        this.transform = t
      },
      active(isActive) {
        if (isActive) {
          this.$emit('activated')
        } else {
          this.$emit('deactivated')
        }
      },
  
      isActive(val) {
        this.active = val
      },
    },
    mounted() {
      //document.documentElement.addEventListener('mousedown', this.deselect)
    },
    beforeDestroy: function() {
      //document.documentElement.removeEventListener('mousedown', this.deselect);
    },
    computed: {
      rotateHandler() {
        let size = Math.ceil(this.handlerSize / this.zoom) + 'px'
        return {
          width: size,
          height: size,
          top: -25 / this.zoom + 'px',
          'margin-left': -Math.floor(this.handlerSize / 2 / this.zoom) + 'px',
        }
      },
      style() {
        let transform = this.transform
        return {
          left: transform.x / this.zoom + 'px',
          top: transform.y / this.zoom + 'px',
          width: transform.width / this.zoom + 'px',
          height: transform.height / this.zoom + 'px',
          transform: `rotate(${transform.rotation}deg)`,
          zIndex:transform.zIndex
        }
      },
    },
    methods: {
      deselect() {
        if (this.preventActiveBehavior) {
          return
        }
        this.active = false
      },
      getNewHandler(type) {
        let cursor = getHandler(type, this.transform.rotation)
        let { handlerSize, zoom } = this
        let props = {}
        let half = -Math.floor(handlerSize / 2) / zoom + 'px'
        switch (type) {
          case 'tl':
            props = {
              top: half,
              left: half,
            }
            break
          case 'tm':
            props = { top: half, 'margin-left': half }
            break
          case 'tr':
            props = { right: half, top: half }
            break
          case 'r':
            props = { right: half, 'margin-top': half }
            break
          case 'br':
            props = { bottom: half, right: half }
            break
          case 'bm':
            props = { 'margin-left': half, bottom: half }
            break
          case 'bl':
            props = { left: half, bottom: half }
            break
          case 'l':
            props = { 'margin-top': half, left: half }
            break
        }
        return {
          cursor: cursor + '-resize',
          width: Math.ceil(handlerSize / zoom) + 'px',
          height: Math.ceil(handlerSize / zoom) + 'px',
          ...props,
        }
      },
  
      handleMouseDown(event) {
        if (!this.preventActiveBehavior) {
          this.active = true
        }
        let point = event.touches ? event.touches[0] : event
        let { clientX, clientY } = point
        this._lastX = clientX
        this._lastY = clientY
        this._activeTarget = event.target
        document.addEventListener('mousemove', this.handleMouseMove, false)
        document.addEventListener('touchmove', this.handleMouseMove, false)
        document.addEventListener('touchend', this.handleMouseUp, false)
        document.addEventListener('mouseup', this.handleMouseUp, false)
        if (event.target.dataset.type === 'rotate') {
          this._handlerType = 'rotate'
          this.handleRotateStart(event)
        } else if (this._activeTarget.dataset.resizetype) {
          this._handlerType = 'resize'
          this._parentRect = this.$refs.wrapper.parentNode.getBoundingClientRect()
          this.handleResizeStart(event)
        } else {
          this._handlerType = 'drag'
        }
      },
      handleMouseMove(event) {
        if (this._handlerType === 'resize') {
          this.handleResizeMove(event)
        } else if (this._handlerType === 'drag' && this.draggable) {
          let { clientX, clientY } = event.touches ? event.touches[0] : event
          let deltaX = clientX - this._lastX
          let deltaY = clientY - this._lastY
          this._lastX = clientX
          this._lastY = clientY
          this.transform.x = Math.round(this.transform.x + deltaX)
          this.transform.y = Math.round(this.transform.y + deltaY)
        } else if (this._handlerType === 'rotate') {
          this.handleRotateMove(event)
        }
        
        this.$emit('dragging', this.transform);
      },
      handleMouseUp() {
        document.removeEventListener('mousemove', this.handleMouseMove, false)
        document.removeEventListener('mouseup', this.handleMouseUp, false)
        document.removeEventListener('touchmove', this.handleMouseMove, false)
        document.removeEventListener('touchend', this.handleMouseUp, false)
        
      },
      handleResizeStart(event) {
        let type = event.target.dataset.resizetype
        let rect = this.transform
        let matrix = getPoints(rect)
        let pressAngle
        let opposite = matrix[pointMap[type]]
  
        let { clientX, clientY } = event.touches ? event.touches[0] : event
        let x1 = clientX - this._parentRect.left - opposite.x
        let y1 = clientY - this._parentRect.top - opposite.y
        let _width = rect.width,
          _height = rect.height
        let currentRatio = _width / _height
        if (tr2bl[type]) {
          if (widthMap[type]) _height /= 2
          pressAngle = rad2deg(Math.atan2(_width, _height))
        } else {
          if (heightMap[type]) _width /= 2
          pressAngle = rad2deg(Math.atan2(_height, _width))
        }
        let startAngle = rad2deg(Math.atan2(y1, x1))
        this._resizeOpt = {
          matrix,
          rect,
          type,
          opposite,
          currentRatio,
          pressAngle,
          startAngle,
        }
      },
      handleResizeMove(event) {
        let { clientX, clientY } = event.touches ? event.touches[0] : event
        let {
          opposite,
          currentRatio,
          type,
          pressAngle,
          startAngle,
        } = this._resizeOpt
        let x = clientX - this._parentRect.left - opposite.x,
          y = clientY - this._parentRect.top - opposite.y,
          dis = Math.hypot(y, x),
          ratio = event.shiftKey || this.acceptRatio
        let { w, h } = getSize({
          type,
          dis,
          x,
          y,
          ratio,
          startAngle,
          pressAngle,
          currentRatio,
        })
        let transform = Object.assign({}, this.transform)
        if (widthMap[type] && !ratio) {
          transform.width = w
        } else if (heightMap[type] && !ratio) {
          transform.height = h
        } else {
          transform.width = w
          transform.height = h
        }
        if (transform.width < this.minWidth) {
          transform.width = this.minWidth
        }
        if (transform.height < this.minHeight) {
          transform.height = this.minHeight
        }
        transform.width = Math.round(transform.width)
        transform.height = Math.round(transform.height)
        currentRatio = transform.width / transform.height
        let matrix = getPoints(transform)
        let _opp = matrix[pointMap[type]]
        let deltaX = -(_opp.x - opposite.x),
          deltaY = -(_opp.y - opposite.y)
        transform.x = Math.round(transform.x + deltaX)
        transform.y = Math.round(transform.y + deltaY)
        this._resizeOpt.currentRatio = currentRatio
        
        console.log(this.transform)
        if((transform.width/this.transform.width)>=(transform.height/this.transform.height)){
          transform.height = this.transform.height * (transform.width/this.transform.width)
        }else{
          transform.width = this.transform.width * (transform.height/this.transform.height)
        }
        this.transform = transform

        this.$emit('resizing', this.transform);
      },
      handleRotateStart(event) {
        let { clientX, clientY } = event.touches ? event.touches[0] : event
        let t = this.$refs.wrapper.getBoundingClientRect(),
          cx = t.left + t.width / 2,
          cy = t.top + t.height / 2,
          startAngle = (180 / Math.PI) * Math.atan2(clientY - cy, clientX - cx),
          rotation = this.transform.rotation
        this._rotateOpt = { cx, cy, startAngle, rotation }
      },
      handleRotateMove(event) {
        let { cx, cy, startAngle, rotation } = this._rotateOpt
        let { clientX, clientY } = event.touches ? event.touches[0] : event
        let x = clientX - cx,
          y = clientY - cy,
          angle = (180 / Math.PI) * Math.atan2(y, x),
          currentAngle = angle - startAngle,
          r = rotation + currentAngle
        r = r % 360
        r = r < 0 ? r + 360 : r
        this.transform.rotation = Math.floor(r)
  
        this.$emit('rotating', this.transform);
      },
    },
  }