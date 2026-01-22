import { useStateEntity } from "../adapter/useState.ts";

type User = { id: string; name: string };

export const MyComponent = () => {
	const [state, action] = useStateEntity<User>([], "total");

	action.addOne({ id: "1", name: "John" });
	action.addMany([{ id: "2", name: "Peter" }]);

	console.log(state);

	return null;
};
