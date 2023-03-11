[jsonld-dataset-proxy](README.md) / Exports

# jsonld-dataset-proxy

## Table of contents

### References

- [default](modules.md#default)

### Classes

- [ContextUtil](classes/ContextUtil.md)
- [JsonldDatasetProxyBuilder](classes/JsonldDatasetProxyBuilder.md)
- [NodeSet](classes/NodeSet.md)
- [ProxyContext](classes/ProxyContext.md)

### Interfaces

- [ArrayMethodBuildersType](interfaces/ArrayMethodBuildersType.md)
- [InteractOptions](interfaces/InteractOptions.md)
- [SubjectProxyTarget](interfaces/SubjectProxyTarget.md)

### Type Aliases

- [ArrayProxy](modules.md#arrayproxy)
- [ArrayProxyTarget](modules.md#arrayproxytarget)
- [GraphType](modules.md#graphtype)
- [ObjectJsonRepresentation](modules.md#objectjsonrepresentation)
- [ObjectLike](modules.md#objectlike)
- [ObjectType](modules.md#objecttype)
- [PredicateType](modules.md#predicatetype)
- [QuadMatch](modules.md#quadmatch)
- [RawObject](modules.md#rawobject)
- [RawValue](modules.md#rawvalue)
- [SubjectProxy](modules.md#subjectproxy)
- [SubjectType](modules.md#subjecttype)
- [methodBuilder](modules.md#methodbuilder)

### Variables

- [\_getNodeAtIndex](modules.md#_getnodeatindex)
- [\_getUnderlyingArrayTarget](modules.md#_getunderlyingarraytarget)
- [\_getUnderlyingDataset](modules.md#_getunderlyingdataset)
- [\_getUnderlyingMatch](modules.md#_getunderlyingmatch)
- [\_getUnderlyingNode](modules.md#_getunderlyingnode)
- [\_isSubjectOriented](modules.md#_issubjectoriented)
- [\_proxyContext](modules.md#_proxycontext)
- [\_writeGraphs](modules.md#_writegraphs)
- [arrayMethodsBuilders](modules.md#arraymethodsbuilders)
- [methodNames](modules.md#methodnames)

### Functions

- [addObjectToDataset](modules.md#addobjecttodataset)
- [addRawObjectToDatasetRecursive](modules.md#addrawobjecttodatasetrecursive)
- [addRawValueToDatasetRecursive](modules.md#addrawvaluetodatasetrecursive)
- [checkArrayModification](modules.md#checkarraymodification)
- [createArrayHandler](modules.md#createarrayhandler)
- [createSubjectHander](modules.md#createsubjecthander)
- [deleteValueFromDataset](modules.md#deletevaluefromdataset)
- [getNodeFromRawObject](modules.md#getnodefromrawobject)
- [getNodeFromRawValue](modules.md#getnodefromrawvalue)
- [getProxyFromObject](modules.md#getproxyfromobject)
- [getSubjectProxyFromObject](modules.md#getsubjectproxyfromobject)
- [getValueForKey](modules.md#getvalueforkey)
- [graphOf](modules.md#graphof)
- [isArrayProxy](modules.md#isarrayproxy)
- [isProxy](modules.md#isproxy)
- [isSubjectProxy](modules.md#issubjectproxy)
- [jsonldDatasetProxy](modules.md#jsonlddatasetproxy)
- [literalToJsonldRepresentation](modules.md#literaltojsonldrepresentation)
- [modifyArray](modules.md#modifyarray)
- [nodeToJsonldRepresentation](modules.md#nodetojsonldrepresentation)
- [nodeToString](modules.md#nodetostring)
- [write](modules.md#write)

## References

### default

Renames and re-exports [jsonldDatasetProxy](modules.md#jsonlddatasetproxy)

## Type Aliases

### ArrayProxy

Ƭ **ArrayProxy**: `unknown`[] & { `[_getNodeAtIndex]`: (`index`: `number`) => [`ObjectType`](modules.md#objecttype) \| `undefined` ; `[_getUnderlyingArrayTarget]`: [`ArrayProxyTarget`](modules.md#arrayproxytarget) ; `[_getUnderlyingDataset]`: `Dataset` ; `[_getUnderlyingMatch]`: [`ArrayProxyTarget`](modules.md#arrayproxytarget)[``0``] ; `[_proxyContext]`: [`ProxyContext`](classes/ProxyContext.md)  }

#### Defined in

[lib/arrayProxy/ArrayProxy.ts:14](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/arrayProxy/ArrayProxy.ts#L14)

___

### ArrayProxyTarget

Ƭ **ArrayProxyTarget**: [quadMatch: QuadMatch, curArray: ObjectType[], isSubjectOriented?: boolean]

#### Defined in

[lib/arrayProxy/createArrayHandler.ts:27](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/arrayProxy/createArrayHandler.ts#L27)

___

### GraphType

Ƭ **GraphType**: `NamedNode` \| `BlankNode` \| `DefaultGraph`

#### Defined in

[lib/types.ts:18](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L18)

___

### ObjectJsonRepresentation

Ƭ **ObjectJsonRepresentation**: `string` \| `number` \| `boolean` \| [`SubjectProxy`](modules.md#subjectproxy)

#### Defined in

[lib/util/nodeToJsonldRepresentation.ts:5](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/util/nodeToJsonldRepresentation.ts#L5)

___

### ObjectLike

Ƭ **ObjectLike**: `Record`<`string` \| `number` \| `symbol`, `any`\>

#### Defined in

[lib/types.ts:13](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L13)

___

### ObjectType

Ƭ **ObjectType**: `NamedNode` \| `BlankNode` \| `Literal`

#### Defined in

[lib/types.ts:17](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L17)

___

### PredicateType

Ƭ **PredicateType**: `NamedNode`

#### Defined in

[lib/types.ts:16](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L16)

___

### QuadMatch

Ƭ **QuadMatch**: [[`SubjectType`](modules.md#subjecttype) \| `undefined` \| ``null``, [`PredicateType`](modules.md#predicatetype) \| `undefined` \| ``null``, [`ObjectType`](modules.md#objecttype) \| `undefined` \| ``null``, [`GraphType`](modules.md#graphtype) \| `undefined` \| ``null``]

#### Defined in

[lib/types.ts:20](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L20)

___

### RawObject

Ƭ **RawObject**: { `@id?`: `string` \| `NamedNode` \| `BlankNode`  } & { `[key: string | symbol | number]`: [`RawValue`](modules.md#rawvalue) \| [`RawValue`](modules.md#rawvalue)[];  } \| [`SubjectProxy`](modules.md#subjectproxy)

#### Defined in

[lib/util/RawObject.ts:5](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/util/RawObject.ts#L5)

___

### RawValue

Ƭ **RawValue**: `string` \| `boolean` \| `number` \| [`RawObject`](modules.md#rawobject) \| `undefined`

#### Defined in

[lib/util/RawObject.ts:13](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/util/RawObject.ts#L13)

___

### SubjectProxy

Ƭ **SubjectProxy**: `Object`

#### Index signature

▪ [key: `string` \| `number` \| `symbol`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `@context` | `ContextDefinition` |
| `@id?` | `string` |
| `[_getUnderlyingDataset]` | `Dataset` |
| `[_getUnderlyingNode]` | `NamedNode` \| `BlankNode` |
| `[_proxyContext]` | [`ProxyContext`](classes/ProxyContext.md) |
| `[_writeGraphs]` | [`GraphType`](modules.md#graphtype)[] |

#### Defined in

[lib/subjectProxy/SubjectProxy.ts:12](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/subjectProxy/SubjectProxy.ts#L12)

___

### SubjectType

Ƭ **SubjectType**: `NamedNode` \| `BlankNode`

#### Defined in

[lib/types.ts:15](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L15)

___

### methodBuilder

Ƭ **methodBuilder**<`Return`\>: (`target`: [`ArrayProxyTarget`](modules.md#arrayproxytarget), `key`: `string`, `proxyContext`: [`ProxyContext`](classes/ProxyContext.md)) => `Return`

#### Type parameters

| Name |
| :------ |
| `Return` |

#### Type declaration

▸ (`target`, `key`, `proxyContext`): `Return`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`ArrayProxyTarget`](modules.md#arrayproxytarget) |
| `key` | `string` |
| `proxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

##### Returns

`Return`

#### Defined in

[lib/arrayProxy/arrayMethods.ts:9](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/arrayProxy/arrayMethods.ts#L9)

## Variables

### \_getNodeAtIndex

• `Const` **\_getNodeAtIndex**: typeof [`_getNodeAtIndex`](modules.md#_getnodeatindex)

#### Defined in

[lib/types.ts:6](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L6)

___

### \_getUnderlyingArrayTarget

• `Const` **\_getUnderlyingArrayTarget**: typeof [`_getUnderlyingArrayTarget`](modules.md#_getunderlyingarraytarget)

#### Defined in

[lib/types.ts:8](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L8)

___

### \_getUnderlyingDataset

• `Const` **\_getUnderlyingDataset**: typeof [`_getUnderlyingDataset`](modules.md#_getunderlyingdataset)

#### Defined in

[lib/types.ts:7](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L7)

___

### \_getUnderlyingMatch

• `Const` **\_getUnderlyingMatch**: typeof [`_getUnderlyingMatch`](modules.md#_getunderlyingmatch)

#### Defined in

[lib/types.ts:4](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L4)

___

### \_getUnderlyingNode

• `Const` **\_getUnderlyingNode**: typeof [`_getUnderlyingNode`](modules.md#_getunderlyingnode)

#### Defined in

[lib/types.ts:3](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L3)

___

### \_isSubjectOriented

• `Const` **\_isSubjectOriented**: typeof [`_isSubjectOriented`](modules.md#_issubjectoriented)

#### Defined in

[lib/types.ts:5](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L5)

___

### \_proxyContext

• `Const` **\_proxyContext**: typeof [`_proxyContext`](modules.md#_proxycontext)

#### Defined in

[lib/types.ts:9](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L9)

___

### \_writeGraphs

• `Const` **\_writeGraphs**: typeof [`_writeGraphs`](modules.md#_writegraphs)

#### Defined in

[lib/types.ts:10](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/types.ts#L10)

___

### arrayMethodsBuilders

• `Const` **arrayMethodsBuilders**: [`ArrayMethodBuildersType`](interfaces/ArrayMethodBuildersType.md)

#### Defined in

[lib/arrayProxy/arrayMethods.ts:39](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/arrayProxy/arrayMethods.ts#L39)

___

### methodNames

• `Const` **methodNames**: `Set`<keyof [`ArrayMethodBuildersType`](interfaces/ArrayMethodBuildersType.md)\>

#### Defined in

[lib/arrayProxy/arrayMethods.ts:27](https://github.com/o-development/jsonld-dataset-proxy/blob/26f2384/lib/arrayProxy/arrayMethods.ts#L27)

## Functions

### addObjectToDataset

▸ **addObjectToDataset**(`item`, `shouldDeleteOldTriples`, `proxyContext`): [`SubjectProxy`](modules.md#subjectproxy)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`RawObject`](modules.md#rawobject) |
| `shouldDeleteOldTriples` | `boolean` |
| `proxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

#### Returns

[`SubjectProxy`](modules.md#subjectproxy)

___

### addRawObjectToDatasetRecursive

▸ **addRawObjectToDatasetRecursive**(`item`, `visitedObjects`, `shouldDeleteOldTriples`, `proxyContext`): [`SubjectProxy`](modules.md#subjectproxy)

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`RawObject`](modules.md#rawobject) |
| `visitedObjects` | [`NodeSet`](classes/NodeSet.md) |
| `shouldDeleteOldTriples` | `boolean` |
| `proxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

#### Returns

[`SubjectProxy`](modules.md#subjectproxy)

___

### addRawValueToDatasetRecursive

▸ **addRawValueToDatasetRecursive**(`subject`, `key`, `value`, `visitedObjects`, `shouldDeleteOldTriples`, `proxyContext`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `subject` | `BlankNode` \| `NamedNode`<`string`\> |
| `key` | `string` |
| `value` | [`RawValue`](modules.md#rawvalue) |
| `visitedObjects` | [`NodeSet`](classes/NodeSet.md) |
| `shouldDeleteOldTriples` | `boolean` |
| `proxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

#### Returns

`void`

___

### checkArrayModification

▸ **checkArrayModification**(`target`, `objectsToAdd`, `proxyContext`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`ArrayProxyTarget`](modules.md#arrayproxytarget) |
| `objectsToAdd` | [`RawValue`](modules.md#rawvalue)[] |
| `proxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

#### Returns

`void`

___

### createArrayHandler

▸ **createArrayHandler**(`proxyContext`): `ProxyHandler`<[`ArrayProxyTarget`](modules.md#arrayproxytarget)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `proxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

#### Returns

`ProxyHandler`<[`ArrayProxyTarget`](modules.md#arrayproxytarget)\>

___

### createSubjectHander

▸ **createSubjectHander**(`initialProxyContext`): `ProxyHandler`<[`SubjectProxyTarget`](interfaces/SubjectProxyTarget.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialProxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

#### Returns

`ProxyHandler`<[`SubjectProxyTarget`](interfaces/SubjectProxyTarget.md)\>

___

### deleteValueFromDataset

▸ **deleteValueFromDataset**(`target`, `key`, `proxyContext`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`SubjectProxyTarget`](interfaces/SubjectProxyTarget.md) |
| `key` | `string` \| `symbol` |
| `proxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

#### Returns

`boolean`

___

### getNodeFromRawObject

▸ **getNodeFromRawObject**(`item`, `contextUtil`): `NamedNode` \| `BlankNode`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`RawObject`](modules.md#rawobject) |
| `contextUtil` | [`ContextUtil`](classes/ContextUtil.md) |

#### Returns

`NamedNode` \| `BlankNode`

___

### getNodeFromRawValue

▸ **getNodeFromRawValue**(`key`, `value`, `proxyContext`): `BlankNode` \| `NamedNode` \| `Literal` \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | [`RawValue`](modules.md#rawvalue) |
| `proxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

#### Returns

`BlankNode` \| `NamedNode` \| `Literal` \| `undefined`

___

### getProxyFromObject

▸ **getProxyFromObject**(`object`): [`SubjectProxy`](modules.md#subjectproxy) \| [`ArrayProxy`](modules.md#arrayproxy)

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | [`ObjectLike`](modules.md#objectlike) \| [`ObjectLike`](modules.md#objectlike)[] |

#### Returns

[`SubjectProxy`](modules.md#subjectproxy) \| [`ArrayProxy`](modules.md#arrayproxy)

___

### getSubjectProxyFromObject

▸ **getSubjectProxyFromObject**(`object`): [`SubjectProxy`](modules.md#subjectproxy)

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | [`ObjectLike`](modules.md#objectlike) |

#### Returns

[`SubjectProxy`](modules.md#subjectproxy)

___

### getValueForKey

▸ **getValueForKey**(`target`, `key`, `proxyContext`): [`SubjectProxy`](modules.md#subjectproxy) \| [`ArrayProxy`](modules.md#arrayproxy) \| `string` \| `number` \| `boolean` \| `undefined`

Given a subject target and a key return the correct value

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`SubjectProxyTarget`](interfaces/SubjectProxyTarget.md) |
| `key` | `string` \| `symbol` |
| `proxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

#### Returns

[`SubjectProxy`](modules.md#subjectproxy) \| [`ArrayProxy`](modules.md#arrayproxy) \| `string` \| `number` \| `boolean` \| `undefined`

___

### graphOf

▸ **graphOf**<`Subject`, `Key`\>(`subject`, `predicate`, `object?`): [`GraphType`](modules.md#graphtype)[]

Returns the graph for which a defined triple is a member

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Subject` | extends [`ObjectLike`](modules.md#objectlike) |
| `Key` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `Subject` | A JsonldDatasetProxy that represents the subject |
| `predicate` | `Key` | The key on the JsonldDatasetProxy |
| `object?` | `NonNullable`<`Subject`[`Key`]\> extends `unknown`[] ? `number` \| [`ObjectLike`](modules.md#objectlike) : [`ObjectLike`](modules.md#objectlike) | The direct object. This can be a JsonldDatasetProxy or the index |

#### Returns

[`GraphType`](modules.md#graphtype)[]

a list of graphs for which the triples are members

___

### isArrayProxy

▸ **isArrayProxy**(`someObject?`): someObject is ArrayProxy

#### Parameters

| Name | Type |
| :------ | :------ |
| `someObject?` | `unknown` |

#### Returns

someObject is ArrayProxy

___

### isProxy

▸ **isProxy**(`someObject?`): someObject is SubjectProxy \| ArrayProxy

#### Parameters

| Name | Type |
| :------ | :------ |
| `someObject?` | `unknown` |

#### Returns

someObject is SubjectProxy \| ArrayProxy

___

### isSubjectProxy

▸ **isSubjectProxy**(`someObject?`): someObject is SubjectProxy

#### Parameters

| Name | Type |
| :------ | :------ |
| `someObject?` | `unknown` |

#### Returns

someObject is SubjectProxy

___

### jsonldDatasetProxy

▸ **jsonldDatasetProxy**(`inputDataset`, `context`): [`JsonldDatasetProxyBuilder`](classes/JsonldDatasetProxyBuilder.md)

Creates a JSON-LD Dataset Proxy

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inputDataset` | `Dataset`<`Quad`, `Quad`\> | the source dataset |
| `context` | `ContextDefinition` | JSON-LD Context |

#### Returns

[`JsonldDatasetProxyBuilder`](classes/JsonldDatasetProxyBuilder.md)

a JSON-LD Dataset proxy

___

### literalToJsonldRepresentation

▸ **literalToJsonldRepresentation**(`literal`): `string` \| `number` \| `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `literal` | `Literal` |

#### Returns

`string` \| `number` \| `boolean`

___

### modifyArray

▸ **modifyArray**<`ReturnType`\>(`config`, `proxyContext`): `ReturnType`

#### Type parameters

| Name |
| :------ |
| `ReturnType` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Object` |
| `config.key` | `string` |
| `config.modifyCoreArray` | (`coreArray`: [`ObjectType`](modules.md#objecttype)[], `addedValues`: [`ObjectType`](modules.md#objecttype)[]) => `ReturnType` |
| `config.quadsToDelete?` | (`quads`: `Quad`[]) => `Quad`[] |
| `config.target` | [`ArrayProxyTarget`](modules.md#arrayproxytarget) |
| `config.toAdd?` | [`RawValue`](modules.md#rawvalue)[] |
| `proxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

#### Returns

`ReturnType`

___

### nodeToJsonldRepresentation

▸ **nodeToJsonldRepresentation**(`node`, `proxyContext`): `string` \| `number` \| `boolean` \| [`SubjectProxy`](modules.md#subjectproxy)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Quad_Object` |
| `proxyContext` | [`ProxyContext`](classes/ProxyContext.md) |

#### Returns

`string` \| `number` \| `boolean` \| [`SubjectProxy`](modules.md#subjectproxy)

___

### nodeToString

▸ **nodeToString**(`node`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `undefined` \| ``null`` \| `BlankNode` \| `Literal` \| `DefaultGraph` \| `NamedNode`<`string`\> |

#### Returns

`string`

___

### write

▸ **write**(...`graphs`): [`InteractOptions`](interfaces/InteractOptions.md)

Set the graphs that should be written to

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...graphs` | [`GraphType`](modules.md#graphtype)[] | The graphs that should be written to |

#### Returns

[`InteractOptions`](interfaces/InteractOptions.md)

a write builder
