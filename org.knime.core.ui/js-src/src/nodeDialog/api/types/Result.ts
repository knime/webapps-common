type SuccessResult<R> = {
  result: R;
  state: "SUCCESS";
};

type FailResult = {
  state: "FAIL";
  message: string;
};

type CanceledResult = {
  state: "CANCELED";
};

type Result<R> = SuccessResult<R> | FailResult | CanceledResult;

export default Result;
