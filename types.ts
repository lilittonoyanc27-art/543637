export type SpeakerType = 'journalist' | 'cristiano';

export interface SubtitleItem {
  id: number;
  speaker: SpeakerType;
  speakerNameEs: string;
  speakerNameHy: string;
  speakerNameRu: string;
  start: number; // in seconds
  end: number;   // in seconds
  spanish: string;
  armenian: string;
  russian?: string;
  keywords?: {
    es: string;
    hy: string;
  }[];
}

export type QuizQuestionType = 
  | 'multiple_choice' 
  | 'true_false' 
  | 'who_said' 
  | 'complete_phrase' 
  | 'comprehension';

export interface QuizOption {
  id: string;
  textEs: string;
  textHy: string;
}

export interface QuizQuestion {
  id: number;
  type: QuizQuestionType;
  typeLabelEs: string;
  typeLabelRu: string;
  typeLabelHy: string;
  questionEs: string;
  questionHy: string;
  options: QuizOption[];
  correctOptionId: string;
  explanationEs: string;
  explanationHy: string;
  sourceTimestamp: number;
}

export interface VocabItem {
  id: string;
  spanish: string;
  armenian: string;
  russian: string;
  pronunciation?: string;
  meaningEs: string;
  exampleEs: string;
  exampleHy: string;
  category: 'football' | 'interview' | 'expression';
  timestamp: number;
}

export interface ScoreSummary {
  total: number;
  correct: number;
  percentage: number;
  passed: boolean;
  rankTitleEs: string;
  rankTitleHy: string;
  rankTitleRu: string;
}
