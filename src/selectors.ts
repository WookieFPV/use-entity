import type { EntitySelectors, EntityState } from "@reduxjs/toolkit";
import type { EntitySelectorsData, IdItem } from "./types.ts";

const getEntitySelectorsFull = <T extends IdItem>(
	entityState: EntityState<T, T["id"]>,
	selectors: EntitySelectors<T, EntityState<T, T["id"]>, T["id"]>,
): EntitySelectorsData<T, T["id"]> => ({
	all: selectors.selectAll(entityState),
	byId: (id) => selectors.selectById(entityState, id),
	ids: selectors.selectIds(entityState) as T["id"][],
	entities: selectors.selectEntities(entityState),
	total: selectors.selectTotal(entityState),
});

export type DataSelectors<T extends IdItem> = {
	all: EntitySelectors<T, EntityState<T, T["id"]>, T["id"]>["selectAll"];
	entities: EntitySelectors<T, EntityState<T, T["id"]>, T["id"]>["selectEntities"];
	ids: EntitySelectors<T, EntityState<T, T["id"]>, T["id"]>["selectIds"];
	total: EntitySelectors<T, EntityState<T, T["id"]>, T["id"]>["selectTotal"];
	full: (state: EntityState<T, T["id"]>) => EntitySelectorsData<T, T["id"]>;
};

export const getSelectors = <T extends IdItem>(
	baseSelectors: EntitySelectors<T, EntityState<T, T["id"]>, T["id"]>,
): DataSelectors<T> => ({
	all: baseSelectors.selectAll,
	entities: baseSelectors.selectEntities,
	ids: baseSelectors.selectIds,
	total: baseSelectors.selectTotal,
	full: (state) => getEntitySelectorsFull(state, baseSelectors),
});
