---
title:  "Data types"
displayed_sidebar: dynamodb
---

While create a table we have assign "S" to **AttributeType** for AttributeDefinitions. Here "S" is for string data type. Dynamodb provies us three data types.
1. Scalar
2. Set 
3. Document

**AttributeType** is required to be specified for attributes who are going to used as a part of key schema while creating a table or secondary index. For non key attributes, there is no need to sepcify attribute type. While adding an item to table, the value assigned to key attributes should be as per the attribute however for non key attributes we can assign any type of value.

***

## Scalar types

Scalar types are used for those attributes where we want to use a single value. These are the scalar data types available in dynamodb.
- number
- string
- binary
- Boolean
- null

### Number (N)

In dynamodb numbers can be positive, negative and zero. Numbers can have upto 38 digits precision. This is the nubmer range supported.
- Positive range: 1E-130 to 9.9999999999999999999999999999999999999E+125
- Negative range: -9.9999999999999999999999999999999999999E+125 to -1E-130

### String (S)

In dynamodb strings are **Unicodes** with UTF-8 binary encoding. If string type attribute is not primary key then,
- Minimum size can be zero.
- Maximum size can be upto dynamodb max item size which is 400KB.

Or if string type attribute is primary key then,
- Minimum size can not be zero. A value is required.
- Maximum size for
  - simple primary key is 2048 bytes.
  - composite primary key is 1024 bytes.

### Binary (B)

In dynamodb binary type can be used for storing images, compressed text or any other binary data. Before sending binary data to dynamodb, it is must to encoded binary data using base64-encoding. After receiving binary data dynamodb decodes the data into unsigned byte array and uses lenth of that array for checking item size.

If binary attribute is not a primary key then,
- Minimum size can be zero.
- Maximum size can be upto dynamodb max item size which is 400KB.

Or if binary type attribute is primary key then,
- Minimum size can not be zero. A value is required.
- Maximum size for
  - simple primary key is 2048 bytes.
  - composite primary key is 1024 bytes.

### Boolean (BOOL)

A Boolean type attribute can store either true or false.

### Null (NULL)

Null represents an attribute with an unknown or undefined state.

***

## Set types

We can have sets of either **number**, **string** or **binary**. All elements in as set must be of same type and unique. Only dynamodb item size of 400KB is applicable for set types. The of the items is not preserved. 

Dynamodb does not support empty sets however empty stings & binary values are allowed within a set.
- Number set (NS)
- Binary set (BS)
- String set (SS)

***

## Document types

When we want to store a complex structure such as a JSON, we can use document data types. Dynamodb only support upto 32 nested levels a data size of upto 400KB. List & Map are the document types supported by dynamodb.

### List (L)

In dynamodb a list is similar to a JSON array. We can store an ordered collection of attibutes using list. Lists are enclosed in square brackets: `[ ... ]`.

### Map (M)

In dynamodb a map is similar to a JSON object. We can store values in the form of unordered key-value pair. Maps are enclosed in curly braces: `{ ... }`.

***

## Storing dates or timestamp

We can use either number or string data type for storing dates or timestamp in dynamodb. 

- **Number**: We can use epoch time with number data types. For more info http://en.wikipedia.org/wiki/Unix_time. For example, the epoch time `1437136300` represents 12:31:40 PM UTC on 17 July 2015.
- **String**: We can use ISO 8601 sting with string data types. For more info http://en.wikipedia.org/wiki/ISO_8601. Here are some examples.
  - 2016-02-15
  - 2015-12-21T17:42:34Z
  - 20150311T122706Z
