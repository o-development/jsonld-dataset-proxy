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

## Properties

### context

• `Readonly` **context**: `ContextDefinition`

#### Defined in

[lib/ContextUtil.ts:4](https://github.com/o-development/jsonld-dataset-proxy/blob/dd0ebdb/lib/ContextUtil.ts#L4)

___

### iriToKeyMap

• `Private` **iriToKeyMap**: `Record`<`string`, `string`\>

#### Defined in

[lib/ContextUtil.ts:5](https://github.com/o-development/jsonld-dataset-proxy/blob/dd0ebdb/lib/ContextUtil.ts#L5)

## Methods

### getType

▸ **getType**(`key`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`

___

### iriToKey

▸ **iriToKey**(`iri`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `iri` | `string` |

#### Returns

`string`

___

### isArray

▸ **isArray**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

___

### keyToIri

▸ **keyToIri**(`key`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`
