<script lang="ts">
import { FileUpload } from "@knime/components";
type State = "Info" | "Error" | "Success";

export default {
  components: {
    FileUpload,
  },
  data() {
    return {
      demoValues: [
        {
          fileName: "temp_name",
          percentage: 100,
          fileSize: 132,
          status: "Success" as State,
        },
      ],
    };
  },
};
</script>

<template>
  <FileUpload v-model="demoValues" />
</template>
