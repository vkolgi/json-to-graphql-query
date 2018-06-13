class VariableType {
    constructor(public value: string) {}

    toJSON() {
        return `$${this.value}`;
    }
}

export {VariableType};
