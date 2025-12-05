// 知识库-文档-分段 数据结构
export type Segment = {
  id: string;
  position: number;
  document_id: string;
  content: string;
  sign_content: string;
  answer: string | null;
  word_count: number;
  tokens: number;
  keywords: string[];
  index_node_id: string;
  index_node_hash: string;
  hit_count: number;
  enabled: boolean;
  disabled_at: number | null;
  disabled_by: string | null;
  status: string;
  created_by: string;
  created_at: number;
  updated_at: number;
  updated_by?: string;
  indexing_at: number | null;
  completed_at: number | null;
  error: string | null;
  stopped_at: number | null;
  child_chunks: Segment[];
};
