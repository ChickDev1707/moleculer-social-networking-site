"use strict";
import { Service, ServiceBroker } from "moleculer";
import * as dotenv from "dotenv";
import MediaAction from "./actions/media.action";
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
					handler: this.action.saveFile,
				},
			},

		});
	}
}

