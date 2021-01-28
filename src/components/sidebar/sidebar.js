export default {
  name: 'sidebar',
  props: {
    backgrounds: {
      default: function() {
        return {
          name: '',
          url: '',
        }
      },
      type: Array,
    },
    rects: {
      default: function() {
        return {
          name: '',
          url: '',
        }
      },
      type: Array,
    },
  },
  methods:{
    backgroundSet(val){
        let object = this.backgrounds[val]
        
        this.$store.dispatch('material/setActive', { id: val })
        this.$store.dispatch('rect/setBackground', { object: object })
    },
    add_rect(val){
      let url = this.rects[val].imgUrl
      let img = new Image()
      img.src = url;
        
      let object ={
        zoom:1,
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
        rotation: 0,
        minHeight: 10,
        minWidth: 10,
        rotatable: true,
        resizable: true,
        draggable: true,
        acceptRatio: false,
        active: false,
        zIndex:1,
        imgUrl:url,
      }
      
      this.$store.dispatch('rect/addRect', { object: object })
    }
  }
}
