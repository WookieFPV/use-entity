import { createEntityStoreTanstack } from "../adapter/tanstack.ts";

type User = { id: string; name: string };

const { useEntity } = createEntityStoreTanstack<User>();

export const ExampleTanstackEntityStore = () => {
	const [_state, action] = useEntity("all");

	action.addOne({ id: "1", name: "John" });
	action.addMany([{ id: "2", name: "Peter" }]);
	action.upsertOne({ id: "2", name: "Peter" });

	return null;
};
