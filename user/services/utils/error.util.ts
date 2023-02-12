import { Errors } from "moleculer";

const handleError = (error: any): void => {
  if (error.code && error.code <= 500) {
    // Rethrow error if not internal server error
    throw error;
  }
  else {
    throw new Errors.MoleculerClientError("Internal server error", 500);
  }
};

export { handleError };
