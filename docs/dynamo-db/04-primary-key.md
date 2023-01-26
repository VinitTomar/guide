---
title:  "Primary Key"
displayed_sidebar: dynamodb
---

Like in sql databases, dynamodb also requires a key **primary key** to uniquely identify each item in a table. While creating a table it is required to specify a primary key. There are two types of primary key dynamodb support.
1. Partition key
2. Partition key & sort key (AKA composite key)

For key primary key attributes only scalar data types are supported such as string, number or binary.

***

## Partition key

Dynamodb db uses partition to store a table's data. While creating a table dynamodb allocates a nubmer of partitions sufficient for the read/write throughput requirement. While storing an item, dynamodb uses partition key to calculate **HASH** so that a partition can be selected for storing that item.

As you have seen the `KeySchema` while creating table, we have specified an attribute whose `KeyType` set to `HASH`. This is the attribute which will be used as partition key.

```ts showLineNumbers title="Partition key example"
KeySchema: [
  {
    AttributeName: 'Username',
    KeyType: 'HASH'
  },
],
```

No two elements can have same paritition key when we are only using partition key as in the **primary key**.

***

## Partition & sort key

With partition key we can also specify a **sort key**. Sort key gives us flexibiliy to apply operations such as `begins_with`, `between`, `>`, `<` & so on, while quering a table. When we are using both partition key & sort key for primary key then it can be called a **composit key**.

While specifying `KeySchema` for composite keys, one attribute's `KeyType` is set to `HASH` and another attribute's `KeyType` is set to `RANGE`. Here `RANGE` is used for sort key and `HASH` is used for partition key.

Example:
```ts showLineNumbers title="Partition & sort key example"
KeySchema: [
  {
    AttributeName: 'Username',
    KeyType: 'HASH'
  },
  {
    AttributeName: 'State',
    KeyType: 'RANGE'
  }
],
```

For those tables who have composite key, more than one elements can have same partition key or same sort key however both partition key and sort key combine together should be unique.

***

## Read/Write operations

In case of a table who has only **partition key** key for primary key, in that case dynamodb uses an internal **hash** function to find out the partition where our item is going to write or read from. Once the partition is selected then:
- dynamodb uses partition key to search the item for the specified table in that partition, in case of read.
- dynamodb inserts our item in the table inside that partition and updates indexes if required incase of write.

If we are using **partition & sort kye** for primary key, than things changes slightly. Dynamodb still uses **parition key** for finding the partition. Once parition is located then dyanmodb
- list all the items matching the specified parition key, then applies the specified operation, such as `begins_with`, `between`, `>`, `<` etc., on **sort key** if we are quering data. If we are performing get opertion then dynamodb performs `=` operation on **sort key**.
- find the location of items with the same **partition key** and add new element to the list in a sorted order. If no item is found then dynamodb creates a new entry for the item. At least dynamodb updates the indexes if required in case of write.