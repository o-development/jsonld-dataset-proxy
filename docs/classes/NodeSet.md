[jsonld-dataset-proxy](../README.md) / [Exports](../modules.md) / NodeSet

# Class: NodeSet

## Table of contents

### Constructors

- [constructor](NodeSet.md#constructor)

### Properties

- [map](NodeSet.md#map)
- [set](NodeSet.md#set)

### Methods

- [add](NodeSet.md#add)
- [delete](NodeSet.md#delete)
- [has](NodeSet.md#has)
- [toArray](NodeSet.md#toarray)

## Constructors

### constructor

• **new NodeSet**()

## Properties

### map

• `Private` **map**: `Record`<`string`, [`ObjectType`](../modules.md#objecttype)\> = `{}`

#### Defined in

[lib/util/NodeSet.ts:24](https://github.com/o-development/jsonld-dataset-proxy/blob/188f397/lib/util/NodeSet.ts#L24)

___

### set

• `Private` **set**: `Set`<`string`\>

#### Defined in

[lib/util/NodeSet.ts:23](https://github.com/o-development/jsonld-dataset-proxy/blob/188f397/lib/util/NodeSet.ts#L23)

## Methods

### add

▸ **add**(`node`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`ObjectType`](../modules.md#objecttype) |

#### Returns

`void`

___

### delete

▸ **delete**(`node`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`ObjectType`](../modules.md#objecttype) |

#### Returns

`boolean`

___

### has

▸ **has**(`node`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`ObjectType`](../modules.md#objecttype) |

#### Returns

`boolean`

___

### toArray

▸ **toArray**(): [`ObjectType`](../modules.md#objecttype)[]

#### Returns

[`ObjectType`](../modules.md#objecttype)[]
