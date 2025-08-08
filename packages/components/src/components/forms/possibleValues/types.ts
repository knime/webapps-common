export type Id = string | number | symbol;

export type PossibleValue = {
  id: Id;
  text: string;
  invalid?: boolean;
  special?: true;
  [key: string]: unknown;
};

export type BottomValue = {
  id: symbol;
  text: string;
};
