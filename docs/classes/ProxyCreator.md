[jsonld-dataset-proxy](../README.md) / [Exports](../modules.md) / ProxyCreator

# Class: ProxyCreator

This file keeps track of the target objects used in the proxies.
The reason is so that JSON.stringify does not recurse inifinitely
when it encounters a circular object.

## Table of contents

### Constructors

- [constructor](ProxyCreator.md#constructor)

### Properties

- [arrayMap](ProxyCreator.md#arraymap)
- [subjectMap](ProxyCreator.md#subjectmap)

### Methods

- [createArrayProxy](ProxyCreator.md#createarrayproxy)
- [createSubjectProxy](ProxyCreator.md#createsubjectproxy)
- [getArrayKey](ProxyCreator.md#getarraykey)

## Constructors

### constructor

• **new ProxyCreator**()

## Properties

### arrayMap

• `Private` **arrayMap**: `Map`<`string`, [`ArrayProxyTarget`](../modules.md#arrayproxytarget)\>

#### Defined in

[lib/ProxyCreator.ts:17](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ProxyCreator.ts#L17)

___

### subjectMap

• `Private` **subjectMap**: `Map`<`string`, [`ObjectWithId`](../interfaces/ObjectWithId.md)\>

#### Defined in

[lib/ProxyCreator.ts:16](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ProxyCreator.ts#L16)

## Methods

### createArrayProxy

▸ **createArrayProxy**(`quadMatch`, `dataset`, `contextUtil`): [`ArrayProxyTarget`](../modules.md#arrayproxytarget)

#### Parameters

| Name | Type |
| :------ | :------ |
| `quadMatch` | [`QuadMatch`](../modules.md#quadmatch) |
| `dataset` | `Dataset`<`Quad`, `Quad`\> |
| `contextUtil` | [`ContextUtil`](ContextUtil.md) |

#### Returns

[`ArrayProxyTarget`](../modules.md#arrayproxytarget)

#### Defined in

[lib/ProxyCreator.ts:38](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ProxyCreator.ts#L38)

___

### createSubjectProxy

▸ **createSubjectProxy**(`node`, `dataset`, `contextUtil`): [`ObjectWithId`](../interfaces/ObjectWithId.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `NamedNode`<`string`\> \| `BlankNode` |
| `dataset` | `Dataset`<`Quad`, `Quad`\> |
| `contextUtil` | [`ContextUtil`](ContextUtil.md) |

#### Returns

[`ObjectWithId`](../interfaces/ObjectWithId.md)

#### Defined in

[lib/ProxyCreator.ts:19](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ProxyCreator.ts#L19)

___

### getArrayKey

▸ `Private` **getArrayKey**(...`quadMatch`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...quadMatch` | [`QuadMatch`](../modules.md#quadmatch) |

#### Returns

`string`

#### Defined in

[lib/ProxyCreator.ts:34](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ProxyCreator.ts#L34)
