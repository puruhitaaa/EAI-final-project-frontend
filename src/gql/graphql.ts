/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** JSON scalar type */
  JSON: { input: any; output: any; }
};

export type Category = {
  __typename?: 'Category';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  severityLevel?: Maybe<Scalars['Int']['output']>;
};

export type CategoryCount = {
  __typename?: 'CategoryCount';
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type FlaggedWord = {
  __typename?: 'FlaggedWord';
  aiDetectable?: Maybe<Scalars['Boolean']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  contextDependent?: Maybe<Scalars['Boolean']['output']>;
  geminiExplanation?: Maybe<Scalars['String']['output']>;
  severity?: Maybe<Scalars['Int']['output']>;
  suggestions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  word: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addProfaneWord?: Maybe<FlaggedWord>;
  createCategory?: Maybe<Category>;
  generateReport?: Maybe<Report>;
  logReport?: Maybe<ReportEntry>;
  saveSynonyms?: Maybe<Synonym>;
  saveWordCategory?: Maybe<WordCategoryResult>;
};


export type MutationAddProfaneWordArgs = {
  contextDependent?: InputMaybe<Scalars['Boolean']['input']>;
  severity?: InputMaybe<Scalars['Int']['input']>;
  word: Scalars['String']['input'];
};


export type MutationCreateCategoryArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  severityLevel?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationGenerateReportArgs = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationLogReportArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  context?: InputMaybe<Scalars['String']['input']>;
  severity?: InputMaybe<Scalars['Int']['input']>;
  word: Scalars['String']['input'];
};


export type MutationSaveSynonymsArgs = {
  appropriatenessScore?: InputMaybe<Scalars['Int']['input']>;
  synonyms: Array<InputMaybe<Scalars['String']['input']>>;
  word: Scalars['String']['input'];
};


export type MutationSaveWordCategoryArgs = {
  categoryId: Scalars['ID']['input'];
  confidence?: InputMaybe<Scalars['Float']['input']>;
  word: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  analyzeSentiment?: Maybe<SentimentAnalysis>;
  checkText?: Maybe<Array<Maybe<FlaggedWord>>>;
  getAllCategories?: Maybe<Array<Maybe<Category>>>;
  getAllProfaneWords?: Maybe<Array<Maybe<FlaggedWord>>>;
  getAllSynonyms?: Maybe<Array<Maybe<Synonym>>>;
  getCategoryForWord?: Maybe<WordCategoryResult>;
  getRecentAnalyses?: Maybe<Array<Maybe<SentimentAnalysis>>>;
  getReportById?: Maybe<Report>;
  getReportEntries?: Maybe<Array<Maybe<ReportEntry>>>;
  getReports?: Maybe<Array<Maybe<Report>>>;
  getSentimentAnalysis?: Maybe<SentimentAnalysis>;
  getSuggestions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};


export type QueryAnalyzeSentimentArgs = {
  text: Scalars['String']['input'];
};


export type QueryCheckTextArgs = {
  input: Scalars['String']['input'];
};


export type QueryGetCategoryForWordArgs = {
  context?: InputMaybe<Scalars['String']['input']>;
  word: Scalars['String']['input'];
};


export type QueryGetRecentAnalysesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetReportByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetReportEntriesArgs = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  reportId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetSentimentAnalysisArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetSuggestionsArgs = {
  context?: InputMaybe<Scalars['String']['input']>;
  word: Scalars['String']['input'];
};

export type Report = {
  __typename?: 'Report';
  aiGenerated?: Maybe<Scalars['Boolean']['output']>;
  categories?: Maybe<Array<Maybe<CategoryCount>>>;
  categoryBreakdown?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  entries?: Maybe<Array<Maybe<ReportEntry>>>;
  id: Scalars['ID']['output'];
  insights?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  riskAssessment?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['String']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  totalFlagged: Scalars['Int']['output'];
};


export type ReportEntriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ReportEntry = {
  __typename?: 'ReportEntry';
  category?: Maybe<Scalars['String']['output']>;
  context?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  severity?: Maybe<Scalars['Int']['output']>;
  timestamp: Scalars['String']['output'];
  word: Scalars['String']['output'];
};

export type SentimentAnalysis = {
  __typename?: 'SentimentAnalysis';
  aiGenerated?: Maybe<Scalars['Boolean']['output']>;
  analysisDate?: Maybe<Scalars['String']['output']>;
  appropriatenessScore?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  professionalismScore?: Maybe<Scalars['Float']['output']>;
  review?: Maybe<Scalars['String']['output']>;
  sentiment?: Maybe<Scalars['String']['output']>;
  text: Scalars['String']['output'];
  toxicityScore?: Maybe<Scalars['Float']['output']>;
};

