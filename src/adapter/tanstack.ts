import { createEntityAdapter, type EntityState } from "@reduxjs/toolkit";
import { Store, useStore } from "@tanstack/react-store";
import { getEntityActions } from "../actions.ts";
import { getSelectors, noSelect } from "../selectors.ts";
import type { EntityStateAdapter, IdItem } from "../types.ts";

export const entityStoreFactory = <T extends IdItem>(initialState?: T[]) => {
	const adapter = createEntityAdapter<T>();
	const store = new Store(
		initialState
			? adapter.setAll(adapter.getInitialState(), initialState)
			: adapter.getInitialState(),
	);
	const actions = getEntityActions(adapter, (updater) => store.setState(updater));
	const selectors = getSelectors(adapter.getSelectors<EntityState<T, T["id"]>>(noSelect));
	return { store, adapter, selectors, actions };
};
export const createEntityStoreTanstack = <T extends IdItem>(initialState?: T[]) => {
	const { adapter, store, actions, selectors } = entityStoreFactory(initialState);

	type SelectorKey = keyof typeof selectors;
	type SelectorReturn<K extends SelectorKey> = ReturnType<(typeof selectors)[K]>;

	function useEntity(): [SelectorReturn<"full">, EntityStateAdapter<T, T["id"]>];
	function useEntity(selector: "full"): [SelectorReturn<"full">, EntityStateAdapter<T, T["id"]>];
	function useEntity<K extends Exclude<SelectorKey, "full">>(
		selector: K,
	): [SelectorReturn<K>, EntityStateAdapter<T, T["id"]>];

	function useEntity<K extends SelectorKey>(selector: K = "full" as K) {
		const entityState = useStore(store, selectors[selector] as () => SelectorReturn<K>);

		return [entityState, actions] satisfies [SelectorReturn<K>, EntityStateAdapter<T, T["id"]>];
	}

	return { useEntity, store, actions, adapter };
};
