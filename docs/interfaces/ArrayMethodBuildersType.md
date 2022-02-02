[jsonld-dataset-proxy](../README.md) / [Exports](../modules.md) / ArrayMethodBuildersType

# Interface: ArrayMethodBuildersType

## Table of contents

### Properties

- [copyWithin](ArrayMethodBuildersType.md#copywithin)
- [fill](ArrayMethodBuildersType.md#fill)
- [pop](ArrayMethodBuildersType.md#pop)
- [push](ArrayMethodBuildersType.md#push)
- [reverse](ArrayMethodBuildersType.md#reverse)
- [shift](ArrayMethodBuildersType.md#shift)
- [sort](ArrayMethodBuildersType.md#sort)
- [splice](ArrayMethodBuildersType.md#splice)
- [unshift](ArrayMethodBuildersType.md#unshift)

## Properties

### copyWithin

• **copyWithin**: [`methodBuilder`](../modules.md#methodbuilder)<(`target`: `number`, `start`: `number`, `end?`: `number`) => [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)[]\>

#### Defined in

[lib/helperFunctions/arrayMethods.ts:18](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/helperFunctions/arrayMethods.ts#L18)

___

### fill

• **fill**: [`methodBuilder`](../modules.md#methodbuilder)<(`value`: [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation), `start?`: `number`, `end?`: `number`) => [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)[]\>

#### Defined in

[lib/helperFunctions/arrayMethods.ts:19](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/helperFunctions/arrayMethods.ts#L19)

___

### pop

• **pop**: [`methodBuilder`](../modules.md#methodbuilder)<() => `undefined` \| [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)\>

#### Defined in

[lib/helperFunctions/arrayMethods.ts:20](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/helperFunctions/arrayMethods.ts#L20)

___

### push

• **push**: [`methodBuilder`](../modules.md#methodbuilder)<(...`items`: [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)[]) => `number`\>

#### Defined in

[lib/helperFunctions/arrayMethods.ts:21](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/helperFunctions/arrayMethods.ts#L21)

___

### reverse

• **reverse**: [`methodBuilder`](../modules.md#methodbuilder)<() => [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)[]\>

#### Defined in

[lib/helperFunctions/arrayMethods.ts:22](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/helperFunctions/arrayMethods.ts#L22)

___

### shift

• **shift**: [`methodBuilder`](../modules.md#methodbuilder)<() => `undefined` \| [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)\>

#### Defined in

[lib/helperFunctions/arrayMethods.ts:23](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/helperFunctions/arrayMethods.ts#L23)

___

### sort

• **sort**: [`methodBuilder`](../modules.md#methodbuilder)<(`compareFn?`: (`a`: [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation), `b`: [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)) => `number`) => [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)[]\>

#### Defined in

[lib/helperFunctions/arrayMethods.ts:24](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/helperFunctions/arrayMethods.ts#L24)

___

### splice

• **splice**: [`methodBuilder`](../modules.md#methodbuilder)<(`start`: `number`, `deleteCount?`: `number`) => [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)[](`start`: `number`, `deleteCount`: `number`, ...`items`: [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)[]) => [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)[]\>

#### Defined in

[lib/helperFunctions/arrayMethods.ts:25](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/helperFunctions/arrayMethods.ts#L25)

___

### unshift

• **unshift**: [`methodBuilder`](../modules.md#methodbuilder)<(...`items`: [`ObjectJsonRepresentation`](../modules.md#objectjsonrepresentation)[]) => `number`\>

#### Defined in

[lib/helperFunctions/arrayMethods.ts:26](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/helperFunctions/arrayMethods.ts#L26)
