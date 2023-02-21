[jsonld-dataset-proxy](../README.md) / [Exports](../modules.md) / ContextUtil

# Class: ContextUtil

Context Util
Handles the JSON-LD context and allows conversion between IRIs and terms

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
- [keyIdToIri](ContextUtil.md#keyidtoiri)
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

[lib/ContextUtil.ts:13](https://github.com/o-development/jsonld-dataset-proxy/blob/0a2498d/lib/ContextUtil.ts#L13)

___

### iriToKeyMap

• `Private` **iriToKeyMap**: `Record`<`string`, `string`\>

#### Defined in

[lib/ContextUtil.ts:14](https://github.com/o-development/jsonld-dataset-proxy/blob/0a2498d/lib/ContextUtil.ts#L14)

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

### keyIdToIri

▸ `Private` **keyIdToIri**(`keyId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyId` | `string` |

#### Returns

`string`

___

### keyToIri

▸ **keyToIri**(`key`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`