export type SentimentResponse = {
  __typename?: 'SentimentResponse';
  analysis?: Maybe<SentimentAnalysis>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Synonym = {
  __typename?: 'Synonym';
  appropriatenessScore?: Maybe<Scalars['Int']['output']>;
  lastUpdated?: Maybe<Scalars['String']['output']>;
  suggestions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  word: Scalars['String']['output'];
};

export type WordCategoryResult = {
  __typename?: 'WordCategoryResult';
  category?: Maybe<Scalars['String']['output']>;
  confidence?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  explanation?: Maybe<Scalars['String']['output']>;
  severityLevel?: Maybe<Scalars['Int']['output']>;
  word: Scalars['String']['output'];
};

export type GetCategoryForWordQueryVariables = Exact<{
  word: Scalars['String']['input'];
  context?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetCategoryForWordQuery = { __typename?: 'Query', getCategoryForWord?: { __typename?: 'WordCategoryResult', word: string, category?: string | null, description?: string | null, severityLevel?: number | null, confidence?: number | null, explanation?: string | null } | null };

export type GetAllCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCategoriesQuery = { __typename?: 'Query', getAllCategories?: Array<{ __typename?: 'Category', id: string, name: string, description?: string | null, severityLevel?: number | null } | null> | null };

export type GetAllProfaneWordsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllProfaneWordsQuery = { __typename?: 'Query', getAllProfaneWords?: Array<{ __typename?: 'FlaggedWord', word: string, severity?: number | null, contextDependent?: boolean | null, aiDetectable?: boolean | null, geminiExplanation?: string | null, suggestions?: Array<string | null> | null, category?: string | null } | null> | null };

export type AddProfaneWordMutationVariables = Exact<{
  word: Scalars['String']['input'];
  severity?: InputMaybe<Scalars['Int']['input']>;
  contextDependent?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AddProfaneWordMutation = { __typename?: 'Mutation', addProfaneWord?: { __typename?: 'FlaggedWord', word: string, severity?: number | null } | null };

export type GetReportsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetReportsQuery = { __typename?: 'Query', getReports?: Array<{ __typename?: 'Report', id: string, title: string, startDate: string, endDate: string, summary?: string | null, totalFlagged: number, insights?: Array<string | null> | null, riskAssessment?: string | null, createdAt: string, categories?: Array<{ __typename?: 'CategoryCount', name: string, count: number } | null> | null } | null> | null };

export type GetReportByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetReportByIdQuery = { __typename?: 'Query', getReportById?: { __typename?: 'Report', id: string, title: string, startDate: string, endDate: string, summary?: string | null, totalFlagged: number, categoryBreakdown?: any | null, insights?: Array<string | null> | null, riskAssessment?: string | null, entries?: Array<{ __typename?: 'ReportEntry', id: string, word: string, category?: string | null, context?: string | null, timestamp: string, severity?: number | null } | null> | null } | null };

export type GenerateReportMutationVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
}>;


export type GenerateReportMutation = { __typename?: 'Mutation', generateReport?: { __typename?: 'Report', id: string, title: string, summary?: string | null } | null };

export type GetSuggestionsQueryVariables = Exact<{
  word: Scalars['String']['input'];
  context?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSuggestionsQuery = { __typename?: 'Query', getSuggestions?: Array<string | null> | null };

export type GetAllSynonymsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSynonymsQuery = { __typename?: 'Query', getAllSynonyms?: Array<{ __typename?: 'Synonym', word: string, suggestions?: Array<string | null> | null, appropriatenessScore?: number | null } | null> | null };

export type SaveSynonymsMutationVariables = Exact<{
  word: Scalars['String']['input'];
  synonyms: Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>;
  appropriatenessScore?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SaveSynonymsMutation = { __typename?: 'Mutation', saveSynonyms?: { __typename?: 'Synonym', word: string, suggestions?: Array<string | null> | null, appropriatenessScore?: number | null } | null };

export type CheckTextQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type CheckTextQuery = { __typename?: 'Query', checkText?: Array<{ __typename?: 'FlaggedWord', word: string, severity?: number | null, contextDependent?: boolean | null, aiDetectable?: boolean | null, geminiExplanation?: string | null, suggestions?: Array<string | null> | null, category?: string | null } | null> | null };

export type AnalyzeSentimentQueryVariables = Exact<{
  text: Scalars['String']['input'];
}>;


export type AnalyzeSentimentQuery = { __typename?: 'Query', analyzeSentiment?: { __typename?: 'SentimentAnalysis', id: string, sentiment?: string | null, appropriatenessScore?: number | null, toxicityScore?: number | null, professionalismScore?: number | null, review?: string | null } | null };


export const GetCategoryForWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategoryForWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"word"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"context"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCategoryForWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"word"},"value":{"kind":"Variable","name":{"kind":"Name","value":"word"}}},{"kind":"Argument","name":{"kind":"Name","value":"context"},"value":{"kind":"Variable","name":{"kind":"Name","value":"context"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"severityLevel"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"explanation"}}]}}]}}]} as unknown as DocumentNode<GetCategoryForWordQuery, GetCategoryForWordQueryVariables>;
export const GetAllCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"severityLevel"}}]}}]}}]} as unknown as DocumentNode<GetAllCategoriesQuery, GetAllCategoriesQueryVariables>;
export const GetAllProfaneWordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllProfaneWords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllProfaneWords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"contextDependent"}},{"kind":"Field","name":{"kind":"Name","value":"aiDetectable"}},{"kind":"Field","name":{"kind":"Name","value":"geminiExplanation"}},{"kind":"Field","name":{"kind":"Name","value":"suggestions"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]} as unknown as DocumentNode<GetAllProfaneWordsQuery, GetAllProfaneWordsQueryVariables>;
export const AddProfaneWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddProfaneWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"word"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"severity"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contextDependent"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addProfaneWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"word"},"value":{"kind":"Variable","name":{"kind":"Name","value":"word"}}},{"kind":"Argument","name":{"kind":"Name","value":"severity"},"value":{"kind":"Variable","name":{"kind":"Name","value":"severity"}}},{"kind":"Argument","name":{"kind":"Name","value":"contextDependent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contextDependent"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}}]}}]}}]} as unknown as DocumentNode<AddProfaneWordMutation, AddProfaneWordMutationVariables>;
export const GetReportsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetReports"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getReports"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"totalFlagged"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"riskAssessment"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetReportsQuery, GetReportsQueryVariables>;
export const GetReportByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetReportById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getReportById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"totalFlagged"}},{"kind":"Field","name":{"kind":"Name","value":"categoryBreakdown"}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"riskAssessment"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"IntValue","value":"0"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"context"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}}]}}]}}]}}]} as unknown as DocumentNode<GetReportByIdQuery, GetReportByIdQueryVariables>;
export const GenerateReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}}]}}]} as unknown as DocumentNode<GenerateReportMutation, GenerateReportMutationVariables>;
export const GetSuggestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSuggestions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"word"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"context"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSuggestions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"word"},"value":{"kind":"Variable","name":{"kind":"Name","value":"word"}}},{"kind":"Argument","name":{"kind":"Name","value":"context"},"value":{"kind":"Variable","name":{"kind":"Name","value":"context"}}}]}]}}]} as unknown as DocumentNode<GetSuggestionsQuery, GetSuggestionsQueryVariables>;
export const GetAllSynonymsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllSynonyms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllSynonyms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"suggestions"}},{"kind":"Field","name":{"kind":"Name","value":"appropriatenessScore"}}]}}]}}]} as unknown as DocumentNode<GetAllSynonymsQuery, GetAllSynonymsQueryVariables>;
export const SaveSynonymsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveSynonyms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"word"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"synonyms"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"appropriatenessScore"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveSynonyms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"word"},"value":{"kind":"Variable","name":{"kind":"Name","value":"word"}}},{"kind":"Argument","name":{"kind":"Name","value":"synonyms"},"value":{"kind":"Variable","name":{"kind":"Name","value":"synonyms"}}},{"kind":"Argument","name":{"kind":"Name","value":"appropriatenessScore"},"value":{"kind":"Variable","name":{"kind":"Name","value":"appropriatenessScore"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"suggestions"}},{"kind":"Field","name":{"kind":"Name","value":"appropriatenessScore"}}]}}]}}]} as unknown as DocumentNode<SaveSynonymsMutation, SaveSynonymsMutationVariables>;
export const CheckTextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckText"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkText"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"contextDependent"}},{"kind":"Field","name":{"kind":"Name","value":"aiDetectable"}},{"kind":"Field","name":{"kind":"Name","value":"geminiExplanation"}},{"kind":"Field","name":{"kind":"Name","value":"suggestions"}},{"kind":"Field","name":{"kind":"Name","value":"category"}}]}}]}}]} as unknown as DocumentNode<CheckTextQuery, CheckTextQueryVariables>;
export const AnalyzeSentimentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AnalyzeSentiment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"analyzeSentiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentiment"}},{"kind":"Field","name":{"kind":"Name","value":"appropriatenessScore"}},{"kind":"Field","name":{"kind":"Name","value":"toxicityScore"}},{"kind":"Field","name":{"kind":"Name","value":"professionalismScore"}},{"kind":"Field","name":{"kind":"Name","value":"review"}}]}}]}}]} as unknown as DocumentNode<AnalyzeSentimentQuery, AnalyzeSentimentQueryVariables>;