<script>
  import { mapActions, mapGetters, mapState } from 'vuex';

  import Glyphicons from './power-threads-glyphicons.vue'

  export default {
    methods: {
      ...mapActions([
        'loadUserId',
      ]),
      ...mapGetters([
        'hasUser',
      ]),
      navigate (e) {
        e.preventDefault();
        this.$router.push({
          name: e.target.dataset.name
        });
      },
      reset (e) {
        e.preventDefault();
        return localforage.clear()
          .then(() => {
              location.reload();
            }
          )
      },
      track (e) {
        e.preventDefault();
        
      }
    },
    created () {
      this.loadUserId();
    },
    components: {
    }
  }
</script>

<template>
  <div>
    <nav class="navbar navbar-dark bg-dark navbar-expand-lg">
      <div class="container">
        <a class="navbar-brand" href="/" data-name="root" @click="navigate">SCP:SL Fry Labs Server Explorer</a>
        <ul class="navbar-nav w-100">
          <li class="nav-item mr-auto">
            <a class="nav-item nav-link" href="/legal" data-name="legal" @click="navigate">CC BY-SA 3.0</a>
          </li>
          <li class="nav-item">
            <a class="nav-item nav-link" href="#" @click="reset">Reset</a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container my-3">
      <div class="row">
        <div class="col">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="p-3 my-3 text-center bg-warning">SCP: Secret Laboratory seemingly breaks license of SCP Foundation (CC BY-SA 3.0). <a href="/legal" data-name="legal" @click="navigate">What?</a></div>
    <footer class="sf-footer">
      <div class="container">
        <div class="row">
          <div class="col text-center">
            <p>
              Yours truly, <a href="https://github.com/secondfry">Rustam @Second_Fry Gubaydullin</a>.<br>
              Written in August, 2018.<br>
              Source code is on <a href="https://github.com/secondfry/SCP-SL-server-explorer">GitHub</a>.<br>
              Also check <a target="_blank" href="https://www.youtube.com/user/SecondFry">my YouTube channel</a> :P.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
  .sf-footer {
    margin-bottom: 80px;
    @include media-breakpoint-up(md) {
      margin-bottom: unset;
    }
  }
</style>
