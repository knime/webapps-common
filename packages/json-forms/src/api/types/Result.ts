type SuccessResult<R> = {
  result: R;
  state: "SUCCESS";
  message?: string[];
};

type FailResult = {
  state: "FAIL";
  message: [string];
};

type CanceledResult = {
  state: "CANCELED";
};

export type Result<R> = SuccessResult<R> | FailResult | CanceledResult;
