export type Id = string | number | symbol;

export interface PossibleValue {
  id: Id;
  text: string;
  invalid?: boolean;
  special?: true;
  title?: string;
  group?: string;
  slotData?: {
    [K in keyof any]: string | number | boolean;
  };
}

export type BottomValue = {
  id: symbol;
  text: string;
};
