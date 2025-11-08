

export type AbacaGrade = 'S2' | 'S3' | 'H' | 'G' | 'JK' | 'M1' | 'Y1' | 'Y2' | 'I' | 'EF' | 'Unknown';

export type View = 'home' | 'camera' | 'results' | 'allGrades' | 'searchResults';

export interface Prediction {
  className: string;
  probability: number;
}

export interface AbacaDetails {
  description: string;
  price: string;
  uses: string[];
}

export interface AnalysisResult extends AbacaDetails {
  grade: AbacaGrade;
  confidence: number;
}

// Declare the Teachable Machine global object for TypeScript
declare global {
  // eslint-disable-next-line no-var
  var tmImage: any;
}