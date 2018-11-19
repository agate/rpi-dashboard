<template>
<v-layout align-space-between column ma-2>
  <v-flex xs12>
    <v-btn color="primary" @click="isDialogFormVisiable = true" round><v-icon left>add</v-icon> Create</v-btn>
  </v-flex>
  <v-flex xs12>
    <v-layout ma-2>
      <v-flex xs12 sm6 md4 v-for="(d, i) in lst" :key="d.id">
        <v-card>
          <v-card-title primary-title>{{ d.title }}</v-card-title>
          <v-card-text>GPIO#{{ d.pin }} - {{ d.direction }}</v-card-text>
          <v-card-actions>
            <v-switch v-model="d.value" :true-value="1" :false-value="0" @change="postPin(i)" :label="d.value.toString()"></v-switch>
            <v-spacer />
            <v-btn color="error" flat @click="deleteDetail(i)" icon><v-icon>delete</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-flex>
  <v-dialog v-model="isDialogFormVisiable" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">GPIO</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="Title" v-model="form.title" required></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-select :items="pins" label="GPIO #" v-model="form.pin" required></v-select>
            </v-flex>
            <v-flex xs12>
              <v-select :items="directions" label="Direction" v-model="form.direction" required></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="isDialogFormVisiable = false">Close</v-btn>
        <v-btn flat @click="createDetail">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- <pre>{{ $data }}</pre> -->
</v-layout>
</template>

<script>
export default {
  data: () => ({
    switch1: false,
    isDialogFormVisiable: false,
    lst: [],
    form: {
      title: 'Fan',
      pin: 5,
      direction: 'low',
    },
    pins: [
      4, 5, 6, 12, 13, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
    ],
    directions: [
      {
        text: 'out (initial low)',
        value: 'low',
      }, {
        text: 'out (initial high)',
        value: 'high',
      },
    ],
  }),
  methods: {
    async createDetail() {
      await this.$http.post('gpios', this.form);
      this.isDialogFormVisiable = false;
      this.fetchList();
    },
    async fetchList() {
      const resp = await this.$http.get('gpios');
      this.lst = resp.data.result;
    },
    async postPin(index) {
      const { id, value } = this.lst[index];
      this.$http.post(`gpios/${id}`, { value });
    },
    async deleteDetail(index) {
      const res = await this.$confirm(`Delete ${this.lst[index].title} ?`);
      if (res) {
        this.$http.delete(`gpios/${this.lst[index].id}`);
        this.fetchList();
      }
    },
  },
  mounted() {
    this.fetchList();
  },
};
</script>
