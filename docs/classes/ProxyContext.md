[jsonld-dataset-proxy](../README.md) / [Exports](../modules.md) / ProxyContext

# Class: ProxyContext

This file keeps track of the target objects used in the proxies.
The reason is so that JSON.stringify does not recurse inifinitely
when it encounters a circular object.

## Table of contents

### Constructors

- [constructor](ProxyContext.md#constructor)

### Properties

- [arrayMap](ProxyContext.md#arraymap)
- [contextUtil](ProxyContext.md#contextutil)
- [dataset](ProxyContext.md#dataset)
- [subjectMap](ProxyContext.md#subjectmap)
- [writeGraphs](ProxyContext.md#writegraphs)

### Methods

- [createArrayProxy](ProxyContext.md#createarrayproxy)
- [createSubjectProxy](ProxyContext.md#createsubjectproxy)
- [duplicate](ProxyContext.md#duplicate)
- [getArrayKey](ProxyContext.md#getarraykey)

## Constructors

### constructor

• **new ProxyContext**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `ProxyContextOptions` |

## Properties

### arrayMap

• `Private` **arrayMap**: `Map`<`string`, [`ArrayProxy`](../modules.md#arrayproxy)\>

#### Defined in

[lib/ProxyContext.ts:26](https://github.com/o-development/jsonld-dataset-proxy/blob/0a2498d/lib/ProxyContext.ts#L26)

___

### contextUtil

• `Readonly` **contextUtil**: [`ContextUtil`](ContextUtil.md)

#### Defined in

[lib/ProxyContext.ts:29](https://github.com/o-development/jsonld-dataset-proxy/blob/0a2498d/lib/ProxyContext.ts#L29)

___

### dataset

• `Readonly` **dataset**: `Dataset`<`Quad`, `Quad`\>

#### Defined in

[lib/ProxyContext.ts:28](https://github.com/o-development/jsonld-dataset-proxy/blob/0a2498d/lib/ProxyContext.ts#L28)

___

### subjectMap

• `Private` **subjectMap**: `Map`<`string`, [`SubjectProxy`](../modules.md#subjectproxy)\>

#### Defined in

[lib/ProxyContext.ts:25](https://github.com/o-development/jsonld-dataset-proxy/blob/0a2498d/lib/ProxyContext.ts#L25)

___

### writeGraphs

• `Readonly` **writeGraphs**: [`GraphType`](../modules.md#graphtype)[]

#### Defined in

[lib/ProxyContext.ts:30](https://github.com/o-development/jsonld-dataset-proxy/blob/0a2498d/lib/ProxyContext.ts#L30)

## Methods

### createArrayProxy

▸ **createArrayProxy**(`quadMatch`, `isSubjectOriented?`, `initialTarget?`): [`ArrayProxy`](../modules.md#arrayproxy)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `quadMatch` | [`QuadMatch`](../modules.md#quadmatch) | `undefined` |
| `isSubjectOriented` | `boolean` | `false` |
| `initialTarget?` | [`ArrayProxyTarget`](../modules.md#arrayproxytarget) | `undefined` |

#### Returns

[`ArrayProxy`](../modules.md#arrayproxy)

___

### createSubjectProxy

▸ **createSubjectProxy**(`node`): [`SubjectProxy`](../modules.md#subjectproxy)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `BlankNode` \| `NamedNode`<`string`\> |

#### Returns

[`SubjectProxy`](../modules.md#subjectproxy)

___

### duplicate

▸ **duplicate**(`alternativeOptions`): [`ProxyContext`](ProxyContext.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `alternativeOptions` | `Partial`<`ProxyContextOptions`\> |

#### Returns

[`ProxyContext`](ProxyContext.md)

___

### getArrayKey

▸ `Private` **getArrayKey**(...`quadMatch`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...quadMatch` | [`QuadMatch`](../modules.md#quadmatch) |

#### Returns

`string`