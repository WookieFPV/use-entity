import { createEntityAdapter, type EntityState } from "@reduxjs/toolkit";
import { useMemo, useState } from "react";
import { getEntityActions } from "../actions.ts";
import { getSelectors, noSelect } from "../selectors.ts";
import type { IdItem } from "../types.ts";

/**
 * @example
 * const [{ all }, action] = useStateWithEntity<{ id: string; name: string }>();
 * action.addOne({ id: "1", name: "Demo" });
 */
export const useStateEntity = <T extends IdItem>(
	initialState?: T[] | Record<T["id"], T> | (() => T[] | Record<T["id"], T>),
) => {
	const [adapter] = useState(() => createEntityAdapter<T>());
	const [state, setState] = useState(() =>
		initialState
			? adapter.setAll(
					adapter.getInitialState(),
					initialState instanceof Function ? initialState() : initialState,
				)
			: adapter.getInitialState(),
	);

	const actions = useMemo(() => getEntityActions(adapter, setState), [adapter]);

	const data = useMemo(
		() => getSelectors(adapter.getSelectors<EntityState<T, T["id"]>>(noSelect)).full(state),
		[state, adapter.getSelectors],
	);

	return [data, actions] as const;
};
