
function stringify(obj_from_json: any) {
    // Cheers to Derek: https://stackoverflow.com/questions/11233498/json-stringify-without-quotes-on-properties
    if (typeof obj_from_json !== 'object' || Array.isArray(obj_from_json)) {
        // not an object, stringify using native function
        return JSON.stringify(obj_from_json);
    }
    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    const props: string = Object
        .keys(obj_from_json)
        .map((key) => `${key}: ${stringify(obj_from_json[key])}`)
        .join(', ');
    return `{${props}}`;
}

function buildArgs(argsObj: any): string {
    const args = [];
    for (const argName in argsObj) {
        args.push(`${argName}: ${stringify(argsObj[argName])}`);
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
                const fieldCount = Object.keys(node[key]).length;
                let token: string;
                let subFields: boolean;
                if (typeof node[key].__args == 'object') {
                    token = `${key} (${buildArgs(node[key].__args)})`;
                    subFields = fieldCount > 1;
                }
                else {
                    token = `${key}`;
                    subFields = fieldCount > 0;
                }
                output.push([token + (subFields ? ' {' : ''), level]);
                convertQuery(node[key], level + 1, output);
                if (subFields) {
                    output.push(['}', level]);
                }
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

export function jsonToGraphQLQuery(query: any, options: IJsonToGraphQLOptions = {}) {
    if (!query || typeof query != 'object') {
        throw new Error('query object not specified');
    }
    if (Object.keys(query).length == 0) {
        throw new Error('query object has no data');
    }

    const queryLines: Array<[string, number]> = [];
    convertQuery(query, 0, queryLines);

    let output = '';
    queryLines.forEach(([line, level]) => {
        if (options.pretty) {
            if (output) { output += '\n'; }
            output += getIndent(level) + line;
        }
        else {
            if (output) { output += ' '; }
            output += line;
        }
    });
    return output;
}