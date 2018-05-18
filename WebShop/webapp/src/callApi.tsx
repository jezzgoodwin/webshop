import { ApiMap } from './contracts';

type IMap = { [key: string]: { "query": {} | null, "result": {} | null } };
type PluckQuery<TMap extends IMap, TName extends keyof TMap> = TMap[TName]["query"];
type PluckResult<TMap extends IMap, TName extends keyof TMap> = TMap[TName]["result"];

export default async function callApi<TName extends keyof ApiMap>(name: TName, query: PluckQuery<ApiMap, TName>): Promise<PluckResult<ApiMap, TName>> {

    const params: string[] = [];
    params.push("name=" + encodeURIComponent(name));
    params.push("json=" + encodeURIComponent(JSON.stringify(query)));

    var result = await fetch("/api/call?" + params.join("&"), { credentials: 'same-origin' })
        .then(response => response.json());

    return result;

}
