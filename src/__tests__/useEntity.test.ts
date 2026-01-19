import { describe, expect, test } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { createEntityStore } from "../useEntity.ts";

type TestEntity = { id: string; name: string };

describe("useEntity", () => {
	test("exposes selectors for the initial state", () => {
		const initial: TestEntity[] = [
			{ id: "1", name: "Alpha" },
			{ id: "2", name: "Beta" },
		];
		const { useTanstackEntity } = createEntityStore<TestEntity>(initial);

		const { result } = renderHook(() => useTanstackEntity());

		expect(result.current[0].all).toEqual(initial);
		expect(result.current[0].ids).toEqual(["1", "2"]);
		expect(result.current[0].byId("2")).toEqual({
			id: "2",
			name: "Beta",
		});
	});

	test("supports add and remove operations", () => {
		const { useTanstackEntity } = createEntityStore<TestEntity>();
		const { result } = renderHook(() => useTanstackEntity());
		const [, actions] = result.current;

		act(() => {
			actions.addOne({ id: "1", name: "Alpha" });
			actions.addMany([
				{ id: "2", name: "Beta" },
				{ id: "3", name: "Gamma" },
			]);
		});

		expect(result.current[0].all).toHaveLength(3);
		expect([...result.current[0].ids].sort()).toEqual(["1", "2", "3"]);

		act(() => {
			actions.removeOne("2");
			actions.removeMany(["1", "3"]);
		});

		expect(result.current[0].all).toEqual([]);

		act(() => {
			actions.addOne({ id: "4", name: "Delta" });
			actions.removeAll();
		});

		expect(result.current[0].all).toEqual([]);
	});

	test("supports update and upsert operations", () => {
		const { useTanstackEntity } = createEntityStore<TestEntity>([
			{ id: "1", name: "Alpha" },
		]);
		const { result } = renderHook(() => useTanstackEntity());
		const [, actions] = result.current;

		act(() => {
			actions.updateOne({ id: "1", changes: { name: "Alpha+" } });
		});

		expect(result.current[0].byId("1")).toEqual({
			id: "1",
			name: "Alpha+",
		});

		act(() => {
			actions.upsertOne({ id: "2", name: "Beta" });
			actions.updateMany([
				{ id: "1", changes: { name: "Alpha++" } },
				{ id: "2", changes: { name: "Beta+" } },
			]);
			actions.upsertMany({
				"2": { id: "2", name: "Beta++" },
				"3": { id: "3", name: "Gamma" },
			});
		});

		expect(result.current[0].byId("1")).toEqual({
			id: "1",
			name: "Alpha++",
		});
		expect(result.current[0].byId("2")).toEqual({
			id: "2",
			name: "Beta++",
		});
		expect(result.current[0].byId("3")).toEqual({
			id: "3",
			name: "Gamma",
		});
	});

	test("supports set operations and total/entities selectors", () => {
		const { useTanstackEntity } = createEntityStore<TestEntity>();
		const { result } = renderHook(() => useTanstackEntity());
		const [, actions] = result.current;

		act(() => {
			actions.setOne({ id: "1", name: "Alpha" });
			actions.setMany([
				{ id: "2", name: "Beta" },
				{ id: "3", name: "Gamma" },
			]);
		});

		expect(result.current[0].total).toBe(3);
		expect(result.current[0].entities).toEqual({
			"1": { id: "1", name: "Alpha" },
			"2": { id: "2", name: "Beta" },
			"3": { id: "3", name: "Gamma" },
		});

		act(() => {
			actions.setAll([{ id: "4", name: "Delta" }]);
		});

		expect(result.current[0].all).toEqual([{ id: "4", name: "Delta" }]);
		expect(result.current[0].total).toBe(1);
	});

	test("returns undefined for missing entities", () => {
		const { useTanstackEntity } = createEntityStore<TestEntity>();
		const { result } = renderHook(() => useTanstackEntity());

		expect(result.current[0].byId("missing")).toBeUndefined();
	});

	test("ignores remove/update of missing entities", () => {
		const { useTanstackEntity } = createEntityStore<TestEntity>([
			{ id: "1", name: "Alpha" },
		]);
		const { result } = renderHook(() => useTanstackEntity());
		const [, actions] = result.current;

		act(() => {
			actions.removeOne("missing");
			actions.removeMany(["missing-a", "missing-b"]);
			actions.updateOne({ id: "missing", changes: { name: "Nope" } });
			actions.updateMany([{ id: "missing-2", changes: { name: "Nope 2" } }]);
		});

		expect(result.current[0].all).toEqual([{ id: "1", name: "Alpha" }]);
	});

	test("keeps selectors in sync after multiple operations", () => {
		const { useTanstackEntity } = createEntityStore<TestEntity>();
		const { result } = renderHook(() => useTanstackEntity());
		const [, actions] = result.current;

		act(() => {
			actions.addMany([
				{ id: "1", name: "Alpha" },
				{ id: "2", name: "Beta" },
			]);
			actions.removeOne("1");
			actions.upsertOne({ id: "2", name: "Beta+" });
			actions.upsertMany({
				"3": { id: "3", name: "Gamma" },
				"4": { id: "4", name: "Delta" },
			});
		});

		expect([...result.current[0].ids].sort()).toEqual(["2", "3", "4"]);
		expect(result.current[0].byId("2")).toEqual({
			id: "2",
			name: "Beta+",
		});
	});
});
