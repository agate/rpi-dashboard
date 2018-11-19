<template>
<v-app>
  <SideNav :drawer="drawer"/>
  <v-toolbar fixed app dark clipped-left>
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <v-toolbar-title>RPi Dashboard &nbsp;<span class="font-weight-light">@{{ hostname }}</span></v-toolbar-title>
  </v-toolbar>
  <v-content>
    <router-view />
  </v-content>
</v-app>
</template>

<script>
import SideNav from '@/components/SideNav.vue';

export default {
  name: 'App',
  components: {
    SideNav,
  },
  data: () => ({
    drawer: false,
    hostname: '',
  }),
  async mounted() {
    const resp = await this.$http.get('hostname');
    this.hostname = resp.data.result;
  },
};
</script>
