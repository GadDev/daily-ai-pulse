import type { VisualBrief } from './illustration-generation-identity.ts';

export interface EditorialCandidate {
  reservation?: { owner: string; ref: string; commit: string };
  id: string;
  decision?: string;
  topics?: string[];
  primary_source_url?: string;
  sources?: { url: string; role?: string }[];
  deduplication?: {
    status?: string;
    result?: string;
    previous_coverage?: unknown;
    material_delta?: unknown;
  };
}
export interface EditorialLedger {
  profile?: string;
  batch_id?: string;
  editorial_date: string;
  schema_version?: string;
  decision_engine_version?: string;
  provenance?: { kind?: string };
  candidates?: EditorialCandidate[];
  watchlist?: EditorialCandidate[];
  exclusions?: EditorialCandidate[];
  publication?: {
    story_ids?: string[];
    standalone_story_ids?: string[];
    withheld_selected?: (string | { id: string })[];
  };
}
export interface IllustrationReview {
  system_version: string;
  constitution_version: string;
  story_id: string;
  candidate_count: number;
  selected_candidate: string;
  visual_brief: VisualBrief & {
    placement: string;
    output_crop: string;
    subject: string;
    verified_context: string[];
  };
  generation_identity?: {
    identity_version?: string;
    story_id?: string;
    story_source_sha256?: string;
    visual_brief_sha256?: string;
    reference_inputs_sha256?: string;
    illustration_system_version?: string;
    visual_constitution_version?: string;
    prompt_contract_version?: string;
    candidate_count?: number;
    generator_surface: string;
    model_snapshot?: string | null;
    generation_key?: string;
  };
  asset_integrity?: { sha256?: string; byte_length?: number; riff_container_complete?: boolean };
  constitution_check?: { passed?: boolean; violations?: string[] };
  prohibited_elements?: Record<string, boolean>;
  scores: Record<string, number>;
  hard_failures?: string[];
  cover_crop_approved?: boolean;
  thumbnail_approved?: boolean;
  final_asset?: string;
  final_dimensions?: { width?: number; height?: number };
}
