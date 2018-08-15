import axios from 'axios'
import Vue from 'vue'

const events = {
  LOAD_SUCCESS: 'LIST_LOAD_SUCCESS',
  CACHE_HIT: 'LIST_CACHE_HIT',
};

export default {
  state: {
    servers: {},
    loaded: false,
  },
  mutations: {
    [events.CACHE_HIT] (state, servers) {
      for (let ipport in servers) {
        this._vm.$set(state.servers, ipport, servers[ipport]);
      }
    },
    [events.LOAD_SUCCESS] (state, servers) {
      for (let server of servers) {
        this._vm.$set(state.servers, server.ipport, server);
      }
      this._vm.$setItem('list', state.servers);
      state.loaded = true;
    },
  },
  actions: {
    loadServerList ({ commit }) {
      return this._vm.$getItem('list')
        .then(data => {
          if (data) {
            return commit(events.CACHE_HIT, data)
          }
        })
        .then(() => axios.get('/api/server/list/'))
        .then(res => res.data)
        .then(data => {
          for (let server of data) {
            server.ipport = server._id.ip + ':' + server._id.port;
          }
          return data;
        })
        .then(data => commit(events.LOAD_SUCCESS, data))
        .catch(console.log.bind(console))
    },
  }
}
