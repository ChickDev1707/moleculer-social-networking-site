/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { IncomingMessage, ServerResponse } from "http";
import { Service, ServiceBroker, Context, Errors } from "moleculer";
import ApiGateway from "moleculer-web";
import * as jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../user/types/jwt-payload.type";
import { UserModel } from "../user/types/models";

export default class ApiService extends Service {

	public constructor(broker: ServiceBroker) {
		super(broker);
		// @ts-ignore
		this.parseServiceSchema({
			name: "api",
			mixins: [ApiGateway],
			// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
			settings: {
				port: process.env.PORT || 3000,
				cors: {
					// Configures the Access-Control-Allow-Origin CORS header.
					origin: "*",
					// Configures the Access-Control-Allow-Methods CORS header.
					methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
					// Configures the Access-Control-Allow-Headers CORS header.
					allowedHeaders: "*",
					// Configures the Access-Control-Expose-Headers CORS header.
					exposedHeaders: "*",
					// Configures the Access-Control-Allow-Credentials CORS header.
					credentials: true,
					// Configures the Access-Control-Max-Age CORS header.
					maxAge: 24 * 60 * 60,
				},
				routes: [
					{
						path: "/api",
						whitelist: [
							// Access to any actions in all services under "/api" URL
							"**",
						],
						// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
						use: [],
						// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
						mergeParams: true,

						// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
						authentication: false,

						// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
						authorization: false,

						// The auto-alias feature allows you to declare your route alias directly in your services.
						// The gateway will dynamically build the full routes from service schema.
						autoAliases: true,

						aliases: {},
						/**
						 * Before call hook. You can check the request.
						 * @param {Context} ctx
						 * @param {Object} route
						 * @param {IncomingMessage} req
						 * @param {ServerResponse} res
						 * @param {Object} data
						 */
						onBeforeCall: (ctx: Context<any, { accessToken: string }>,
							route: object, req: any, res: ServerResponse) => {
							// Attach accessToken to ctx
							const auth = req.headers.authorization;
							if (auth && auth.startsWith("Bearer")) {
								ctx.meta.accessToken = auth.slice(7);
							}
						},

						// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
						callingOptions: {},

						bodyParsers: {
							json: {
								strict: false,
								limit: "1MB",
							},
							urlencoded: {
								extended: true,
								limit: "1MB",
							},
						},

						// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
						mappingPolicy: "all", // Available values: "all", "restrict"

						// Enable/disable logging
						logging: true,
					},
					{
						path: "/upload",

						aliases: {
							// File upload from HTML multipart form
							"POST /": "multipart:media.save",

							// File upload from HTML form and overwrite busboy config
							"POST /multi": {
								type: "multipart",
								// Action level busboy config
								busboyConfig: {
									limits: { files: 3 },
								},
								action: "media.save",
							},
						},

						// Route level busboy config.
						// More info: https://github.com/mscdex/busboy#busboy-methods
						busboyConfig: {
							limits: { files: 1 },
							// Can be defined limit event handlers
							// `onPartsLimit`, `onFilesLimit` or `onFieldsLimit`
						},

						mappingPolicy: "restrict",
					},
				],
				// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
				log4XXResponses: false,
				// Logging the request parameters. Set to any log level to enable it. E.g. "info"
				logRequestParams: null,
				// Logging the response data. Set to any log level to enable it. E.g. "info"
				logResponseData: null,
				// Serve assets from "public" folder
				assets: {
					folder: "public",
					// Options to `server-static` module
					options: {},
				},
			},
			methods: {
				/**
				 * Authenticate the request. It checks the `Authorization` token value in the request header.
				 * Check the token value & resolve the user by the token.
				 * The resolved user will be available in `ctx.meta.user`
				 *
				 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
				 *
				 * @param {Context} ctx
				 * @param {any} route
				 * @param {IncomingMessage} req
				 * @returns {Promise}
				 */

				authenticate: async (ctx: Context, route: any, req: IncomingMessage): Promise<any> => {
					// Read the token from header
					const auth = req.headers.authorization;
					if (auth && auth.startsWith("Bearer")) {
						const accessToken = auth.slice(7);
						const token: CustomJwtPayload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as CustomJwtPayload;

						const user: UserModel.User = await this.userRepo.findUserById(token.userId);
						if (!user) {
							// User in token is invalid
							throw new Errors.MoleculerClientError("Unauthorized", 404);
						}

					} else {
						// No token. Throw an error or do nothing if anonymous access is allowed.
						throw new Errors.MoleculerError("Unauthorize", 401);
					}
				},
			},

			/**
			 * Authorize the request. Check that the authenticated user has right to access the resource.
			 *
			 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
			 *
			 * @param {Context} ctx
			 * @param {Object} route
			 * @param {IncomingMessage} req
			 * @returns {Promise}

			async authorize (ctx: Context < any, {
				user: string;
			} > , route: Record<string, undefined>, req: IncomingMessage): Promise < any > => {
				// Get the authenticated user.
				const user = ctx.meta.user;

				// It check the `auth` property in action schema.
				// @ts-ignore
				if (req.$action.auth === "required" && !user) {
					throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS", {
						error: "Unauthorized",
					});
				}
			},
				*/
		});
	}
}
