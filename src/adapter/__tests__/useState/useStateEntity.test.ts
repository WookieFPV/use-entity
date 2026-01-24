import { describe, expect, test } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useStateEntity } from "../../useState.ts";

type TestEntity = { id: string; name: string };

describe("useStateEntity", () => {
	test("initializes with an empty state", () => {
		const { result } = renderHook(() => useStateEntity<TestEntity>(undefined, "full"));
		const [state] = result.current;

		expect(state.all).toEqual([]);
		expect(state.ids).toEqual([]);
		expect(state.entities).toEqual({});
		expect(state.total).toBe(0);
		expect(state.byId("missing")).toBeUndefined();
	});

	test("initializes with array data", () => {
		const initial: TestEntity[] = [
			{ id: "1", name: "Alpha" },
			{ id: "2", name: "Beta" },
		];
		const { result } = renderHook(() => useStateEntity<TestEntity>(initial, "full"));
		const [state] = result.current;

		expect(state.all).toEqual(initial);
		expect(state.ids).toEqual(["1", "2"]);
		expect(state.byId("2")).toEqual({ id: "2", name: "Beta" });
	});

	test("initializes with record data", () => {
		const initial: Record<string, TestEntity> = {
			"1": { id: "1", name: "Alpha" },
			"2": { id: "2", name: "Beta" },
		};
		const { result } = renderHook(() => useStateEntity<TestEntity>(initial, "full"));
		const [state] = result.current;

		expect(state.entities).toEqual(initial);
		expect(state.all).toEqual([
			{ id: "1", name: "Alpha" },
			{ id: "2", name: "Beta" },
		]);
	});

	test("initializes from a function once", () => {
		let calls = 0;
		const initial = () => {
			calls += 1;
			return [{ id: "1", name: "Alpha" }];
		};
		const { result } = renderHook(() => useStateEntity<TestEntity>(initial, "full"));

		expect(calls).toBe(1);
		expect(result.current[0].all).toEqual([{ id: "1", name: "Alpha" }]);

		act(() => {
			result.current[1].addOne({ id: "2", name: "Beta" });
		});

		expect(calls).toBe(1);
	});

	test("supports add/remove actions", () => {
		const { result } = renderHook(() => useStateEntity<TestEntity>());
		const [, actions] = result.current;

		act(() => {
			actions.addOne({ id: "1", name: "Alpha" });
			actions.addMany([
				{ id: "2", name: "Beta" },
				{ id: "3", name: "Gamma" },
			]);
		});

		expect(result.current[0]).toHaveLength(3);
		expect([...result.current[0]]).toEqual([
			{ id: "1", name: "Alpha" },
			{ id: "2", name: "Beta" },
			{ id: "3", name: "Gamma" },
		]);

		act(() => {
			actions.removeOne("2");
			actions.removeMany(["1", "3"]);
		});

		expect(result.current[0]).toEqual([]);

		act(() => {
			actions.addOne({ id: "4", name: "Delta" });
			actions.removeAll();
		});

		expect(result.current[0]).toEqual([]);
	});

	test("supports update and upsert actions", () => {
		const { result } = renderHook(() => useStateEntity<TestEntity>([{ id: "1", name: "Alpha" }], "full"));
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

	test("supports set actions", () => {
		const { result } = renderHook(() => useStateEntity<TestEntity>());
		const [, actions] = result.current;

		act(() => {
			actions.setOne({ id: "1", name: "Alpha" });
			actions.setMany([
				{ id: "2", name: "Beta" },
				{ id: "3", name: "Gamma" },
			]);
		});

		expect(result.current[0].length).toBe(3);
		expect(result.current[0]).toEqual([
			{ id: "1", name: "Alpha" },
			{ id: "2", name: "Beta" },
			{ id: "3", name: "Gamma" },
		]);

		act(() => {
			actions.setAll([{ id: "4", name: "Delta" }]);
		});

		expect(result.current[0]).toEqual([{ id: "4", name: "Delta" }]);
		expect(result.current[0].length).toBe(1);
	});

	test("keeps actions stable between renders", () => {
		const { result, rerender } = renderHook(() => useStateEntity<TestEntity>([{ id: "1", name: "Alpha" }]));
		const actions = result.current[1];

		rerender();

		expect(result.current[1]).toBe(actions);
	});
});
