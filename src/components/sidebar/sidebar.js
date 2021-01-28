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
  },
  methods:{
    backgroundSet(val){
        let object = this.backgrounds[val]
        
        this.$store.dispatch('material/setActive', { id: val })
        this.$store.dispatch('rect/setBackground', { object: object })
    }
  }
}
