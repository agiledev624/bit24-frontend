import _uniqueId from 'lodash/uniqueId';

export function generateRandTokenId(): string {
  return _uniqueId('token_')
}

export interface Response {
  code: number;
  data: any;
  errorMessage?: string;
}

export function createFakeResponse(code: number, data: any, errorMessage?: string): Response {
  const res = {
    code,
    data
  };

  if(errorMessage) {
    return {
      ...res,
      errorMessage
    }
  }

  return res;
}