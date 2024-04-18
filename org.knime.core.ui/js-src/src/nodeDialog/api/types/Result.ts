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

type Result<R> = SuccessResult<R> | FailResult | CanceledResult;

export default Result;
