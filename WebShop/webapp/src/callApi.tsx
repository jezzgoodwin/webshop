
type ApiMap = {
    "Account/IsLoggedIn": {
        query: {
        },
        result: {
            success: boolean;
        }
    },
    "Account/Login": {
        query: {
            Username: string,
            Password: string
        },
        result: {
            success: boolean;
        }
    },
    "Account/Logout": {
        query: {
        },
        result: {
            success: boolean;
        }
    }
}


type IMap = { [key: string]: { "query": {}, "result": {} } };
type PluckQuery<TMap extends IMap, TName extends keyof TMap> = Readonly<TMap[TName]["query"]>;
type PluckResult<TMap extends IMap, TName extends keyof TMap> = Readonly<TMap[TName]["result"]>;

export default function callApi<TName extends keyof ApiMap>(name: TName, query: PluckQuery<ApiMap, TName>, callback: (result: PluckResult<ApiMap, TName>) => void) {

    const params: string[] = [];
    for (var key in query) {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(query[key] as any));
    }

    fetch("/" + name + "?" + params.join("&"), { credentials: 'same-origin' })
        .then(response => response.json())
        .then(json => callback(json));
}
