[jsonld-dataset-proxy](../README.md) / [Exports](../modules.md) / LiteralObjectQuad

# Interface: LiteralObjectQuad

## Hierarchy

- `Quad`

  ↳ **`LiteralObjectQuad`**

## Table of contents

### Properties

- [graph](LiteralObjectQuad.md#graph)
- [object](LiteralObjectQuad.md#object)
- [predicate](LiteralObjectQuad.md#predicate)
- [subject](LiteralObjectQuad.md#subject)
- [termType](LiteralObjectQuad.md#termtype)
- [value](LiteralObjectQuad.md#value)

### Methods

- [equals](LiteralObjectQuad.md#equals)

## Properties

### graph

• **graph**: `Quad_Graph`

The named graph.

**`See`**

Quad_Graph

#### Inherited from

Quad.graph

#### Defined in

node_modules/@rdfjs/types/data-model.d.ts:227

___

### object

• **object**: `Literal`

#### Overrides

Quad.object

#### Defined in

[lib/language/languageUtils.ts:63](https://github.com/o-development/jsonld-dataset-proxy/blob/813009a/lib/language/languageUtils.ts#L63)

___

### predicate

• **predicate**: `Quad_Predicate`

The predicate.

**`See`**

Quad_Predicate

#### Inherited from

Quad.predicate

#### Defined in

node_modules/@rdfjs/types/data-model.d.ts:217

___

### subject

• **subject**: `Quad_Subject`

The subject.

**`See`**

Quad_Subject

#### Inherited from

Quad.subject

#### Defined in

node_modules/@rdfjs/types/data-model.d.ts:212

___

### termType

• **termType**: ``"Quad"``

Contains the constant "Quad".

#### Inherited from

Quad.termType

#### Defined in

node_modules/@rdfjs/types/data-model.d.ts:170

___

### value

• **value**: ``""``

Contains an empty string as constant value.

#### Inherited from

Quad.value

#### Defined in

node_modules/@rdfjs/types/data-model.d.ts:174

## Methods

### equals

▸ **equals**(`other`): `boolean`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `other` | `undefined` \| ``null`` \| `Term` | The term to compare with. |

#### Returns

`boolean`

True if and only if the argument is a) of the same type b) has all components equal.

#### Inherited from

Quad.equals
