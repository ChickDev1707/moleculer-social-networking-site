import { Service, ServiceBroker} from "moleculer";

export default class MessageService extends Service {
	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "rooms",
			actions: {
                join: {
                    handler: (ctx: any) => {
                        ctx.meta.$join = ctx.params.join;
                    },
                },
                leave: {
                    handler: (ctx: any) => {
                        ctx.meta.$leave = ctx.params.leave;
                    },
                },
			},
		});
	}
}
