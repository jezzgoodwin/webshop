import { ApiMap } from './contracts';

type IMap = { [key: string]: { "query": {} | null, "result": {} | null } };
type PluckQuery<TMap extends IMap, TName extends keyof TMap> = TMap[TName]["query"];
type PluckResult<TMap extends IMap, TName extends keyof TMap> = TMap[TName]["result"];

export default async function callApi<TName extends keyof ApiMap>(name: TName, query: PluckQuery<ApiMap, TName>): Promise<PluckResult<ApiMap, TName>> {

    var data = new FormData();
    data.append("name", name);
    data.append("json", JSON.stringify(query));

    var result = await fetch("/api/call", {
        method: "POST",
        body: data,
        credentials: 'same-origin'
    })
    .then(response => response.json());

    return result;

}
