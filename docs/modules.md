[jsonld-dataset-proxy](README.md) / Exports

# jsonld-dataset-proxy

## Table of contents

### References

- [default](modules.md#default)

### Classes

- [ContextUtil](classes/ContextUtil.md)
- [ProxyCreator](classes/ProxyCreator.md)

### Interfaces

- [ArrayMethodBuildersType](interfaces/ArrayMethodBuildersType.md)
- [ObjectWithId](interfaces/ObjectWithId.md)

### Type Aliases

- [AddObjectItem](modules.md#addobjectitem)
- [AddObjectValue](modules.md#addobjectvalue)
- [ArrayProxyTarget](modules.md#arrayproxytarget)
- [JsonldDatasetProxy](modules.md#jsonlddatasetproxy)
- [ObjectJsonRepresentation](modules.md#objectjsonrepresentation)
- [QuadMatch](modules.md#quadmatch)
- [methodBuilder](modules.md#methodbuilder)

### Variables

- [arrayMethodsBuilders](modules.md#arraymethodsbuilders)
- [getUnderlyingNode](modules.md#getunderlyingnode)
- [methodNames](modules.md#methodnames)

### Functions

- [addObjectToDataset](modules.md#addobjecttodataset)
- [addObjectValueToDataset](modules.md#addobjectvaluetodataset)
- [createArrayHandler](modules.md#createarrayhandler)
- [createSubjectHander](modules.md#createsubjecthander)
- [deleteValueFromDataset](modules.md#deletevaluefromdataset)
- [getProxyFromDataset](modules.md#getproxyfromdataset)
- [jsonldDatasetProxy](modules.md#jsonlddatasetproxy-1)
- [objectToJsonldRepresentation](modules.md#objecttojsonldrepresentation)
- [replaceArray](modules.md#replacearray)

## References

### default

Renames and re-exports [jsonldDatasetProxy](modules.md#jsonlddatasetproxy-1)

## Type Aliases

### AddObjectItem

Ƭ **AddObjectItem**: { `@id?`: `string` \| `NamedNode` \| `BlankNode` ; `[getUnderlyingNode]?`: `NamedNode` \| `BlankNode`  } & { `[key: string]`: [`AddObjectValue`](modules.md#addobjectvalue) \| [`AddObjectValue`](modules.md#addobjectvalue)[];  }

#### Defined in

[lib/helperFunctions/addObjectToDataset.ts:6](https://github.com/o-development/jsonld-dataset-proxy/blob/e267685/lib/helperFunctions/addObjectToDataset.ts#L6)

___

### AddObjectValue

Ƭ **AddObjectValue**: `string` \| `boolean` \| `number` \| [`AddObjectItem`](modules.md#addobjectitem)

#### Defined in

[lib/helperFunctions/addObjectToDataset.ts:13](https://github.com/o-development/jsonld-dataset-proxy/blob/e267685/lib/helperFunctions/addObjectToDataset.ts#L13)

___

### ArrayProxyTarget

Ƭ **ArrayProxyTarget**: [quadMatch: QuadMatch, curArray: ObjectJsonRepresentation[]]

#### Defined in

[lib/createArrayHandler.ts:18](https://github.com/o-development/jsonld-dataset-proxy/blob/e267685/lib/createArrayHandler.ts#L18)

___

### JsonldDatasetProxy

Ƭ **JsonldDatasetProxy**<`Type`\>: `Type` extends `Record`<`string`, `any`\> ? { [Key in keyof Type]: AugmentWithType<Type[Key]\> } & `JsonldFields` : `Type`

#### Type parameters

| Name |
| :------ |
| `Type` |

#### Defined in

[lib/jsonldDatasetProxy.ts:20](https://github.com/o-development/jsonld-dataset-proxy/blob/e267685/lib/jsonldDatasetProxy.ts#L20)

___

### ObjectJsonRepresentation

Ƭ **ObjectJsonRepresentation**: `string` \| `number` \| `boolean` \| [`ObjectWithId`](interfaces/ObjectWithId.md)

#### Defined in

[lib/helperFunctions/objectToJsonRepresentation.ts:6](https://github.com/o-development/jsonld-dataset-proxy/blob/e267685/lib/helperFunctions/objectToJsonRepresentation.ts#L6)

___

### QuadMatch

Ƭ **QuadMatch**: [subject: NamedNode \| BlankNode, predicate: NamedNode]

#### Defined in

[lib/createArrayHandler.ts:16](https://github.com/o-development/jsonld-dataset-proxy/blob/e267685/lib/createArrayHandler.ts#L16)

___

### methodBuilder

Ƭ **methodBuilder**<`Return`\>: (`target`: [`ArrayProxyTarget`](modules.md#arrayproxytarget), `dataset`: `Dataset`, `contextUtil`: [`ContextUtil`](classes/ContextUtil.md)) => `Return`

#### Type parameters

| Name |
| :------ |
| `Return` |

#### Type declaration

▸ (`target`, `dataset`, `contextUtil`): `Return`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`ArrayProxyTarget`](modules.md#arrayproxytarget) |
| `dataset` | `Dataset` |
| `contextUtil` | [`ContextUtil`](classes/ContextUtil.md) |

##### Returns

`Return`

#### Defined in

[lib/helperFunctions/arrayMethods.ts:11](https://github.com/o-development/jsonld-dataset-proxy/blob/e267685/lib/helperFunctions/arrayMethods.ts#L11)

## Variables

### arrayMethodsBuilders

• `Const` **arrayMethodsBuilders**: [`ArrayMethodBuildersType`](interfaces/ArrayMethodBuildersType.md)

#### Defined in

[lib/helperFunctions/arrayMethods.ts:56](https://github.com/o-development/jsonld-dataset-proxy/blob/e267685/lib/helperFunctions/arrayMethods.ts#L56)

___

### getUnderlyingNode

• `Const` **getUnderlyingNode**: typeof [`getUnderlyingNode`](modules.md#getunderlyingnode)

#### Defined in

[lib/createSubjectHandler.ts:13](https://github.com/o-development/jsonld-dataset-proxy/blob/e267685/lib/createSubjectHandler.ts#L13)

___

### methodNames

• `Const` **methodNames**: `Set`<keyof [`ArrayMethodBuildersType`](interfaces/ArrayMethodBuildersType.md)\>

#### Defined in

[lib/helperFunctions/arrayMethods.ts:29](https://github.com/o-development/jsonld-dataset-proxy/blob/e267685/lib/helperFunctions/arrayMethods.ts#L29)

## Functions

### addObjectToDataset

▸ **addObjectToDataset**(`item`, `dataset`, `contextUtil`, `visitedObjects`, `shouldDeleteOldTriples`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`AddObjectItem`](modules.md#addobjectitem) |
| `dataset` | `Dataset`<`Quad`, `Quad`\> |
| `contextUtil` | [`ContextUtil`](classes/ContextUtil.md) |
| `visitedObjects` | `Set`<`string`\> |
| `shouldDeleteOldTriples` | `boolean` |

#### Returns

`void`

___

### addObjectValueToDataset

▸ **addObjectValueToDataset**(`dataset`, `contextUtil`, `key`, `visitedObjects`, `subject`, `predicate`, `value`, `shouldDeleteOldTriples`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataset` | `Dataset`<`Quad`, `Quad`\> |
| `contextUtil` | [`ContextUtil`](classes/ContextUtil.md) |
| `key` | `string` |
| `visitedObjects` | `Set`<`string`\> |
| `subject` | `BlankNode` \| `NamedNode`<`string`\> |
| `predicate` | `NamedNode`<`string`\> |
| `value` | [`AddObjectValue`](modules.md#addobjectvalue) |
| `shouldDeleteOldTriples` | `boolean` |

#### Returns

`void`

___

### createArrayHandler

▸ **createArrayHandler**(`dataset`, `contextUtil`, `proxyCreator`): `ProxyHandler`<[`ArrayProxyTarget`](modules.md#arrayproxytarget)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataset` | `Dataset`<`Quad`, `Quad`\> |
| `contextUtil` | [`ContextUtil`](classes/ContextUtil.md) |
| `proxyCreator` | [`ProxyCreator`](classes/ProxyCreator.md) |

#### Returns

`ProxyHandler`<[`ArrayProxyTarget`](modules.md#arrayproxytarget)\>

___

### createSubjectHander

▸ **createSubjectHander**(`dataset`, `contextUtil`, `proxyCreator`): `ProxyHandler`<[`ObjectWithId`](interfaces/ObjectWithId.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataset` | `Dataset`<`Quad`, `Quad`\> |
| `contextUtil` | [`ContextUtil`](classes/ContextUtil.md) |
| `proxyCreator` | [`ProxyCreator`](classes/ProxyCreator.md) |

#### Returns

`ProxyHandler`<[`ObjectWithId`](interfaces/ObjectWithId.md)\>

___

### deleteValueFromDataset

▸ **deleteValueFromDataset**(`target`, `key`, `dataset`, `contextUtil`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`ObjectWithId`](interfaces/ObjectWithId.md) |
| `key` | `string` \| `symbol` |
| `dataset` | `Dataset`<`Quad`, `Quad`\> |
| `contextUtil` | [`ContextUtil`](classes/ContextUtil.md) |

#### Returns

`boolean`

___

### getProxyFromDataset

▸ **getProxyFromDataset**(`target`, `key`, `dataset`, `contextUtil`, `proxyCreator`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`ObjectWithId`](interfaces/ObjectWithId.md) |
| `key` | `string` \| `symbol` |
| `dataset` | `Dataset`<`Quad`, `Quad`\> |
| `contextUtil` | [`ContextUtil`](classes/ContextUtil.md) |
| `proxyCreator` | [`ProxyCreator`](classes/ProxyCreator.md) |

#### Returns

`any`

___

### jsonldDatasetProxy

▸ **jsonldDatasetProxy**<`Type`\>(`inputDataset`, `context`, `entryNode`): `Type`

#### Type parameters

| Name |
| :------ |
| `Type` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputDataset` | `Dataset`<`Quad`, `Quad`\> |
| `context` | `ContextDefinition` |
| `entryNode` | `BlankNode` \| `NamedNode`<`string`\> |

#### Returns

`Type`

___

### objectToJsonldRepresentation

▸ **objectToJsonldRepresentation**(`quad`, `dataset`, `contextUtil`, `proxyCreator`): [`ObjectJsonRepresentation`](modules.md#objectjsonrepresentation)

#### Parameters

| Name | Type |
| :------ | :------ |
| `quad` | `Quad` |
| `dataset` | `Dataset`<`Quad`, `Quad`\> |
| `contextUtil` | [`ContextUtil`](classes/ContextUtil.md) |
| `proxyCreator` | [`ProxyCreator`](classes/ProxyCreator.md) |

#### Returns

[`ObjectJsonRepresentation`](modules.md#objectjsonrepresentation)

___

### replaceArray

▸ **replaceArray**(`target`, `replacement`, `dataset`, `contextUtil`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`ArrayProxyTarget`](modules.md#arrayproxytarget) |
| `replacement` | [`AddObjectValue`](modules.md#addobjectvalue)[] |
| `dataset` | `Dataset`<`Quad`, `Quad`\> |
| `contextUtil` | [`ContextUtil`](classes/ContextUtil.md) |

#### Returns

`void`
