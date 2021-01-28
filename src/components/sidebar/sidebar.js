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
        
    }
  }
}
