[jsonld-dataset-proxy](../README.md) / [Exports](../modules.md) / JsonldDatasetProxyBuilder

# Class: JsonldDatasetProxyBuilder

Helps build JSON LD Dataset Proxies for a specific dataset and context

## Table of contents

### Constructors

- [constructor](JsonldDatasetProxyBuilder.md#constructor)

### Properties

- [proxyContext](JsonldDatasetProxyBuilder.md#proxycontext)

### Methods

- [fromJson](JsonldDatasetProxyBuilder.md#fromjson)
- [fromSubject](JsonldDatasetProxyBuilder.md#fromsubject)
- [matchObject](JsonldDatasetProxyBuilder.md#matchobject)
- [matchSubject](JsonldDatasetProxyBuilder.md#matchsubject)
- [write](JsonldDatasetProxyBuilder.md#write)

## Constructors

### constructor

• **new JsonldDatasetProxyBuilder**(`proxyContext`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `proxyContext` | [`ProxyContext`](ProxyContext.md) |

## Properties

### proxyContext

• `Private` **proxyContext**: [`ProxyContext`](ProxyContext.md)

#### Defined in

[lib/JsonldDatasetProxyBuilder.ts:10](https://github.com/o-development/jsonld-dataset-proxy/blob/0a2498d/lib/JsonldDatasetProxyBuilder.ts#L10)

## Methods

### fromJson

▸ **fromJson**<`T`\>(`inputData`): `T`

Takes a given object and places it in the dataset while returning a JSON LD
Dataset Proxy representing the object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ObjectLike`](../modules.md#objectlike) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `inputData` | `T` | Initial Data |

#### Returns

`T`

___

### fromSubject

▸ **fromSubject**<`T`\>(`subject`): `T`

Creates a JSON LD Dataset Proxy that matches the given subject

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ObjectLike`](../modules.md#objectlike) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `BlankNode` \| `NamedNode`<`string`\> | The node to match |

#### Returns

`T`

___

### matchObject

▸ **matchObject**<`T`\>(`subject`, `predicate`, `graph`): `T`[]

Matches Objects to provided subjects, predicates, and graphs. Returns a
JSON LD Dataset that can be read an modified.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ObjectLike`](../modules.md#objectlike) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subject` | `undefined` \| ``null`` \| [`SubjectType`](../modules.md#subjecttype) | The subject to match |
| `predicate` | `undefined` \| ``null`` \| [`PredicateType`](../modules.md#predicatetype) | The predicate to match |
| `graph` | `undefined` \| ``null`` \| [`GraphType`](../modules.md#graphtype) | The graph to match |

#### Returns

`T`[]

___

### matchSubject

▸ **matchSubject**<`T`\>(`predicate`, `object?`, `graph?`): `T`[]

Matches Subjects to provided predicates, objects, and graphs. Returns a
JSON LD Dataset that can be read an modified.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ObjectLike`](../modules.md#objectlike) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | `undefined` \| ``null`` \| [`PredicateType`](../modules.md#predicatetype) | The predicate to match |
| `object?` | ``null`` \| [`ObjectType`](../modules.md#objecttype) | The object to match |
| `graph?` | ``null`` \| [`GraphType`](../modules.md#graphtype) | The graph to match |

#### Returns

`T`[]

___

### write

▸ **write**(...`graphs`): [`JsonldDatasetProxyBuilder`](JsonldDatasetProxyBuilder.md)

Designates that all Jsonld Dataset Proxies created should write to the
specified graphs

#### Parameters

| Name | Type |
| :------ | :------ |
| `...graphs` | [`GraphType`](../modules.md#graphtype)[] |

#### Returns

[`JsonldDatasetProxyBuilder`](JsonldDatasetProxyBuilder.md)
