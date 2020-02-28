<template>
  <div>
    <v-text-field
      label="Environment"
      solo
      clearable
      v-model="name"
      @input="$emit('update:name', name);"
    />
    <v-textarea
      label="Choco List Output"
      solo
      clearable
      name="test"
      value="This is a test"
      v-model="chocoStr"
      @input="parseAndEmit"
    />
  </div>
</template>

<script>
import { parse } from "@/util/packageUtils";

export default {
  name: "choco-text-box",
  props: {
    name: {
      required: true,
      type: String
    },
    sampleInput: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      chocoStr: this.sampleInput || ""
    };
  },
  mounted() {
    this.parseAndEmit();
  },
  methods: {
    parseAndEmit() {
      const packages = parse(this.chocoStr);
      this.$emit("update:packages", packages);
    }
  }
};
</script>

<style>
</style>