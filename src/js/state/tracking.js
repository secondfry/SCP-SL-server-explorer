import axios from 'axios'

const events = {
  TRACK: 'TRACKING_TRACK',
  UNTRACK: 'TRACKING_UNTRACK',
  TRACK_ALL: 'TRACKING_TRACK_ALL',
  LOADED: 'TRACKING_LOADED',
  ONLINE_LOAD_SUCCESS: 'TRACKING_ONLINE_LOAD_SUCCESS',
};

export default {
  state: {
    servers: {},
    loaded: false,
  },
  mutations: {
    [events.TRACK] (state, server) {
      this._vm.$set(state.servers, server.ipport, server);
      this._vm.$set(state.servers[server.ipport], 'online', []);
      this._vm.$setItem('tracking', state.servers);
    },
    [events.UNTRACK] (state, server) {
      this._vm.$delete(state.servers, server.ipport);
      this._vm.$setItem('tracking', state.servers);
    },
    [events.TRACK_ALL] (state, servers) {
      for (let ipport in servers) {
        this._vm.$set(state.servers, ipport, servers[ipport]);
        this._vm.$set(state.servers[ipport], 'online', []);
      }
      this._vm.$setItem('tracking', state.servers);
    },
    [events.LOADED] (state) {
      state.loaded = true;
    },
    [events.ONLINE_LOAD_SUCCESS] (state, { server, data }) {
      for (let line of data) {
        state.servers[server.ipport].online.push(line);
      }
    },
  },
  getters: {
    isServerLoaded: state => server => {
      if (!(server.ipport in state.servers)) {
        return false;
      }

      server = state.servers[server.ipport];
      if (!('online' in server)) {
        return false;
      }

      if (server.online.length == 0) {
        return false;
      }

      return true;
    },
    getServerOnline: (state, getters) => server => {
      return state.servers[server.ipport].online;
    },
    getTrackedCount: state => Object.keys(state.servers).length,
  },
  actions: {
    loadTrackedServers ({ commit }) {
      this._vm.$getItem('tracking')
        .then(servers => {
          if (servers) {
            return commit(events.TRACK_ALL, servers);
          }
        })
        .then(() => commit(events.LOADED))
        .catch(console.log.bind(console));
    },
    trackServer ({ commit }, server) {
      return commit(events.TRACK, server);
    },
    untrackServer ({ commit }, server) {
      return commit(events.UNTRACK, server);
    },
    loadServerOnline ({ commit }, server) {
      return axios
        .get('/api/server/' + server._id.ip + '/' + server._id.port + '/')
        .then(res => res.data)
        .then(data => commit(events.ONLINE_LOAD_SUCCESS, {
          server,
          data
        }))
        .catch(console.log.bind(console))
    },
  }
}
