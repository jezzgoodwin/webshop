
type IActionType<TActionMap> = keyof TActionMap;
type IActionPayload<TActionMap, K extends IActionType<TActionMap>> = TActionMap[K];

type ReducerCases<TState, TActionMap> = Partial<{
    [T in IActionType<TActionMap>]: (
        state: TState,
        action: IActionPayload<TActionMap, T>,
        check: (object: TState) => TState
    ) => TState;
}>;

type Combine<T> = {
    [P in keyof T]: T[P];
}

type PluckAction<TActionMap, K extends IActionType<TActionMap>> = Readonly<Combine<{ type: K } & IActionPayload<TActionMap, K>>>;

type FlattenActionMap<TActionMap> = {
    [P in IActionType<TActionMap>]: PluckAction<TActionMap, P>
}[IActionType<TActionMap>];
