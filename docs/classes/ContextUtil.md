[jsonld-dataset-proxy](../README.md) / [Exports](../modules.md) / ContextUtil

# Class: ContextUtil

## Table of contents

### Constructors

- [constructor](ContextUtil.md#constructor)

### Properties

- [context](ContextUtil.md#context)
- [iriToKeyMap](ContextUtil.md#iritokeymap)

### Methods

- [getType](ContextUtil.md#gettype)
- [iriToKey](ContextUtil.md#iritokey)
- [isArray](ContextUtil.md#isarray)
- [keyToIri](ContextUtil.md#keytoiri)

## Constructors

### constructor

• **new ContextUtil**(`context`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `ContextDefinition` |

#### Defined in

[lib/ContextUtil.ts:7](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ContextUtil.ts#L7)

## Properties

### context

• `Readonly` **context**: `ContextDefinition`

#### Defined in

[lib/ContextUtil.ts:4](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ContextUtil.ts#L4)

___

### iriToKeyMap

• `Private` **iriToKeyMap**: `Record`<`string`, `string`\>

#### Defined in

[lib/ContextUtil.ts:5](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ContextUtil.ts#L5)

## Methods

### getType

▸ **getType**(`key`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`

#### Defined in

[lib/ContextUtil.ts:44](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ContextUtil.ts#L44)

___

### iriToKey

▸ **iriToKey**(`iri`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `iri` | `string` |

#### Returns

`string`

#### Defined in

[lib/ContextUtil.ts:37](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ContextUtil.ts#L37)

___

### isArray

▸ **isArray**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

#### Defined in

[lib/ContextUtil.ts:54](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ContextUtil.ts#L54)

___

### keyToIri

▸ **keyToIri**(`key`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`

#### Defined in

[lib/ContextUtil.ts:24](https://github.com/o-development/jsonld-dataset-proxy/blob/2d127f7/lib/ContextUtil.ts#L24)
