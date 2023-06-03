export interface errorMessage {
  message: string;
}

export interface successMessage {
  message: string;
  data: object;
  token?: string 
}

export interface AccessToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}
