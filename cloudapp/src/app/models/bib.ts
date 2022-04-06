export class Bib {
  controlNumber: string;
  title: string;
  author: string;
  identifiers: Identifier[] = [];
  record: string;
  matchResults: string[];
}

export interface Identifier {
  type: string;
  value: string;
}