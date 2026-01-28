import { useStateEntity } from "../adapter/useState.ts";

type Todo = { id: string; title: string; done: boolean };

export const ExampleUseStateEntity = () => {
	const [todos, actions] = useStateEntity<Todo>();

	const addTodo = () => actions.addOne({ id: String(Date.now()), title: `Task ${todos.length + 1}`, done: false });

	const toggleTodo = (todo: Todo) => actions.updateOne({ id: todo.id, changes: { done: !todo.done } });

	return (
		<div>
			<button onClick={addTodo}>Add todo</button>
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
						<button type="button" onClick={() => actions.removeOne(todo.id)}>
							Remove
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};
