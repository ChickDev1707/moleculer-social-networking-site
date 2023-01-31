"use strict";
import { Service, ServiceBroker } from "moleculer";
import MediaAction from "./actions/media.action";
import * as dotenv from "dotenv";
dotenv.config();

export default class MediaService extends Service {

	private action: MediaAction = new MediaAction();
	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "media",
			actions: {
				// Media service
				// Save image uploaded from clients
				save: {
					rest: {
						method: "GET",
						path: "/save",
					},
					handler: this.action.saveFile,
				},
				removeFiles: {
					rest: {
						method: "POST",
						path: "/remove",
					},
					params: { images: "array" },
					handler: this.action.removeFiles,
				},
			},

		});
	}
}

