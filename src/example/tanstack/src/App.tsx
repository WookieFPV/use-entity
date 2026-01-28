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
	const [title, setTitle] = useState("");
	const [note, setNote] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingTitle, setEditingTitle] = useState("");
	const [editingNote, setEditingNote] = useState("");

	const createTodo = () => {
		const trimmedTitle = title.trim();
		if (!trimmedTitle) return;
		actions.addOne({
			id: newId(),
			title: trimmedTitle,
			note: note.trim(),
			done: false,
		});
		setTitle("");
		setNote("");
	};

	const startEdit = (todo: Todo) => {
		setEditingId(todo.id);
		setEditingTitle(todo.title);
		setEditingNote(todo.note);
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditingTitle("");
		setEditingNote("");
	};

	const saveEdit = () => {
		if (!editingId) return;
		const trimmedTitle = editingTitle.trim();
		if (!trimmedTitle) return;
		actions.updateOne({
			id: editingId,
			changes: { title: trimmedTitle, note: editingNote.trim() },
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
					<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Write docs" />
				</label>
				<label>
					Note
					<input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional details" />
				</label>
				<button type="button" onClick={createTodo} disabled={!title.trim()}>
					Add todo
				</button>
			</div>

			<ul className="todo-list">
				{todos.length === 0 ? <li className="empty">No todos yet.</li> : null}
				{todos.map((todo) => {
					const isEditing = editingId === todo.id;
					return (
						<li key={todo.id} className={`todo-card${todo.done ? " done" : ""}`}>
							{isEditing ? (
								<div className="edit">
									<label>
										Title
										<input value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} />
									</label>
									<label>
										Note
										<input value={editingNote} onChange={(event) => setEditingNote(event.target.value)} />
									</label>
									<div className="actions">
										<button type="button" onClick={saveEdit} disabled={!editingTitle.trim()}>
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
