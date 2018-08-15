<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Fuse from 'fuse.js'

const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    'ipport',
    'name',
  ]
};

export default {
  data () {
    return {
      needle: '',
      results: []
    }
  },
  computed: {
    ...mapState({
      isListLoaded: state => state.list.loaded,
      servers: state => state.list.servers,
    }),
    areServerAvailable () {
      return Object.values(this.servers).length !== 0;
    }
  },
  watch: {
    needle (newData, oldData) {
      this.results = this.fuse.search(this.needle);
    },
    servers (newData, oldData) {
      this.fuse = new Fuse(Object.values(this.servers), fuseOptions);
    }
  },
  methods: {
    ...mapActions([
      'loadServerList',
      'trackServer',
    ]),
    track (server) {
      this.needle = '';
      this.trackServer(server);
    }
  },
  created () {
    if (!this.isListLoaded) {
      this.loadServerList();
    }
  },
}
</script>

<template>
  <div>
    <input v-model="needle" class="form-control" type="text" :disabled="!areServerAvailable" />
    <div class="form-control server-box" v-if="results.length">
      <div class="server-line" v-for="server in results">
        <a href="#" @click="track(server)">{{ server.ipport }}<span v-if="server.name"> – {{ server.name }}</span></a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.server-box {
  position: absolute;
  width: auto;
  max-height: 10rem;
  overflow-y: scroll;
  z-index: 1;
}
.server-line {
  margin: 0.5rem 0;

  &:first-of-type {
    margin-top: 0;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>