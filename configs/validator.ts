import { Validator, Errors } from "moleculer";

/**
 * Custom joi validator class extending base validator class from moleculer
 */
export class JoiValidator extends Validator {
	public constructor() {
		super();
	}

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	compile(schema: any) {
		return (params: any) => this.validate(params, schema);
	}

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	validate(params: any, schema: any) {
		// Use Joi schema validate function to validate input (params)
		// const res = schema.validate(params);
		// Return bad request if fields validation is failed
		// if (res.error) { throw new Errors.MoleculerError(res.error.message, 400); }
		return true;
	}
}
