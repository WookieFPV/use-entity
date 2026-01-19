import {
	createEntityAdapter,
	type EntityAdapter,
	type EntitySelectors,
	type EntityState,
} from "@reduxjs/toolkit";
import { Store, useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import type { EntitySelectorsData, EntityStateAdapter } from "./types.ts";

const getEntityActionsTanstack = <
	T extends {
		id: string;
	},
>(
	store: Store<EntityState<T, T["id"]>>,
	adapter: EntityAdapter<T, T["id"]>,
): EntityStateAdapter<T, T["id"]> => ({
	setOne: (entity) => store.setState((prev) => adapter.setOne(prev, entity)),
	setMany: (entities) =>
		store.setState((prev) => adapter.setMany(prev, entities)),
	setAll: (entities) =>
		store.setState((prev) => adapter.setAll(prev, entities)),

	addOne: (entity) => store.setState((prev) => adapter.addOne(prev, entity)),
	addMany: (entities) =>
		store.setState((prev) => adapter.addMany(prev, entities)),

	removeOne: (entityId) =>
		store.setState((prev) => adapter.removeOne(prev, entityId)),
	removeMany: (entityIds) =>
		store.setState((prev) => adapter.removeMany(prev, entityIds)),
	removeAll: () => store.setState((prev) => adapter.removeAll(prev)),

	updateOne: (update) =>
		store.setState((prev) => adapter.updateOne(prev, update)),
	updateMany: (updates) =>
		store.setState((prev) => adapter.updateMany(prev, updates)),

	upsertOne: (entity) =>
		store.setState((prev) => adapter.upsertOne(prev, entity)),
	upsertMany: (entities) =>
		store.setState((prev) => adapter.upsertMany(prev, entities)),
});

const getEntityStateTanstack = <
	T extends {
		id: string;
	},
>(
	entityState: EntityState<T, T["id"]>,
	selectors: EntitySelectors<T, EntityState<T, T["id"]>, T["id"]>,
): EntitySelectorsData<T, T["id"]> => ({
	all: selectors.selectAll(entityState),
	byId: (id) => selectors.selectById(entityState, id),
	ids: selectors.selectIds(entityState) as T["id"][],
	entities: selectors.selectEntities(entityState),
	total: selectors.selectTotal(entityState),
});
const getSelectors = <
	T extends {
		id: string;
	},
>(
	baseSelectors: EntitySelectors<T, EntityState<T, T["id"]>, T["id"]>,
) =>
	({
		all: baseSelectors.selectAll,
		entities: baseSelectors.selectEntities,
		ids: baseSelectors.selectIds,
		total: baseSelectors.selectTotal,
		full: (state) => getEntityStateTanstack(state, baseSelectors),
	}) satisfies Record<
		keyof Omit<EntitySelectorsData<T, T["id"]>, "byId"> | "full",
		(state: EntityState<T, T["id"]>) => unknown
	>;

export const createEntityStore = <
	T extends {
		id: string;
	},
>(
	initialState?: T[],
) => {
	const adapter = createEntityAdapter<T>();
	const store = new Store(
		initialState
			? adapter.setAll(adapter.getInitialState(), initialState)
			: adapter.getInitialState(),
	);
	const baseSelectors = adapter.getSelectors<EntityState<T, T["id"]>>(
		(input) => input,
	);
	const MySelectors = getSelectors(baseSelectors);

	type SelectorKey = keyof typeof MySelectors;
	type SelectorReturn<K extends SelectorKey> = ReturnType<
		(typeof MySelectors)[K]
	>;

	function useEntity(): [
		SelectorReturn<"full">,
		EntityStateAdapter<T, T["id"]>,
	];
	function useEntity(
		selector: "full",
	): [SelectorReturn<"full">, EntityStateAdapter<T, T["id"]>];
	function useEntity<K extends Exclude<SelectorKey, "full">>(
		selector: K,
	): [SelectorReturn<K>, EntityStateAdapter<T, T["id"]>];

	function useEntity<K extends SelectorKey>(selector: K = "full" as K) {
		const entityState = useStore(
			store,
			MySelectors[selector] as () => SelectorReturn<K>,
		);
		const actions = useMemo<EntityStateAdapter<T, T["id"]>>(
			() => getEntityActionsTanstack(store, adapter),
			[],
		);
		return [entityState, actions] satisfies [
			SelectorReturn<K>,
			EntityStateAdapter<T, T["id"]>,
		];
	}

	return { useEntity, store, adapter };
};
