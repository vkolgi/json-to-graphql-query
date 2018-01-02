
function buildArgs(argsObj: any): string {
    const args = [];
    for (const argName in argsObj) {
        args.push(`${argName}: ${JSON.stringify(argsObj[argName])}`);
    }
    return args.join(', ');
}

function getIndent(level: number): string {
    return Array((level * 4) + 1).join(' ');
}

function convertQuery(node: any, level: number, output: Array<[string, number]>) {
    for (const key in node) {
        if (key != '__args') {
            if (typeof node[key] == 'object') {
                if (typeof node[key].__args == 'object') {
                    output.push([`${key} (${buildArgs(node[key].__args)}) {`, level]);
                }
                else {
                    output.push([`${key} {`, level]);
                }
                convertQuery(node[key], level + 1, output);
                output.push(['}', level]);
            }
            else {
                output.push([`${key}`, level]);
            }
        }
    }
}

export interface IJsonToGraphQLOptions {
    pretty?: boolean;
}

export function jsonToGraphQL(query: any, options: IJsonToGraphQLOptions = {}) {
    if (!query || typeof query != 'object') {
        throw new Error('query object not specified');
    }
    if (Object.keys(query).length == 0) {
        throw new Error('query object has no data');
    }

    const queryLines: Array<[string, number]> = [];
    convertQuery(query, 0, queryLines);

    if (options.pretty) {
        let output = '';
        queryLines.forEach(([line, level]) => {
            if (output) { output += '\n'; }
            output += getIndent(level) + line;
        });
        return output;
    }
    else {
        return queryLines.join(' ');
    }
}