import { EnumType } from './types/EnumType';
import { VariableType } from './types/VariableType';

function stringify(obj_from_json: any): string {
    if (obj_from_json instanceof EnumType) {
        return obj_from_json.value;
    }
    // variables should be prefixed with dollar sign and not quoted
    else if (obj_from_json instanceof VariableType) {
        return `$${obj_from_json.value}`;
    }
    // Cheers to Derek: https://stackoverflow.com/questions/11233498/json-stringify-without-quotes-on-properties
    else if (typeof obj_from_json !== 'object' || obj_from_json === null) {
        // not an object, stringify using native function
        return JSON.stringify(obj_from_json);
    }
    else if (Array.isArray(obj_from_json)) {
        return `[${obj_from_json.map((item) => stringify(item)).join(', ')}]`;
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

function buildVariables(varsObj: any): string {
    const args = [];
    for (const varName in varsObj) {
        args.push(`$${varName}: ${varsObj[varName]}`);
    }
    return args.join(', ');
}

function getIndent(level: number): string {
    return Array((level * 4) + 1).join(' ');
}

function filterNonConfigFields(fieldName: string) {
    return fieldName !== '__args' && fieldName !== '__alias' && fieldName !== '__variables';
}

function convertQuery(node: any, level: number, output: Array<[ string, number ]>) {
    Object.keys(node)
        .filter(filterNonConfigFields)
        .forEach((key) => {
        if (typeof node[key] === 'object') {
            const fieldCount = Object.keys(node[key]).filter(filterNonConfigFields).length;
            const subFields = fieldCount > 0;
            let token: string;

            if (typeof node[key].__args === 'object') {
                token = `${key} (${buildArgs(node[key].__args)})`;
            }
            else if (typeof node[key].__variables === 'object') {
                token = `${key} (${buildVariables(node[key].__variables)})`;
            }
            else {
                token = `${key}`;
            }

            if (typeof node[key].__alias === 'string') {
                token = `${node[key].__alias}: ${token}`;
            }

            output.push([ token + (fieldCount > 0 ? ' {' : ''), level ]);
            convertQuery(node[key], level + 1, output);

            if (subFields) {
                output.push([ '}', level ]);
            }
        } else if (node[key]) {
            output.push([ `${key}`, level ]);
        }
    });
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
