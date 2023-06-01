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
- [languageOrdering](ProxyContext.md#languageordering)
- [state](ProxyContext.md#state)
- [subjectMap](ProxyContext.md#subjectmap)
- [writeGraphs](ProxyContext.md#writegraphs)

### Methods

- [createArrayHandler](ProxyContext.md#createarrayhandler)
- [createArrayProxy](ProxyContext.md#createarrayproxy)
- [createSubjectHandler](ProxyContext.md#createsubjecthandler)
- [createSubjectProxy](ProxyContext.md#createsubjectproxy)
- [duplicate](ProxyContext.md#duplicate)
- [getArrayKey](ProxyContext.md#getarraykey)

## Constructors

### constructor

• **new ProxyContext**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ProxyContextOptions`](../interfaces/ProxyContextOptions.md) |

## Properties

### arrayMap

• `Private` **arrayMap**: `Map`<`string`, [`ArrayProxy`](../modules.md#arrayproxy)\>

#### Defined in

[lib/ProxyContext.ts:29](https://github.com/o-development/jsonld-dataset-proxy/blob/813009a/lib/ProxyContext.ts#L29)

___

### contextUtil

• `Readonly` **contextUtil**: [`ContextUtil`](ContextUtil.md)

#### Defined in

[lib/ProxyContext.ts:32](https://github.com/o-development/jsonld-dataset-proxy/blob/813009a/lib/ProxyContext.ts#L32)

___

### dataset

• `Readonly` **dataset**: `Dataset`<`Quad`, `Quad`\>

#### Defined in

[lib/ProxyContext.ts:31](https://github.com/o-development/jsonld-dataset-proxy/blob/813009a/lib/ProxyContext.ts#L31)

___

### languageOrdering

• `Readonly` **languageOrdering**: [`LanguageOrdering`](../modules.md#languageordering)

#### Defined in

[lib/ProxyContext.ts:34](https://github.com/o-development/jsonld-dataset-proxy/blob/813009a/lib/ProxyContext.ts#L34)

___

### state

• **state**: `Record`<`string`, `unknown`\>

#### Defined in

[lib/ProxyContext.ts:35](https://github.com/o-development/jsonld-dataset-proxy/blob/813009a/lib/ProxyContext.ts#L35)

___

### subjectMap

• `Private` **subjectMap**: `Map`<`string`, [`SubjectProxy`](../modules.md#subjectproxy)\>

#### Defined in

[lib/ProxyContext.ts:28](https://github.com/o-development/jsonld-dataset-proxy/blob/813009a/lib/ProxyContext.ts#L28)

___

### writeGraphs

• `Readonly` **writeGraphs**: [`GraphType`](../modules.md#graphtype)[]

#### Defined in

[lib/ProxyContext.ts:33](https://github.com/o-development/jsonld-dataset-proxy/blob/813009a/lib/ProxyContext.ts#L33)

## Methods

### createArrayHandler

▸ `Protected` **createArrayHandler**(): `ProxyHandler`<[`ArrayProxyTarget`](../modules.md#arrayproxytarget)\>

#### Returns

`ProxyHandler`<[`ArrayProxyTarget`](../modules.md#arrayproxytarget)\>

___

### createArrayProxy

▸ **createArrayProxy**(`quadMatch`, `isSubjectOriented?`, `initialTarget?`, `isLangStringArray?`): [`ArrayProxy`](../modules.md#arrayproxy)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `quadMatch` | [`QuadMatch`](../modules.md#quadmatch) | `undefined` |
| `isSubjectOriented` | `boolean` | `false` |
| `initialTarget?` | [`ArrayProxyTarget`](../modules.md#arrayproxytarget) | `undefined` |
| `isLangStringArray?` | `boolean` | `undefined` |

#### Returns

[`ArrayProxy`](../modules.md#arrayproxy)

___

### createSubjectHandler

▸ `Protected` **createSubjectHandler**(): `ProxyHandler`<[`SubjectProxyTarget`](../interfaces/SubjectProxyTarget.md)\>

#### Returns

`ProxyHandler`<[`SubjectProxyTarget`](../interfaces/SubjectProxyTarget.md)\>

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
| `alternativeOptions` | `Partial`<[`ProxyContextOptions`](../interfaces/ProxyContextOptions.md)\> |

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
