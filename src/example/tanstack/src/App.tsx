import { useState } from "react";
import { useStateEntity } from "use-entity";
import "./index.css";

type Todo = {
	id: string;
	title: string;
	note: string;
	done: boolean;
};

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const initialTodos: Todo[] = [
	{ id: newId(), title: "Learn React", note: "Read the docs", done: false },
	{ id: newId(), title: "try use-entity", note: "Read the docs", done: false },
];

export function App() {
	const [todos, actions] = useStateEntity(initialTodos);
	const [form, setForm] = useState({ title: "", note: "" });
	const [editing, setEditing] = useState<null | { id: string; title: string; note: string }>(null);

	const updateForm = (field: "title" | "note", value: string) => setForm((prev) => ({ ...prev, [field]: value }));

	const updateEditing = (field: "title" | "note", value: string) =>
		setEditing((prev) => (prev ? { ...prev, [field]: value } : prev));

	const createTodo = () => {
		const trimmedTitle = form.title.trim();
		if (!trimmedTitle) return;
		actions.addOne({
			id: newId(),
			title: trimmedTitle,
			note: form.note.trim(),
			done: false,
		});
		setForm({ title: "", note: "" });
	};

	const startEdit = (todo: Todo) => {
		setEditing({ id: todo.id, title: todo.title, note: todo.note });
	};

	const cancelEdit = () => {
		setEditing(null);
	};

	const saveEdit = () => {
		if (!editing) return;
		const trimmedTitle = editing.title.trim();
		if (!trimmedTitle) return;
		actions.updateOne({
			id: editing.id,
			changes: { title: trimmedTitle, note: editing.note.trim() },
		});
		cancelEdit();
	};

	return (
		<div className="app">
			<h1>Todos</h1>

			<div className="card">
				<h2>Create</h2>
				<label>
					Title
					<input
						value={form.title}
						onChange={(event) => updateForm("title", event.target.value)}
						placeholder="Write docs"
					/>
				</label>
				<label>
					Note
					<input
						value={form.note}
						onChange={(event) => updateForm("note", event.target.value)}
						placeholder="Optional details"
					/>
				</label>
				<button type="button" onClick={createTodo} disabled={!form.title.trim()}>
					Add todo
				</button>
			</div>

			<ul className="todo-list">
				{todos.length === 0 ? <li className="empty">No todos yet.</li> : null}
				{todos.map((todo) => {
					const isEditing = editing?.id === todo.id;
					return (
						<li key={todo.id} className={`todo-card${todo.done ? " done" : ""}`}>
							{isEditing ? (
								<div className="edit">
									<label>
										Title
										<input
											value={editing?.title ?? ""}
											onChange={(event) => updateEditing("title", event.target.value)}
										/>
									</label>
									<label>
										Note
										<input
											value={editing?.note ?? ""}
											onChange={(event) => updateEditing("note", event.target.value)}
										/>
									</label>
									<div className="actions">
										<button type="button" onClick={saveEdit} disabled={!editing?.title.trim()}>
											Save
										</button>
										<button type="button" onClick={cancelEdit}>
											Cancel
										</button>
									</div>
								</div>
							) : (
								<div className="view">
									<div>
										<div className="title-row">
											<strong>{todo.title}</strong>
											<span className={`status ${todo.done ? "done" : "active"}`}>{todo.done ? "Done" : "Active"}</span>
										</div>
										{todo.note ? <p>{todo.note}</p> : null}
									</div>
									<div className="actions">
										<button
											type="button"
											onClick={() =>
												actions.updateOne({
													id: todo.id,
													changes: { done: !todo.done },
												})
											}
										>
											{todo.done ? "Mark active" : "Mark done"}
										</button>
										<button type="button" onClick={() => startEdit(todo)}>
											Edit
										</button>
										<button type="button" onClick={() => actions.removeOne(todo.id)}>
											Delete
										</button>
									</div>
								</div>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default App;
