[jsonld-dataset-proxy](../README.md) / [Exports](../modules.md) / InteractOptions

# Interface: InteractOptions

## Table of contents

### Methods

- [using](InteractOptions.md#using)
- [usingCopy](InteractOptions.md#usingcopy)

## Methods

### using

▸ **using**(...`objects`): () => `void`

Given a dataset proxy, this makes all write actions to the dataset proxy
occur on the given graph.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...objects` | [`ObjectLike`](../modules.md#objectlike)[] | Any number of dataset proxies |

#### Returns

`fn`

void

▸ (): `void`

Given a dataset proxy, this makes all write actions to the dataset proxy
occur on the given graph.

##### Returns

`void`

void

___

### usingCopy

▸ **usingCopy**<`T`\>(...`objects`): `T`[]

Given a dataset proxy this will return a dataset proxy where all write
operation will occur on the given graph. The original proxy is unmodified.

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
