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
      let object = this.rects[val]
      console.log(object)

      this.$store.dispatch('rect/addRect', { object: object })
    }
  }
}
