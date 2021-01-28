export default {
    setActive({commit, state}, {id}) {
        for (let i = 0, l = state.rects.length; i < l; i++) {
            if (i === id) {
                commit(types.ENABLE_ACTIVE, i);
                continue;
            }

            commit(types.DISABLE_ACTIVE, i);
        }
    },
}