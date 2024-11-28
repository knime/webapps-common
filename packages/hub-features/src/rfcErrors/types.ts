/**
 * Type based on an RFC-9457 error standard (https://www.rfc-editor.org/rfc/rfc9457)
 */
export type RFCErrorData = {
  title: string;
  details?: string[];
  status: number;
  date: Date;
  requestId: string;
  errorId?: string;
};

export class RFCError extends Error {
  data: RFCErrorData;

  constructor(data: RFCErrorData) {
    super(data.title);
    this.data = data;
  }
}
