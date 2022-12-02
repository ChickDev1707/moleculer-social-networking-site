/**
 * Interface for return type of response
 * code: http code, ex: 200, 201, 400, 401, ...
 * message: error or success message
 */
export interface IApiResponse{
  message: string;
  code?: number;
  data?: any;
};
