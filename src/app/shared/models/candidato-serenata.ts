export interface Afiliacao {
  party: string;
  started_in: string;
}

export interface Patrimonio {
  year: number;
  value: number;
}

export interface Eleicao {
  post: string;
  year: number;
  result: string;
  elected: boolean;
}

export interface CandidatoSerenata {
  id: number;
  name: string;
  image: string;
  ballot_name: string;
  ballot_number: number;
  city: string;
  state: string;
  party: string;
  party_abbreviation: string;
  affiliation_history: Afiliacao[];
  asset_history: Patrimonio[];
  elections: number;
  elections_won: number;
  election_history: Eleicao[];
  date_of_birth: string;
  city_of_birth: string;
  state_of_birth: string;
  gender: string;
  email: string;
  age: string;
  ethnicity: string;
  marital_status: string;
  education: string;
  nationality: string;
  occupation: string;
  post: string;
  post_code: number;
  number: number;
  coalition_name: string;
  coalition_description: string;
  coalition_short_name: string;
  bills: any[];
  bill_keywords: any[];
  rosies_suspicions: any[];
}
