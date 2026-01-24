import type { EntitySelectorsData } from "../../../types.ts";
import { useStateEntity } from "../../useState.ts";

type User = { id: string; name: string };

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;

export const useStateEntityTests = () => {
	const [dataNoArgs] = useStateEntity<User>();
	type _NoArgs = Expect<Equal<typeof dataNoArgs, User[]>>;

	const [dataInitialOnly] = useStateEntity<User>([]);
	type _InitialOnly = Expect<Equal<typeof dataInitialOnly, User[]>>;

	const [dataTotal] = useStateEntity<User>([], "total");
	type _Total = Expect<Equal<typeof dataTotal, number>>;

	const [dataAll] = useStateEntity<User>([], "all");
	type _All = Expect<Equal<typeof dataAll, User[]>>;

	const [dataIds] = useStateEntity<User>([], "ids");
	type _Ids = Expect<Equal<typeof dataIds, string[]>>;

	const [dataFullExplicit] = useStateEntity<User>([], "full");
	type _FullExplicit = Expect<Equal<typeof dataFullExplicit, EntitySelectorsData<User, User["id"]>>>;

	const [dataInferred] = useStateEntity([] as User[], "full");
	type _Inferred = Expect<Equal<typeof dataInferred, EntitySelectorsData<User, User["id"]>>>;

	// @ts-expect-error - invalid selector key
	useStateEntity<User>([], "missing");
};
