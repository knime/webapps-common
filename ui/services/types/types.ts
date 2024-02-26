export type Id = string | number | symbol;

export interface PossibleValue {
  id: Id;
  text: string;
  invalid?: boolean;
  special?: boolean;
}

export type BottomValue = {
  id: symbol;
  text: string;
};
