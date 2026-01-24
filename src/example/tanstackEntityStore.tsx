import { useStore } from "@tanstack/react-store";
import { createEntityStoreTanstack } from "../adapter/tanstack.ts";

type User = { id: string; name: string };

const { useEntity, store, actions, selectors } = createEntityStoreTanstack<User>();

// useEntity with selector string:
export const ExampleTanstackEntityStore = () => {
	const [users, action] = useEntity("all");

	const onAdd = () => {
		const id = String(Date.now());
		action.addOne({ id, name: `User ${users.length + 1}` });
	};

	return (
		<div>
			<button onClick={onAdd}>Add</button>
			<ul>
				{users.map((user) => (
					<li key={user.id}>
						{user.name}
						<button onClick={() => action.removeOne(user.id)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
};

// useStore (tanstack store) + store & selector from createEntityStoreTanstack:
export const ExampleTanstackEntityStorePlain = () => {
	const users = useStore(store, selectors.all);

	const onAdd = () => {
		const id = String(Date.now());
		actions.addOne({ id, name: `User ${users.length + 1}` });
	};

	return (
		<div>
			<button onClick={onAdd}>Add</button>
			<ul>
				{users.map((user) => (
					<li key={user.id}>
						{user.name}
						<button onClick={() => actions.removeOne(user.id)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
};
