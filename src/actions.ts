import type { EntityAdapter, EntityState } from "@reduxjs/toolkit";
import type { EntityStateAdapter, IdItem } from "./types.ts";

export const getEntityActions = <T extends IdItem>(
	adapter: EntityAdapter<T, T["id"]>,
	setState: (updater: (prev: EntityState<T, T["id"]>) => EntityState<T, T["id"]>) => void,
): EntityStateAdapter<T, T["id"]> => ({
	setOne: (entity) => setState((prev) => adapter.setOne(prev, entity)),
	setMany: (entities) => setState((prev) => adapter.setMany(prev, entities)),
	setAll: (entities) => setState((prev) => adapter.setAll(prev, entities)),

	addOne: (entity) => setState((prev) => adapter.addOne(prev, entity)),
	addMany: (entities) => setState((prev) => adapter.addMany(prev, entities)),

	removeOne: (entityId) => setState((prev) => adapter.removeOne(prev, entityId)),
	removeMany: (entityIds) => setState((prev) => adapter.removeMany(prev, entityIds)),
	removeAll: () => setState((prev) => adapter.removeAll(prev)),

	updateOne: (update) => setState((prev) => adapter.updateOne(prev, update)),
	updateMany: (updates) => setState((prev) => adapter.updateMany(prev, updates)),

	upsertOne: (entity) => setState((prev) => adapter.upsertOne(prev, entity)),
	upsertMany: (entities) => setState((prev) => adapter.upsertMany(prev, entities)),
});
