<template>
  <v-container>
    <v-row>
      <v-col>
        <choco-text-box :name.sync="left.name" :sampleInput="sampleInputLeft"/>
      </v-col>
      <v-col>
        <choco-text-box :name.sync="right.name" :sampleInput="sampleInputRight"/>
      </v-col>
    </v-row>
    <v-row>
      {{left.name}} AND {{right.name}}
    </v-row>
  </v-container>
</template>

<script>
import ChocoTextBox from '@/components/ChocoTextBox';

import { sampleInputLeft, sampleInputRight } from '@/util/packageUtils';

export default {
  name: 'compare-layout',
  components: {
    ChocoTextBox
  },
  data() {
    return {
      left: {
        name: 'left',
        packages: []
      },
      right: {
        name: 'right',
        packages: []
      },
      sampleInputLeft,
      sampleInputRight
    }
  }
};
</script>

<style>
</style>