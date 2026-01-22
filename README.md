# use-entity

Fast, typed entity state for React with minimal boilerplate. Use it to manage
normalized collections with a ready-to-use hook, selector helpers, and adapter
actions that stay portable across state managers. Powered by Redux Toolkit's
[`createEntityAdapter`](https://redux-toolkit.js.org/api/createEntityAdapter).

## Install

```bash
npm install use-entity
```

## Quick Start (TanStack React Store)

```tsx
import { createEntityStoreTanstack } from "use-entity";

type Todo = { id: string; title: string; done: boolean };

const { useEntity } = createEntityStoreTanstack<Todo>([
	{ id: "1", title: "Ship it", done: false },
]);

function TodoList() {
	const [state, actions] = useEntity();

	return (
		<div>
			<ul>
				{state.all.map((todo) => (
					<li key={todo.id}>{todo.title}</li>
				))}
			</ul>
			<button
				onClick={() =>
					actions.addOne({ id: "2", title: "Celebrate", done: false })
				}
			>
				Add
			</button>
		</div>
	);
}
```

## Selecting State

`useEntity()` returns the full selector object by default. You can also ask for
a specific selector to reduce re-renders.

```tsx
const [all] = useEntity("all");
const [ids] = useEntity("ids");
const [entities] = useEntity("entities");
const [total] = useEntity("total");
const [full] = useEntity("full");
```

```tsx
const [state] = useEntity();
const todo = state.byId("2");
```

The full selector object looks like:

```ts
{
	all: T[];
	ids: string[];
	entities: Record<string, T>;
	total: number;
	byId: (id: string) => T | undefined;
}
```

## Actions

All actions mirror Redux Toolkit's entity adapter API
([docs](https://redux-toolkit.js.org/api/createEntityAdapter#crud-functions)):

```ts
addOne, addMany,
setOne, setMany, setAll,
removeOne, removeMany, removeAll,
updateOne, updateMany,
upsertOne, upsertMany
```
## Exports

```ts
createEntityStoreTanstack<T>(initial?: T[])
entityStoreFactory<T>(initial?: T[])
getEntityActions<T>(store, adapter)
```

## Notes

- `T` must include `id: string`.
- Peer deps: `react`, `@reduxjs/toolkit`, `@tanstack/react-store`, `typescript`.
