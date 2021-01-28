import Vue from 'vue';
import Vuex from 'vuex';
import rect from './modules/rect'
import material from './modules/material'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    /**
     * Assign the modules to the store
     */
    modules: {'rect':  rect ,'material':material},

    /**
     * If strict mode should be enabled
     */
    strict: debug
});
