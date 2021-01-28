<template>
  <div id="app">
    <div class="columns">
      <div  class="content" :style="{ backgroundImage: 'url(' + background.url + ')' }">
        <DDR
          v-for="(rect, index) in rects"
          :key="index"
          :draggable="rect.draggable"
          :rotatable="rect.rotatable"
          :resizable="rect.resizable"
          :accept-ratio="rect.acceptRatio"
          :resize-handler="['tl', 'tm', 'tr', 'r', 'br', 'bm', 'l', 'bl']"
          :min-width="+rect.minWidth"
          :min-height="+rect.minHeight"
          :isActive="rect.active"
          :value="transform[index]"
          :zoom="rect.zoom"
          @activated="activateEv(index)"
          @deactivated="deactivateEv(index)"
          @dragging="changePosition($event, index)"
          @resizing="changeSize($event, index)"
          @rotating="changeRotate($event, index)"
        >
          <div class="cell" :style="{ backgroundImage: 'url(' + rect.imgUrl + ')' }"></div>
        </DDR>
      </div>
    </div>
    <div class="inspector">
      <div class="input-item" :key="item.name" v-for="item in inputs">
        <label class="input-label">{{ item.name }}</label>
        <input
          class="input-value"
          :type="item.type"
          :value="controlled[item.name]"
          @change="controlledChang(item.name,$event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DDR from './components/ddr'

export default {
  name: 'app',
  components: { DDR },
  data() {
    return {
      events: '',
      inputs: [
        { type: 'number', name: 'x' },
        { type: 'number', name: 'y' },
        { type: 'number', name: 'width' },
        { type: 'number', name: 'height' },
        { type: 'number', name: 'rotation' },
        { type: 'number', name: 'zIndex' },
      ]
    }
  },

  computed: {
    rects(){
        return this.$store.state.rect.rects
    },
    background(){
        return this.$store.state.rect.background
    },
    currentScale() {
      return `scale(1)`
    },
    transform() {
      let array = []
      this.rects.forEach((item) => {
        let { x, y, height, width, rotation, active, zIndex} = item
        array.push({
          x: +x,
          y: +y,
          width: +width,
          height: +height,
          rotation: +rotation,
          active: active,
          zIndex: zIndex
        })
      })
      return array
    },
    controlled(){
        let c = this.$store.state.rect.rects
        let x = c.find(item=>item.active==true) || {zoom: 1,x: 0,y: 0,width: 0,height: 0,rotation: 0,minHeight: 0,minWidth: 0,rotatable: true,resizable: true,draggable: true,acceptRatio: false,active: false,zIndex:1}
        
        return JSON.parse(JSON.stringify(x))
    }
  },
  methods: {
    controlledChang(name,e){
        let c = this.$store.state.rect.rects
        let x = c.findIndex(item=>item.active==true)

        switch(name){
          case 'x':
            this.$store.dispatch('rect/setLeft', { id: x, x: e.target.value })
            break
          case 'y':
            this.$store.dispatch('rect/setTop', { id: x, y: e.target.value })
            break
          case 'width':
            this.$store.dispatch('rect/setWidth', { id: x, width: e.target.value })
            break
          case 'height':
            this.$store.dispatch('rect/setHeight', {id: x,height: e.target.value,})
            break
          case 'rotation':
            this.$store.dispatch('rect/setRotate', {id: x,rotation: e.target.value,})
            break
          case 'zIndex':
            this.$store.dispatch('rect/setZindex', {id: x,z: e.target.value,})
            break
        }
    },
    activateEv(index) {
      this.$store.dispatch('rect/setActive', { id: index })
    },

    deactivateEv(index) {
      this.$store.dispatch('rect/unsetActive', { id: index })
    },
    changePosition(newRect, index) {
      this.$store.dispatch('rect/setTop', { id: index, y: newRect.y })
      this.$store.dispatch('rect/setLeft', { id: index, x: newRect.x })
      this.$store.dispatch('rect/setWidth', { id: index, width: newRect.width })
      this.$store.dispatch('rect/setHeight', {
        id: index,
        height: newRect.height,
      })
    },

    changeSize(newRect, index) {
      this.$store.dispatch('rect/setTop', { id: index, top: newRect.x })
      this.$store.dispatch('rect/setLeft', { id: index, left: newRect.y })
      this.$store.dispatch('rect/setWidth', { id: index, width: newRect.width })
      this.$store.dispatch('rect/setHeight', {
        id: index,
        height: newRect.height,
      })
    },
    changeRotate(newRect, index) {
      console.log(newRect,index)
      this.$store.dispatch('rect/setRotate', { id: index, rotation: newRect.rotation })
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  height: 100vh;
}

.columns {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.columns .header {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
  height: 60px;
  line-height: 60px;
  padding-left: 25px;
  font-size: 14px;
  font-weight: 400;
  color: #333;
}

.columns .content {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.cell {
  position: absolute;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

.inspector {
  width: 260px;
  height: 100%;
  background: #fff;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
}

.input-item {
  display: flex;
  padding: 0px 10px;
  margin-top: 10px;
}

.input-item input {
  padding-left: 8px;
}

.input-label {
  flex: 1;
}

.input-value {
  display: inline-block;
  width: 120px;
}

.footer {
  font-size: 12px;
  padding: 2px 15px;
  padding-left: 10px;
}

.footer a {
  margin-right: 20px;
  color: #989898;
  text-decoration: none;
}

@media screen and (max-width: 600px) {
  .footer a {
    color: #989898;
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
  }

  .inspector {
    width: 140px;
  }

  .input-item {
    padding: 0 5px;
  }

  .input-label {
    font-size: 10px;
  }

  .input-value {
    font-size: 10px;
    width: 70px;
  }
}
</style>
