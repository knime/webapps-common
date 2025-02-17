import type {
  CURRENT_STATE_VERSION,
  MOST_RECENT_VERSION,
} from "../../common/constants";
import type { HubAvatarData } from "../avatars/HubAvatar.vue";

// TODO: Generate from OpenAPI spec
export type NamedItemVersion = {
  version: number | typeof CURRENT_STATE_VERSION | typeof MOST_RECENT_VERSION;
  title: string;
  description?: string;
  author: string;
  authorAccountId?: string;
  createdOn: string;
};
type LabelId = string; // UUID
type LabelName = string;
type LabelDescription = string;
type SlimLabelResponse = {
  name?: LabelName;
  description?: LabelDescription;
};

export type AssignedLabel = {
  labelId: LabelId;
  message?: string;
  createdAt?: string;
  createdBy?: string; // UUID
  label: SlimLabelResponse;
};

export type WithAvatar = { avatar: HubAvatarData };
export type WithLabels = { labels: Array<AssignedLabel> };

type ItemChange = {
  author: string;
  createdOn: string;
  eventActionType: "ADDED" | "UPDATED" | "MOVED" | "RENAMED";
  message: string;
  authorAccountId?: string;
};

export type ItemSavepoint = {
  author: string;
  authorAccountId?: string;
  lastEditedOn: string;
  savepointNumber: number;
  version?: NamedItemVersion;
  itemVersionId?: string; // UUID
  changes: Array<ItemChange>;
};
