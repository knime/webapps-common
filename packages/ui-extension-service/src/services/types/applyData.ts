export type ApplyDataResponse =
  | {
      warningMessages?: string[];
      isApplied: true;
    }
  | {
      warningMessages?: [];
      isApplied: false;
      error: string;
    };
