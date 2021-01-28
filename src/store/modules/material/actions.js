import types, {CHANGE_ZINDEX} from './mutation-types';

export default {
    setActive({commit, state}, {id}) {
        for (let i = 0, l = state.backgrounds.length; i < l; i++) {
            if (i === id) {
                commit(types.ENABLE_ACTIVE, i);
                continue;
            }

            commit(types.DISABLE_ACTIVE, i);
        }
    },
}