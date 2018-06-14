import { EnumType } from './types/EnumType';
import { VariableType } from './types/VariableType';

export const configFields = ['__args', '__alias', '__variables', '__directives'];

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

function buildDirectives(dirsObj: any): string {
    const directiveName = Object.keys(dirsObj)[0];
    const directiveValue = dirsObj[directiveName];
    if (typeof directiveValue === 'boolean') {
        return directiveName;
    }
    else if (typeof directiveValue === 'object') {
        const args = [];
        for (const argName in directiveValue) {
            const argVal = stringify(directiveValue[argName]).replace(/"/g, '');
            args.push(`${argName}: ${argVal}`);
        }
        return `${directiveName}(${args.join(', ')})`;
    }
    else {
        throw new Error(`Unsupported type for directive: ${typeof directiveValue}. Types allowed: object, boolean.\n` +
        `Offending object: ${JSON.stringify(dirsObj)}`);
    }
}

function getIndent(level: number): string {
    return Array((level * 4) + 1).join(' ');
}

function filterNonConfigFields(fieldName: string, ignoreFields: string[]) {
    // Returns true if fieldName is not a 'configField'.
    return configFields.indexOf(fieldName) == -1 && ignoreFields.indexOf(fieldName) == -1;
}

function convertQuery(node: any, level: number, output: Array<[ string, number ]>, options: IJsonToGraphQLOptions) {
    Object.keys(node)
        .filter((key) => filterNonConfigFields(key, options.ignoreFields))
        .forEach((key) => {
        if (typeof node[key] === 'object') {
            const fieldCount = Object.keys(node[key])
                .filter((keyCount) => filterNonConfigFields(keyCount, options.ignoreFields)).length;
            const subFields = fieldCount > 0;
            const argsExist = typeof node[key].__args === 'object';
            const directivesExist = typeof node[key].__directives === 'object';
            let token: string;
            if (typeof node[key].__variables === 'object') {
                token = `${key} (${buildVariables(node[key].__variables)})`;
            }
            else if (argsExist || directivesExist) {
                let argsStr: string;
                let dirsStr: string;
                if (directivesExist) {
                    // TODO: Add support for multiple directives on one node. Then condense blocks into terniary lines.
                    // const directives = Object.keys(node[key].__directives);
                    const numDirectives = Object.keys(node[key].__directives).length;
                    if (numDirectives > 1) {
                        throw new Error(`Too many directives. The object/key ` +
                        `'${Object.keys(node[key])[0]}' had ${numDirectives} directives, ` +
                        `but only 1 directive per object/key is supported at this time.`);
                    }
                    // directives.map(((x) => { dirsStr += ` @${buildDirectives(node[key].__directives)}`; }));
                    dirsStr = `@${buildDirectives(node[key].__directives)}`;
                }
                if (argsExist) {
                    argsStr = `(${buildArgs(node[key].__args)})`;
                }
                const spacer = directivesExist && argsExist ? ' ' : '';
                token = `${key} ${dirsStr ? dirsStr : ''}${spacer}${argsStr ? argsStr : ''}`;
            }
            else {
                token = `${key}`;
            }

            if (typeof node[key].__alias === 'string') {
                token = `${node[key].__alias}: ${token}`;
            }

            output.push([ token + (fieldCount > 0 ? ' {' : ''), level ]);
            convertQuery(node[key], level + 1, output, options);

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
    ignoreFields?: string[];
}

export function jsonToGraphQLQuery(query: any, options: IJsonToGraphQLOptions = {}) {
    if (!query || typeof query != 'object') {
        throw new Error('query object not specified');
    }
    if (Object.keys(query).length == 0) {
        throw new Error('query object has no data');
    }
    if (!(options.ignoreFields instanceof Array)) {
        options.ignoreFields = [];
    }

    const queryLines: Array<[string, number]> = [];
    convertQuery(query, 0, queryLines, options);

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
