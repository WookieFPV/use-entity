import { useStateEntity } from "../adapter/useState.ts";

type User = { id: string; name: string };

export const ExampleUseStateEntity = () => {
	const [users, action] = useStateEntity<User>();

	const addUser = () => {
		const id = String(Date.now());
		action.addOne({ id, name: `User ${users.length + 1}` });
	};

	return (
		<div>
			<button onClick={addUser}>Add user</button>
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
