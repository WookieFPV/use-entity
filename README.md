# use-entity

Fast, typed entity state for React with minimal boilerplate. It gives you
consistent CRUD operations for normalized collections, plus a ready-to-use
hook and selector helpers that stay portable across state managers. Powered by Redux Toolkit's
[`createEntityAdapter`](https://redux-toolkit.js.org/api/createEntityAdapter).

Why it’s useful:
- `useState`-like API for collections with CRUD actions.
- CRUD-first API for collections (add, update, remove, upsert) with strong typing.
- TanStack Store integration (see [docs](./tanstack-store-readme.md)).
- Normalized data with built-in selectors (`all`, `ids`, `entities`, `byId`, `total`).

## Install

```bash
npm install use-entity
```

## Quick Start (React useState)

```tsx
import { useStateEntity } from "use-entity";

type User = { id: string; name: string; age: number };

export function Users() {
    const [users, actions] = useStateEntity<User>();

    const addUser = () =>
        actions.addOne({ id: String(Date.now()), name: `User ${users.length + 1}`, age: 20 });

    const birthday = (user: User) =>
        actions.updateOne({ id: user.id, changes: { age: user.age + 1 } });
    
    return (
        <div>
            <button onClick={addUser}>Add user</button>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <span>
                            {user.name} ({user.age})
                        </span>
                        <button onClick={() => birthday(user)}>+1 age</button>
                        <button onClick={() => actions.removeOne(user.id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
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

## Selectors

`useEntity()` and `useStateEntity()` default to the `"all"` selector, which returns the array of items. You can
opt into other selectors (including the full selector object) and access `byId`. (Based on [rtk docs](https://redux-toolkit.js.org/api/createEntityAdapter#selector-functions))

#### Selector options:

```ts
all: T[];
ids: string[];
entities: Record<string, T>;
total: number;
full: {
  all: T[];
  ids: string[];
  entities: Record<string, T>;
  total: number;
  byId: (id: string) => T | undefined;
};
```

#### Usage:

```tsx
const [all] = useStateEntity<User>([], "all");
const [ids] = useStateEntity<User>([], "ids");
const [entities] = useStateEntity<User>([], "entities");
const [total] = useStateEntity<User>([], "total");
const [full] = useStateEntity<User>([], "full");

const user2 = full.byId("2");
```

## Notes

- `T` must include `id: string` (number as id is not yet supported).
