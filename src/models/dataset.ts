export type Dataset = {
  id: string;
  name: string;
  isOfficial: boolean;
  imageUrl: string;
  description: string;
  // 文档数量
  documentNumber: number;
  // 字符数量
  characterNumber: number;
};

export type DataSource ={
  type: string;
  info_list: {
    data_source_type: string;
    file_info_list: {
      file_ids: string[];
    };
  };
}

// export type KnowledgeBase = {
//   data_source: DataSource
//   /** 固定写法开始 */
//   indexing_technique: "high_quality";
//   embedding_model: "text-embedding-v1";
//   embedding_model_provider: "langgenius/tongyi/tongyi";
//   /** 固定写法结束 */
//   process_rule: {
//     rules: {
//       pre_processing_rules: [
//         { id: "remove_extra_spaces"; enabled: true },
//         { id: "remove_urls_emails"; enabled: false }
//       ];
//       segmentation: { separator: "\n\n"; max_tokens: 500 };
//       parent_mode: "full-doc";
//       subchunk_segmentation: { separator: "\n"; max_tokens: 201 };
//     };
//     mode: "hierarchical";
//   };
//   doc_form: "hierarchical_model";
//   doc_language: "English";
//   retrieval_model: {
//     search_method: "semantic_search";
//     reranking_enable: true;
//     /** 固定写法开始 */
//     reranking_model: {
//       reranking_provider_name: "langgenius/tongyi/tongyi";
//       reranking_model_name: "gte-rerank-v2";
//     };
//     /** 固定写法结束 */
//     top_k: 3;
//     score_threshold_enabled: false;
//     score_threshold: 0.5;
//   };
// };
