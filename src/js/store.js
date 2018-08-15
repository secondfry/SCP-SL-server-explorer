import Vuex from 'vuex'

import list from './state/list'
import tracking from './state/tracking'

const store = new Vuex.Store({
  modules: {
    list,
    tracking,
  }
});

export default store;
