import { Service, ServiceBroker } from "moleculer";

export default class MessageService extends Service {
	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "rooms",
			actions: {
				join: {
					handler: ctx => {
						ctx.broker.logger.error("rooms", ctx.meta.$rooms, ctx.params.join)
						if(ctx.meta.$rooms.indexOf(ctx.params.join)< 0){
							ctx.meta.$join = ctx.params.join;
							ctx.broker.logger.error("join room")
						}
						ctx.broker.logger.error("has room")
					},
				},
				leave: {
					handler: ctx => {
						ctx.meta.$leave = ctx.params.leave;
					},
				},
			},
		});
	}
}
