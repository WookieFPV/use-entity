import { useStore } from "@tanstack/react-store";
import { createEntityStoreTanstack } from "../adapter/tanstack.ts";

type Todo = { id: string; title: string; done: boolean };

const { useEntity, store, actions, selectors } = createEntityStoreTanstack<Todo>();

// useEntity with default selector ("all"):
export const ExampleTanstackEntityStore = () => {
	const [todos, entityActions] = useEntity();

	const addTodo = () =>
		entityActions.addOne({ id: String(Date.now()), title: `Task ${todos.length + 1}`, done: false });

	const toggleTodo = (todo: Todo) => entityActions.updateOne({ id: todo.id, changes: { done: !todo.done } });

	return (
		<div>
			<button onClick={addTodo}>Add</button>
			<ul>
				{todos.map((todo) => (
					<li key={todo.id}>
						<button
							type="button"
							onClick={() => toggleTodo(todo)}
							style={{ textDecoration: todo.done ? "line-through" : "none" }}
						>
							{todo.title}
						</button>
						<button type="button" onClick={() => entityActions.removeOne(todo.id)}>
							Remove
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

// useStore (tanstack store) + store & selector from createEntityStoreTanstack:
export const ExampleTanstackEntityStore2 = () => {
	const todos = useStore(store, selectors.all);
	const total = useStore(store, selectors.total);

	const addTodo = () => actions.addOne({ id: String(Date.now()), title: `Task ${todos.length + 1}`, done: false });

	return (
		<div>
			<button onClick={addTodo}>Add</button>
			<div>Total: {total}</div>
			<ul>
				{todos.map((todo) => (
					<li key={todo.id}>
						<button
							type="button"
							onClick={() => actions.updateOne({ id: todo.id, changes: { done: !todo.done } })}
							style={{ textDecoration: todo.done ? "line-through" : "none" }}
						>
							{todo.title}
						</button>
						<button type="button" onClick={() => actions.removeOne(todo.id)}>
							Remove
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};
