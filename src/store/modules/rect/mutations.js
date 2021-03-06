import {
    ENABLE_ACTIVE,
    DISABLE_ACTIVE,
    ENABLE_ASPECT,
    DISABLE_ASPECT,
    ENABLE_DRAGGABLE,
    DISABLE_DRAGGABLE,
    ENABLE_RESIZABLE,
    DISABLE_RESIZABLE,
    ENABLE_PARENT_LIMITATION,
    DISABLE_PARENT_LIMITATION,
    ENABLE_SNAP_TO_GRID,
    DISABLE_SNAP_TO_GRID,
    CHANGE_ZINDEX,
    ENABLE_BOTH_AXIS,
    ENABLE_X_AXIS,
    ENABLE_Y_AXIS,
    ENABLE_NONE_AXIS,
    CHANGE_HEIGHT,
    CHANGE_LEFT,
    CHANGE_MINH,
    CHANGE_MINW,
    CHANGE_TOP,
    CHANGE_WIDTH,
    CHANGE_ANGLE,
    SET_BACKGROUNDS,
    ADD_RECT,
} from './mutation-types';

export default {
    [ENABLE_ACTIVE](state, id) {
        state.rects[id].active = true;
    },
    [DISABLE_ACTIVE](state, id) {
        state.rects[id].active = false;
    },

    [ENABLE_ASPECT](state, id) {
        state.rects[id].aspectRatio = true;
    },
    [DISABLE_ASPECT](state, id) {
        state.rects[id].aspectRatio = false;
    },

    [ENABLE_DRAGGABLE](state, id) {
        state.rects[id].draggable = true;
    },
    [DISABLE_DRAGGABLE](state, id) {
        state.rects[id].draggable = false;
    },

    [ENABLE_RESIZABLE](state, id) {
        state.rects[id].resizable = true;
    },
    [DISABLE_RESIZABLE](state, id) {
        state.rects[id].resizable = false;
    },

    [ENABLE_SNAP_TO_GRID](state, id) {
        state.rects[id].snapToGrid = true;
    },
    [DISABLE_SNAP_TO_GRID](state, id) {
        state.rects[id].snapToGrid = false;
    },

    [ENABLE_BOTH_AXIS](state, id) {
        state.rects[id].axis = 'both';
    },
    [ENABLE_NONE_AXIS](state, id) {
        state.rects[id].axis = 'none';
    },
    [ENABLE_X_AXIS](state, id) {
        state.rects[id].axis = 'x';
    },
    [ENABLE_Y_AXIS](state, id) {
        state.rects[id].axis = 'y';
    },

    [ENABLE_PARENT_LIMITATION](state, id) {
        state.rects[id].parentLim = true;
    },
    [DISABLE_PARENT_LIMITATION](state, id) {
        state.rects[id].parentLim = false;
    },

    [CHANGE_ZINDEX](state, payload) {
        state.rects[payload.id].zIndex = payload.z;
    },

    [CHANGE_HEIGHT](state, payload) {
        state.rects[payload.id].height = payload.height;
    },

    [CHANGE_WIDTH](state, payload) {
        state.rects[payload.id].width = payload.width;
    },
    [CHANGE_ANGLE](state, payload) {
        state.rects[payload.id].rotation = payload.rotation;
    },

    [CHANGE_TOP](state, payload) {
        state.rects[payload.id].y = payload.y;
    },

    [CHANGE_LEFT](state, payload) {
        state.rects[payload.id].x = payload.x;
    },

    [CHANGE_MINH](state, payload) {

        state.rects[payload.id].minh = payload.minh;
    },

    [CHANGE_MINW](state, payload) {
        state.rects[payload.id].minw = payload.minw;
    },
    [SET_BACKGROUNDS](state, payload) {
        state.background.name = payload.object.name;
        state.background.url = payload.object.url;
    },
    [ADD_RECT](state, payload) {
        state.rects.push(payload.object);
    }
};