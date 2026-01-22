import type { EntityId, Update } from "@reduxjs/toolkit";
import type { UncheckedIndexedAccess } from "./utils/uncheckedindexed.ts";

export interface EntityStateAdapter<T, Id extends EntityId> {
	addOne(entity: T): void;

	addMany(entities: readonly T[] | Record<Id, T>): void;

	setOne(entity: T): void;

	setMany(entities: readonly T[] | Record<Id, T>): void;

	setAll(entities: readonly T[] | Record<Id, T>): void;

	removeOne(key: Id): void;

	removeMany(keys: readonly Id[]): void;

	removeAll(): void;

	updateOne(update: Update<T, Id>): void;

	updateMany(updates: ReadonlyArray<Update<T, Id>>): void;

	upsertOne(entity: T): void;

	upsertMany(entities: readonly T[] | Record<Id, T>): void;
}

export type IdItem = { id: string };

type Id<T> = {
	[K in keyof T]: T[K];
} & {};

export interface EntitySelectors<T, IdType extends EntityId> {
	selectIds: () => IdType[];
	selectEntities: () => Record<IdType, T>;
	selectAll: () => T[];
	selectTotal: () => number;
	selectById: (id: IdType) => Id<UncheckedIndexedAccess<T>>;
}

export interface EntitySelectorsData<T, IdType extends EntityId> {
	ids: IdType[];
	entities: Record<IdType, T>;
	all: T[];
	total: number;
	byId: (id: IdType) => Id<UncheckedIndexedAccess<T>>;
}
