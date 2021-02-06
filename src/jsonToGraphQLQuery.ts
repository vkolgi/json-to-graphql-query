import { EnumType } from './types/EnumType';
import { VariableType } from './types/VariableType';

export const configFields = [
    '__args', '__alias', '__aliasFor', '__variables', '__directives', '__on', '__all_on', '__typeName'
];

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

function convertQuery(node: any, level: number, output: [string, number][], options: IJsonToGraphQLOptions) {
    Object.keys(node)
        .filter((key) => filterNonConfigFields(key, options.ignoreFields!))
        .forEach((key) => {
            let value = node[key];
            if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    value = value.find((item) => item && typeof item === 'object');
                    if (!value) {
                        output.push([`${key}`, level]);
                        return;
                    }
                }

                const fieldCount = Object.keys(value)
                    .filter((keyCount) => filterNonConfigFields(keyCount, options.ignoreFields!)).length;
                const subFields = fieldCount > 0;
                const argsExist = typeof value.__args === 'object' && Object.keys(value.__args).length > 0;
                const directivesExist = typeof value.__directives === 'object';
                const fullFragmentsExist = value.__all_on instanceof Array;
                const partialFragmentsExist = typeof value.__on === 'object';

                let token = `${key}`;

                if (typeof value.__aliasFor === 'string') {
                    token = `${token}: ${value.__aliasFor}`;
                }

                if (typeof value.__variables === 'object') {
                    token = `${token} (${buildVariables(value.__variables)})`;
                }
                else if (argsExist || directivesExist) {
                    let argsStr = '';
                    let dirsStr = '';
                    if (directivesExist) {
                        // TODO: Add support for multiple directives on one node.
                        const numDirectives = Object.keys(value.__directives).length;
                        if (numDirectives > 1) {
                            throw new Error(`Too many directives. The object/key ` +
                                `'${Object.keys(value)[0]}' had ${numDirectives} directives, ` +
                                `but only 1 directive per object/key is supported at this time.`);
                        }
                        dirsStr = `@${buildDirectives(value.__directives)}`;
                    }
                    if (argsExist) {
                        argsStr = `(${buildArgs(value.__args)})`;
                    }
                    const spacer = directivesExist && argsExist ? ' ' : '';
                    token = `${token} ${dirsStr}${spacer}${argsStr}`;
                }

                output.push([token + (subFields || partialFragmentsExist || fullFragmentsExist ? ' {' : ''), level]);
                convertQuery(value, level + 1, output, options);

                if (fullFragmentsExist) {
                    value.__all_on.forEach((fullFragment: string) => {
                        output.push([`...${fullFragment}`, level + 1]);
                    });
                }
                if (partialFragmentsExist) {
                    const inlineFragments: { __typeName: string }[]
                        = value.__on instanceof Array ? value.__on : [value.__on];
                    inlineFragments.forEach((inlineFragment) => {
                        const name = inlineFragment.__typeName;
                        output.push([`... on ${name} {`, level + 1]);
                        convertQuery(inlineFragment, level + 2, output, options);
                        output.push(['}', level + 1]);
                    });
                }

                if (subFields || partialFragmentsExist || fullFragmentsExist) {
                    output.push(['}', level]);
                }

            } else if (options.includeFalsyKeys === true || value) {
                output.push([`${key}`, level]);
            }
        });
}

export interface IJsonToGraphQLOptions {
    pretty?: boolean;
    ignoreFields?: string[];
    includeFalsyKeys?: boolean;
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

    const queryLines: [string, number][] = [];
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
