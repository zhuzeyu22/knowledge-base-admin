export type Dataset = {
  id: string;
  name: string;
  official: "official" | "unofficial";
  imageUrl: string;
  description: string;
  // 文档数量
  documentNumber: number;
  // 字符数量
  characterNumber: number;
  retrieval_model_dict: RetrievalModel;
};

export type RetrievalModel = {
  search_method: "semantic_search" | "full_text_search" | "hybrid_search";
  reranking_enable: boolean;
  reranking_mode: "weighted_score" | "reranking_model";
  reranking_model: {
    reranking_provider_name: string;
    reranking_model_name: string;
  };
  weights: {
    weight_type: "customized";
    keyword_setting: {
      keyword_weight: number;
    };
    vector_setting: {
      vector_weight: number;
      embedding_model_name: string;
      embedding_provider_name: string;
    };
  };
  top_k: number;
  score_threshold_enabled: boolean;
  score_threshold: number;
};

export type DataSource = {
  type: string;
  info_list: {
    data_source_type: string;
    file_info_list: {
      file_ids: string[];
    };
  };
};

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
