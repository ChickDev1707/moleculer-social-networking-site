import { Validator, Errors } from "moleculer";
export class JoiValidator extends Validator {
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	constructor() {
		super();
	}

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	compile(schema: any) {
		return (params: any) => this.validate(params, schema);
	}

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	validate(params: any, schema: any) {
		const res = schema.validate(params);
		if (res.error) { throw new Errors.MoleculerError(res.error.message, 400); }
		return true;
	}
}
