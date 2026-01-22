import { createEntityAdapter, type EntityState } from "@reduxjs/toolkit";
import { useMemo, useState } from "react";
import { getEntityActions } from "../actions.ts";
import { type DataSelectors, getSelectors, noSelect } from "../selectors.ts";
import type { EntityStateAdapter, IdItem, InitialEntityState } from "../types.ts";

/**
 * Creates a stable adapter instance outside the hook.
 * Since adapters are stateless configuration objects, we don't need
 * to recreate them or store them in React state.
 */
// biome-ignore lint/suspicious/noExplicitAny: fine here
const adapterInstance = createEntityAdapter<any>();

/**
 * react useState hook integrated with an entity adapter.
 * Provides entity state and actions to manipulate that state.
 *
 * @example
 * const [] = useStateWithEntity<{ id: string; name: string }>();
 * const [] = useStateWithEntity<{ id: string; name: string }>([]);
 * const [] = useStateWithEntity<{ id: string; name: string }>([], "total");
 * const [] = useStateWithEntity<{ id: string; name: string }>([], "full");
 * const [] = useStateWithEntity([] as { id: string; name: string }[], "full");
 * action.addOne({ id: "1", name: "Demo" });
 */
type SelectorKey<T extends IdItem> = keyof DataSelectors<T>;
type SelectorReturn<T extends IdItem, K extends SelectorKey<T>> = ReturnType<DataSelectors<T>[K]>;
type SelectorOrFull<T extends IdItem, K> = K extends SelectorKey<T> ? K : "full";

type Return<T extends IdItem, S extends SelectorKey<T>> = [SelectorReturn<T, S>, EntityStateAdapter<T, T["id"]>];

// biome-ignore format: no selector => full
export function useStateEntity<T extends IdItem>(): Return<T, "all">;

// biome-ignore format: initial state  => full selector
export function useStateEntity<T extends IdItem>(initialState: InitialEntityState<T>): Return<T, "all">;

// biome-ignore format: initial state + selector
export function useStateEntity<T extends IdItem>(initialState: InitialEntityState<T>, selector: "all"): Return<T, "all">;

// biome-ignore format: initial state  + selector
export function useStateEntity<T extends IdItem>(initialState: InitialEntityState<T>, selector: "entities"): Return<T, "entities">;

// biome-ignore format: initial state  + selector
export function useStateEntity<T extends IdItem>(initialState: InitialEntityState<T>, selector: "ids"): Return<T, "ids">;

// biome-ignore format: initial state  + selector
export function useStateEntity<T extends IdItem>(initialState: InitialEntityState<T>, selector: "total"): Return<T, "total">;

// biome-ignore format: initial state  + selector
export function useStateEntity<T extends IdItem>(initialState: InitialEntityState<T>, selector: "full"): Return<T, "full">;

//  Keep it short
export function useStateEntity<T extends IdItem, K extends SelectorKey<T>>(
	initialState?: InitialEntityState<T>,
	selector?: K,
): [SelectorReturn<T, SelectorOrFull<T, K>>, EntityStateAdapter<T, T["id"]>] {
	// Cast the generic adapter for type safety within the hook
	const adapter = adapterInstance as ReturnType<typeof createEntityAdapter<T>>;
	const selectorKey = (selector ?? "all") as SelectorKey<T>;

	const [state, setState] = useState(() =>
		initialState
			? adapter.setAll(adapter.getInitialState(), initialState instanceof Function ? initialState() : initialState)
			: adapter.getInitialState(),
	);

	const actions = useMemo(() => getEntityActions(adapter, setState), [adapter]);

	const data = useMemo(
		() =>
			getSelectors(adapter.getSelectors<EntityState<T, T["id"]>>(noSelect))[selectorKey](state) as SelectorReturn<
				T,
				SelectorOrFull<T, K>
			>,
		[state, adapter.getSelectors, selectorKey],
	);

	return [data, actions];
}
