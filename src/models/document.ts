export type Document = {
  id: string;
  name: string;
  created_at: number;
  created_by: string;
  extension: string;
  mime_type: string;
  size: number;
  position?: number;
  data_source_type?: string;
  data_source_info?: {
    upload_file?: {
      id: string;
      name: string;
      size: number;
      extension: string;
      mime_type: string;
      created_by: string;
      created_at: number;
    };
  };
  dataset_process_rule_id?: string;
  dataset_process_rule?: {
    mode: string;
    rules: {
      pre_processing_rules: Array<{
        id: string;
        enabled: boolean;
      }>;
      segmentation: {
        separator: string;
        max_tokens: number;
        chunk_overlap: number;
      };
      parent_mode: null;
      subchunk_segmentation: null;
    };
  };
  document_process_rule?: {
    id: string;
    dataset_id: string;
    mode: string;
    rules: {
      pre_processing_rules: Array<{
        id: string;
        enabled: boolean;
      }>;
      segmentation: {
        separator: string;
        max_tokens: number;
        chunk_overlap: number;
      };
      parent_mode: null;
      subchunk_segmentation: null;
    };
  };
  created_from?: string;
  tokens?: number;
  indexing_status?: string;
  completed_at?: number;
  updated_at?: number;
  indexing_latency?: number;
  error?: null;
  enabled?: boolean;
  disabled_at?: null;
  disabled_by?: null;
  archived?: boolean;
  segment_count?: number;
  average_segment_length?: number;
  hit_count?: number;
  display_status?: string;
  doc_form?: string;
  doc_language?: string;
};


// {
//     "id": "e4f4027a-06a4-46e8-b8b0-6c7777aa7c88",
//     "position": 4,
//     "data_source_type": "upload_file",
//     "data_source_info": {
//         "upload_file": {
//             "id": "406a2e79-c11f-4a6e-87bd-6bc2bfbcea09",
//             "name": "test_data_2 - 副本 (10) - 副本.txt",
//             "size": 24,
//             "extension": "txt",
//             "mime_type": "text/plain",
//             "created_by": "71aaf60f-544b-4478-ae57-612814946eb1",
//             "created_at": 1762049550.585123
//         }
//     },
//     "dataset_process_rule_id": "3c8b9556-756e-4ec3-addc-f15a31040cc9",
//     "dataset_process_rule": {
//         "mode": "custom",
//         "rules": {
//             "pre_processing_rules": [
//                 {
//                     "id": "remove_extra_spaces",
//                     "enabled": false
//                 },
//                 {
//                     "id": "remove_urls_emails",
//                     "enabled": false
//                 }
//             ],
//             "segmentation": {
//                 "separator": "qweqwe",
//                 "max_tokens": 500,
//                 "chunk_overlap": 50
//             },
//             "parent_mode": null,
//             "subchunk_segmentation": null
//         }
//     },
//     "document_process_rule": {
//         "id": "3c8b9556-756e-4ec3-addc-f15a31040cc9",
//         "dataset_id": "94e8a77b-0018-4e00-9671-972ec0f4896e",
//         "mode": "custom",
//         "rules": {
//             "pre_processing_rules": [
//                 {
//                     "id": "remove_extra_spaces",
//                     "enabled": false
//                 },
//                 {
//                     "id": "remove_urls_emails",
//                     "enabled": false
//                 }
//             ],
//             "segmentation": {
//                 "separator": "qweqwe",
//                 "max_tokens": 500,
//                 "chunk_overlap": 50
//             },
//             "parent_mode": null,
//             "subchunk_segmentation": null
//         }
//     },
//     "name": "test_data_2 - 副本 (10) - 副本.txt",
//     "created_from": "web",
//     "created_by": "71aaf60f-544b-4478-ae57-612814946eb1",
//     "created_at": 1762049552.0,
//     "tokens": 3,
//     "indexing_status": "completed",
//     "completed_at": 1762158701,
//     "updated_at": 1762158701,
//     "indexing_latency": 0.08790052961558104,
//     "error": null,
//     "enabled": true,
//     "disabled_at": null,
//     "disabled_by": null,
//     "archived": false,
//     "segment_count": 1,
//     "average_segment_length": 19,
//     "hit_count": 0,
//     "display_status": "available",
//     "doc_form": "text_model",
//     "doc_language": "Chinese Simplified"
// }