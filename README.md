# use-entity [![npm][npm-image]][npm-url] ![npm][npm-dl-stats]

`useState`, but for normalized entity collections.

`use-entity` gives you typed CRUD actions and selector helpers for collections backed by Redux Toolkit's [`createEntityAdapter`](https://redux-toolkit.js.org/api/createEntityAdapter). Use it for local React state or pair it with TanStack Store when the collection should live outside a single component.

## Install

```bash
npm install use-entity react @reduxjs/toolkit
```

Optional TanStack Store integration:

```bash
npm install @tanstack/react-store
```

## Quick Start

```tsx
import { useStateEntity } from "use-entity";

type User = { id: string; name: string; age: number };

export function Users() {
  const [users, actions] = useStateEntity<User>();

  const addUser = () =>
    actions.addOne({
      id: String(Date.now()),
      name: `User ${users.length + 1}`,
      age: 20
    });

  const birthday = (user: User) =>
    actions.updateOne({
      id: user.id,
      changes: { age: user.age + 1 }
    });

  return (
    <div>
      <button onClick={addUser}>Add user</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.age})
            <button onClick={() => birthday(user)}>+1 age</button>
            <button onClick={() => actions.removeOne(user.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Included Actions

`use-entity` mirrors Redux Toolkit's entity adapter CRUD API:

```ts
addOne, addMany
setOne, setMany, setAll
removeOne, removeMany, removeAll
updateOne, updateMany
upsertOne, upsertMany
```

## Selectors

Both `useStateEntity()` and the TanStack `useEntity()` hook default to the `"all"` selector.

Available selectors:

```ts
"all"      // T[]
"ids"      // string[]
"entities" // Record<string, T>
"total"    // number
"full"     // all selectors + byId(id)
```

Example:

```tsx
const [all] = useStateEntity<User>([], "all");
const [ids] = useStateEntity<User>([], "ids");
const [entities] = useStateEntity<User>([], "entities");
const [total] = useStateEntity<User>([], "total");
const [full] = useStateEntity<User>([], "full");

const user = full.byId("2");
```

## TanStack Store

For shared entity state, use the optional `use-entity/tanstack` entrypoint:

```tsx
import { createEntityStoreTanstack } from "use-entity/tanstack";

type Todo = { id: string; title: string; done: boolean };

const { useEntity } = createEntityStoreTanstack<Todo>();
```

See [tanstack-store-readme.md](./tanstack-store-readme.md) for the full TanStack Store example.

## Notes

- Entities must include `id: string`
- `@tanstack/react-store` is optional and only needed for the TanStack integration

[npm-image]: https://img.shields.io/npm/v/use-entity
[npm-url]: https://www.npmjs.com/package/use-entity
[npm-dl-stats]: https://img.shields.io/npm/dm/use-entity
