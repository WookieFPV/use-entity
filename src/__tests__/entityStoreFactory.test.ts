import { describe, expect, test } from "bun:test";
import { useStore } from "@tanstack/react-store";
import { renderHook } from "@testing-library/react";
import { act } from "react";

import { entityStoreFactory } from "../adapter/tanstack.ts";

type TestEntity = { id: string; name: string };

describe("entityStoreFactory", () => {
	test("initializes with empty state when no initial entities are provided", () => {
		const { store, selectors } = entityStoreFactory<TestEntity>();

		const full = selectors.full(store.state);

		expect(full.all).toEqual([]);
		expect(full.ids).toEqual([]);
		expect(full.entities).toEqual({});
		expect(full.total).toBe(0);
		expect(full.byId("missing")).toBeUndefined();
	});

	test("initializes with provided entities", () => {
		const initial: TestEntity[] = [
			{ id: "1", name: "Alpha" },
			{ id: "2", name: "Beta" },
		];
		const { store, selectors } = entityStoreFactory<TestEntity>(initial);

		expect(selectors.all(store.state)).toEqual(initial);
		expect(selectors.ids(store.state)).toEqual(["1", "2"]);
		expect(selectors.entities(store.state)).toEqual({
			"1": { id: "1", name: "Alpha" },
			"2": { id: "2", name: "Beta" },
		});
		expect(selectors.total(store.state)).toBe(2);
		expect(selectors.full(store.state).byId("2")).toEqual({
			id: "2",
			name: "Beta",
		});
	});

	test("supports add/remove actions", () => {
		const { store, selectors, actions } = entityStoreFactory<TestEntity>();

		actions.addOne({ id: "1", name: "Alpha" });
		actions.addMany([
			{ id: "2", name: "Beta" },
			{ id: "3", name: "Gamma" },
		]);

		expect(selectors.ids(store.state)).toEqual(["1", "2", "3"]);
		expect(selectors.total(store.state)).toBe(3);

		actions.removeOne("2");
		actions.removeMany(["1", "3"]);

		expect(selectors.all(store.state)).toEqual([]);
		expect(selectors.total(store.state)).toBe(0);
	});

	test("supports update/upsert actions", () => {
		const { store, selectors, actions } = entityStoreFactory<TestEntity>([
			{ id: "1", name: "Alpha" },
		]);

		actions.updateOne({ id: "1", changes: { name: "Alpha+" } });
		expect(selectors.full(store.state).byId("1")).toEqual({
			id: "1",
			name: "Alpha+",
		});

		actions.upsertOne({ id: "2", name: "Beta" });
		actions.updateMany([
			{ id: "1", changes: { name: "Alpha++" } },
			{ id: "2", changes: { name: "Beta+" } },
		]);
		actions.upsertMany({
			"2": { id: "2", name: "Beta++" },
			"3": { id: "3", name: "Gamma" },
		});

		expect(selectors.full(store.state).byId("1")).toEqual({
			id: "1",
			name: "Alpha++",
		});
		expect(selectors.full(store.state).byId("2")).toEqual({
			id: "2",
			name: "Beta++",
		});
		expect(selectors.full(store.state).byId("3")).toEqual({
			id: "3",
			name: "Gamma",
		});
	});

	test("supports set actions and removeAll", () => {
		const { store, selectors, actions } = entityStoreFactory<TestEntity>();

		actions.setOne({ id: "1", name: "Alpha" });
		actions.setMany([
			{ id: "2", name: "Beta" },
			{ id: "3", name: "Gamma" },
		]);

		expect(selectors.total(store.state)).toBe(3);
		expect(selectors.entities(store.state)).toEqual({
			"1": { id: "1", name: "Alpha" },
			"2": { id: "2", name: "Beta" },
			"3": { id: "3", name: "Gamma" },
		});

		actions.setAll([{ id: "4", name: "Delta" }]);
		expect(selectors.all(store.state)).toEqual([{ id: "4", name: "Delta" }]);
		expect(selectors.total(store.state)).toBe(1);

		actions.removeAll();
		expect(selectors.all(store.state)).toEqual([]);
	});

	test("useStore subscribes to full selector updates", () => {
		const { store, selectors, actions } = entityStoreFactory<TestEntity>([
			{ id: "1", name: "Alpha" },
		]);

		const { result } = renderHook(() => useStore(store, selectors.full));

		expect(result.current.all).toEqual([{ id: "1", name: "Alpha" }]);

		act(() => {
			actions.addOne({ id: "2", name: "Beta" });
		});

		expect(result.current.all).toEqual([
			{ id: "1", name: "Alpha" },
			{ id: "2", name: "Beta" },
		]);
		expect(result.current.byId("2")).toEqual({ id: "2", name: "Beta" });
	});

	test("useStore works with all selectors", () => {
		const { store, selectors, actions } = entityStoreFactory<TestEntity>();

		const idsHook = renderHook(() => useStore(store, selectors.ids));
		const allHook = renderHook(() => useStore(store, selectors.all));
		const entitiesHook = renderHook(() => useStore(store, selectors.entities));
		const totalHook = renderHook(() => useStore(store, selectors.total));
		const fullHook = renderHook(() => useStore(store, selectors.full));

		expect(idsHook.result.current).toEqual([]);
		expect(allHook.result.current).toEqual([]);
		expect(entitiesHook.result.current).toEqual({});
		expect(totalHook.result.current).toBe(0);
		expect(fullHook.result.current.all).toEqual([]);

		act(() => {
			actions.addMany([
				{ id: "1", name: "Alpha" },
				{ id: "2", name: "Beta" },
			]);
		});

		expect(idsHook.result.current).toEqual(["1", "2"]);
		expect(allHook.result.current).toEqual([
			{ id: "1", name: "Alpha" },
			{ id: "2", name: "Beta" },
		]);
		expect(entitiesHook.result.current).toEqual({
			"1": { id: "1", name: "Alpha" },
			"2": { id: "2", name: "Beta" },
		});
		expect(totalHook.result.current).toBe(2);
		expect(fullHook.result.current.byId("2")).toEqual({
			id: "2",
			name: "Beta",
		});

		act(() => {
			actions.removeOne("1");
		});

		expect(idsHook.result.current).toEqual(["2"]);
		expect(allHook.result.current).toEqual([{ id: "2", name: "Beta" }]);
		expect(entitiesHook.result.current).toEqual({
			"2": { id: "2", name: "Beta" },
		});
		expect(totalHook.result.current).toBe(1);
	});
});
