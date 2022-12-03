"use strict";

import { Service, ServiceBroker, Context } from "moleculer";
import DbService from "moleculer-db";
import MongooseDbAdapter from "moleculer-db-adapter-mongoose";
import Fakerator from "fakerator";
import * as _ from "lodash";
import * as dotenv from "dotenv";
import Post from "./models/post.model";
dotenv.config();

const fake = Fakerator();

module.exports = {
	name: "posts",
	adapter: new MongooseDbAdapter(process.env.MONGODB_URI),
	model: Post,
	actions: {
		/**
		 * Say a 'Hello' action.
		 *
		 */
		getPosts: {
			rest: {
				method: "GET",
				path: "/",
			},
			async handler(): Promise<string> {
				return this.adapter.find();
			},
		},

	},
	methods: {
		async seedDB() {
			try {
				const posts = await this.adapter.insertMany(_.times(20, () => {
					const fakePost = fake.entity.post();
					return {
						title: fakePost.title,
						content: fake.times(fake.lorem.paragraph, 10).join("\r\n"),
					};
				}));
				console.log(posts);
			} catch (err) {
				console.log(err);
			}
		},
	},
};
