import {
    ENABLE_ACTIVE,
    DISABLE_ACTIVE,
} from './mutation-types';

export default {
    [ENABLE_ACTIVE](state, id) {
        state.backgrounds[id].active = true;
    },
    [DISABLE_ACTIVE](state, id) {
        state.backgrounds[id].active = false;
    },
}