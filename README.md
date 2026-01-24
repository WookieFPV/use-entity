# use-entity

Fast, typed entity state for React with minimal boilerplate. Use it to manage
normalized collections with a ready-to-use hook, selector helpers, and adapter
actions that stay portable across state managers. Powered by Redux Toolkit's
[`createEntityAdapter`](https://redux-toolkit.js.org/api/createEntityAdapter).

## Install

```bash
npm install use-entity
```

## Quick Start (React useState)

```tsx
import { useStateEntity } from "use-entity";

type User = { id: string; name: string };

export function Users() {
	const [users, actions] = useStateEntity<User>([], "all");

	const addUsers = () => {
		actions.addOne({ id: "1", name: "John" });
	};

	return (
		<div>
			<button onClick={addUsers}>Seed</button>
			<pre>{JSON.stringify(users, null, 2)}</pre>
		</div>
	);
}
```

## Quick Start (TanStack React Store)

```tsx
import { createEntityStoreTanstack } from "use-entity";

type Todo = { id: string; title: string; done: boolean };

const { useEntity } = createEntityStoreTanstack<Todo>([
	{ id: "1", title: "Ship it", done: false },
]);

function TodoList() {
	const [todos, actions] = useEntity();

	return (
		<div>
			<ul>
				{todos.map((todo) => (
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

## Plain TanStack Store Usage

```tsx
import { useStore } from "@tanstack/react-store";
import { createEntityStoreTanstack } from "use-entity";

type User = { id: string; name: string };

const { adapter, store, actions, selectors } = createEntityStoreTanstack<User>();

export function UsersWithStore() {
	const users = useStore(store, selectors.all);

	const addUsers = () => {
        // can use exported actions or with store.setState
		actions.addOne({ id: "1", name: "John" });
		store.setState((prev) => adapter.addOne(prev, { id: "2", name: "Peter" }));
	};

	return (
		<div>
			<button onClick={addUsers}>Seed</button>
			<pre>{JSON.stringify(users, null, 2)}</pre>
		</div>
	);
}
```

## Selectors

`useEntity()` and `useStateEntity()` default to the `"all"` selector which return the array of items. You can
opt into other selectors (including the full selector object) or access `byId`. (Based on [rtk docs](https://redux-toolkit.js.org/api/createEntityAdapter#selector-functions))

```tsx
const [all] = useEntity("all");
const [ids] = useEntity("ids");
const [entities] = useEntity("entities");
const [total] = useEntity("total");
const [full] = useEntity("full");

const [allUsers] = useStateEntity<User>([], "all");
const [fullUsers] = useStateEntity<User>([], "full");
```

```tsx
const [full] = useEntity("full");
const todo = full.byId("2");
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
getEntityActions<T>(adapter, setState)
useStateEntity<T>(initial?: T[] | Record<string, T> | (() => T[] | Record<string, T>),
  selector?: "all" | "ids" | "entities" | "total" | "full")
```

## Notes

- `T` must include `id: string` (number as id is not yet supported).
