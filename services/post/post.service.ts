"use strict";

import {Service, ServiceBroker, Context} from "moleculer";
import DbService from "moleculer-db";
import MongooseDbAdapter from 'moleculer-db-adapter-mongoose'
import Post from './models/post.model'
import * as _ from 'lodash'

import Fakerator from 'fakerator'
const fake = Fakerator()

module.exports = {
	name: "posts",
	mixins: [DbService],
	adapter: new MongooseDbAdapter("mongodb://localhost:27017/ms-test-db"),
	model: Post,
	actions:{
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
				return this.adapter.find()
			},
		},

	},
	methods: {
		async seedDB(){
			try{
				let posts = await this.adapter.insertMany(_.times(20, () => {
					let fakePost = fake.entity.post();
					return {
						title: fakePost.title,
						content: fake.times(fake.lorem.paragraph, 10).join("\r\n"),
					};
				}));
				console.log(posts)
			}catch(err){
				console.log(err)
			}
		}
	},

	async afterConnected() {
		
	}
};
