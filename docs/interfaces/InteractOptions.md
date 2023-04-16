[jsonld-dataset-proxy](../README.md) / [Exports](../modules.md) / InteractOptions

# Interface: InteractOptions

## Table of contents

### Methods

- [using](InteractOptions.md#using)
- [usingCopy](InteractOptions.md#usingcopy)

## Methods

### using

▸ **using**(...`objects`): () => `void`

Given a dataset proxy, this will set the action on that dataset proxy

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...objects` | [`ObjectLike`](../modules.md#objectlike)[] | Any number of dataset proxies |

#### Returns

`fn`

An end function. Call this if to reset the interaction

▸ (): `void`

Given a dataset proxy, this will set the action on that dataset proxy

##### Returns

`void`

An end function. Call this if to reset the interaction

___

### usingCopy

▸ **usingCopy**<`T`\>(...`objects`): `T`[]

Given a dataset proxy this will copy the dataset proxy and set the action
on the copy

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ObjectLike`](../modules.md#objectlike) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...objects` | `T`[] | Any number of dataset proxies |

#### Returns

`T`[]

cloned dataset proxies
