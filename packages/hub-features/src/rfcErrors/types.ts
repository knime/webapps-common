/**
 * Type based on an RFC-9457 error standard (https://www.rfc-editor.org/rfc/rfc9457)
 * Also see:
 * https://knime-com.atlassian.net/wiki/spaces/SPECS/pages/4126769212/API+Errors+Problem+Details
 */
export type RFCErrorData = {
  title: string;
  status?: number;
  date?: Date;
  details?: string[];
  requestId?: string;
  errorId?: string;
};

export class RFCError extends Error {
  data: RFCErrorData;

  constructor(data: RFCErrorData) {
    super(data.title);
    this.data = data;
  }
}
