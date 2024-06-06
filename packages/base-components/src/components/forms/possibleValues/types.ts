export type Id = string | number | symbol;

export interface PossibleValue {
  id: Id;
  text: string;
  invalid?: boolean;
  special?: true;
}

export type BottomValue = {
  id: symbol;
  text: string;
};
