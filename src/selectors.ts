import type { EntitySelectors, EntityState } from "@reduxjs/toolkit";
import type { EntitySelectorsData, IdItem } from "./types.ts";

const getEntityStateTanstack = <T extends IdItem>(
	entityState: EntityState<T, T["id"]>,
	selectors: EntitySelectors<T, EntityState<T, T["id"]>, T["id"]>,
): EntitySelectorsData<T, T["id"]> => ({
	all: selectors.selectAll(entityState),
	byId: (id) => selectors.selectById(entityState, id),
	ids: selectors.selectIds(entityState) as T["id"][],
	entities: selectors.selectEntities(entityState),
	total: selectors.selectTotal(entityState),
});

export const noSelect = <T>(state: T): T => state;

export const getSelectors = <T extends IdItem>(
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
