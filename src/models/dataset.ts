// 知识库 数据结构
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
  is_edit:boolean;
  is_admin:boolean;
};

//团队知识库数据结构
export type TeamDataset = {
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
  creator:string;
  is_admin:boolean;
};

//公开知识库数据结构
export type PublicDataset = {
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
  team:string;
  is_admin:boolean;
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

// export enum DisplayStatus {
//   INDEXING = "indexing",
//   QUEUING = "queuing",
//   ERROR = "error",
//   AVALIABLE='avaliable',
//   DISABLE='disable',
// }

// export const DisplayStatusText: Record<DisplayStatus, string> ={
//   [DisplayStatus.INDEXING]:"索引中",
//   [DisplayStatus.QUEUING]:"排队中",
//   [DisplayStatus.ERROR]:"错误",
//   [DisplayStatus.AVALIABLE]:'可用',
//   [DisplayStatus.DISABLE]:'已禁用',
// }

export enum RETRIEVE_TYPE {
  oneWay = "single",
  multiWay = "multiple",
}

export enum RerankingModeEnum {
  RerankingModel = "reranking_model",
  WeightedScore = "weighted_score",
}

export enum WeightedScoreEnum {
  SemanticFirst = "semantic_first",
  KeywordFirst = "keyword_first",
  Customized = "customized",
}

export enum MetadataFilteringModeEnum {
  disabled = "disabled",
  automatic = "automatic",
  manual = "manual",
}

export enum DataSourceType {
  FILE = "upload_file",
  NOTION = "notion",
  GITHUB = "github",
}

export const DataSourceTypeText: Record<DataSourceType, string> = {
  [DataSourceType.FILE]: "文件上传",
  [DataSourceType.NOTION]: "从Notion同步的文档",
  [DataSourceType.GITHUB]: "从Github同步的文档"
};


export type ProcessRule = {
  mode: ProcessMode
  rules: Rules
}

export enum ProcessMode {
  general = 'custom',
  parentChild = 'hierarchical',
}

export const ProcessModeText: Record<ProcessMode, string> = {
  [ProcessMode.general]: "通用",
  [ProcessMode.parentChild]: "父子分段",
};

export enum OpLogType {
  addMember = 'team_member_add',
  removeMember = 'team_member_remove',
}

export const OpLogTypeText: Record<OpLogType, string> ={
  [OpLogType.addMember]:"添加成员",
  [OpLogType.removeMember]:"成员",
}

export type Rules = {
  pre_processing_rules: PreProcessingRule[]
  segmentation: Segmentation
  parent_mode: ParentMode
  subchunk_segmentation: Segmentation
}

export type PreProcessingRule = {
  id: string
  enabled: boolean
}

export type Segmentation = {
  separator: string
  max_tokens: number
  chunk_overlap?: number
}

export type ParentMode = 'full-doc' | 'paragraph'

export enum ChunkingMode {
  text = "text_model", // General text
  qa = "qa_model", // General QA
  parentChild = "hierarchical_model", // Parent-Child
  // graph = 'graph', // todo: Graph RAG
}

export type DatasetConfigs = {
  retrieval_model: RETRIEVE_TYPE;
  reranking_model: {
    reranking_provider_name: string;
    reranking_model_name: string;
  };
  top_k: number;
  score_threshold_enabled: boolean;
  score_threshold: number | null | undefined;
  datasets: {
    datasets: {
      enabled: boolean;
      id: string;
    }[];
  };
  reranking_mode?: RerankingModeEnum;
  weights?: {
    weight_type: WeightedScoreEnum;
    vector_setting: {
      vector_weight: number;
      embedding_provider_name: string;
      embedding_model_name: string;
    };
    keyword_setting: {
      keyword_weight: number;
    };
  };
  reranking_enable?: boolean;
};
