## TanStack React Store Integration

If local React state is not enough for you, you can use `@tanstack/react-store` instead.
It provides a global store and hooks for accessing it.
This package provides a `createEntityStoreTanstack` function that creates a store and a ready-to-use hook.

When you choose this integration, install `@tanstack/react-store`:

```bash
npm install @tanstack/react-store
```

## Quick Start (TanStack React Store)

```tsx
import { createEntityStoreTanstack } from "use-entity/tanstack";

type Todo = { id: string; title: string; done: boolean };

const { useEntity } = createEntityStoreTanstack<Todo>();

function TodoList() {
    const [todos, actions] = useEntity();

    const addTodo = () =>
        actions.addOne({ id: String(Date.now()), title: `Task ${todos.length + 1}`, done: false });

    return (
        <div>
            <button onClick={addTodo}>Add</button>
            <ul>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        onClick={() => actions.updateOne({ id: todo.id, changes: { done: !todo.done } })}
                        style={{ cursor: "pointer", textDecoration: todo.done ? "line-through" : "none" }}
                    >
                        {todo.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

If you need a different selector, pass the key to `useEntity`:

```tsx
const [total] = useEntity("total");
const [full] = useEntity("full");

const todo = full.byId("1");
```

## TanStack Store (Alternative API)

```tsx
import { useStore } from "@tanstack/react-store";
import { createEntityStoreTanstack } from "use-entity/tanstack";

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

## Exports

```ts
import { createEntityStoreTanstack } from "use-entity/tanstack";

type User = { id: string; name: string };

const { useEntity, store, actions, selectors, adapter } = createEntityStoreTanstack<User>();
```

Overview:
- `useEntity`: ready-to-use hook that returns `[entities, actions]`
- `store`: the TanStack Store instance
- `actions`: CRUD actions
- `selectors`: selector helpers
- `adapter`: Redux Toolkit adapter for manual store updates (alternative to actions)
