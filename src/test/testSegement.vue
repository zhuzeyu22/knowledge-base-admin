<template>
  <SegementSetting :document='document' />
</template>

<script setup lang="ts">
import { ref } from "vue";
import SegementSetting from "@/components/documentSegementSetting.vue";

const document = {
  id: "420c5dde-23cc-4e6e-bb2f-f16765e1743c",
  position: 1,
  data_source_type: "upload_file",
  data_source_info: {
    upload_file_id: "938950ef-6e5f-413c-a15c-4cade81f43b4",
  },
  data_source_detail_dict: {
    upload_file: {
      id: "938950ef-6e5f-413c-a15c-4cade81f43b4",
      name: "test_data_2 - 副本 (9) - 副本.txt",
      size: 24,
      extension: "txt",
      mime_type: "text/plain",
      created_by: "71aaf60f-544b-4478-ae57-612814946eb1",
      created_at: 1762050523.843772,
    },
  },
  dataset_process_rule_id: "a2ab4123-9846-49e6-b5d5-a43967b32e2b",
  name: "test_data_2 - 副本 (9) - 副本.txt",
  created_from: "web",
  created_by: "71aaf60f-544b-4478-ae57-612814946eb1",
  created_at: 1762050558,
  tokens: 7,
  indexing_status: "completed",
  error: null,
  enabled: true,
  disabled_at: null,
  disabled_by: null,
  archived: false,
  display_status: "available",
  word_count: 19,
  hit_count: 0,
  doc_form: "text_model",
  doc_metadata: null,
};
</script>
