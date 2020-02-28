<template>
  <v-container>
    <v-row>
      <v-col>
        <choco-text-box
          :name.sync="left.name"
          :sampleInput="sampleInputLeft"
          :packages.sync="left.packages"
        />
      </v-col>
      <v-col>
        <choco-text-box
          :name.sync="right.name"
          :sampleInput="sampleInputRight"
          :packages.sync="right.packages"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <combined-view :packages="combinedPackages" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChocoTextBox from "@/components/ChocoTextBox";
import CombinedView from "@/components/CombinedView";

import {
  sampleInputLeft,
  sampleInputRight,
  combinePackages
} from "@/util/packageUtils";

export default {
  name: "compare-layout",
  components: {
    ChocoTextBox,
    CombinedView
  },
  data() {
    return {
      left: {
        name: "left",
        packages: []
      },
      right: {
        name: "right",
        packages: []
      },
      sampleInputLeft,
      sampleInputRight
    };
  },
  computed: {
    combinedPackages() {
      const combined = combinePackages(this.left.packages, this.right.packages);
      console.log({ combined });
      return combined;
    }
  }
};
</script>

<style>
</style>