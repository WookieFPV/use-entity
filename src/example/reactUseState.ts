import { useStateEntity } from "../adapter/useState.ts";

type User = { id: string; name: string };

export const ExampleUseStateEntity = () => {
	const [state, action] = useStateEntity<User>([], "all");

	action.addOne({ id: "1", name: "John" });
	action.addMany([{ id: "2", name: "Peter" }]);
	action.upsertOne({ id: "2", name: "Peter" });

	console.log(state);

	return null;
};
