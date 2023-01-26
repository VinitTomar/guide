---
title:  "Items"
displayed_sidebar: dynamodb
---

For this tutorial we are going to use a table named **ProductCatalog**. This table only has simple primary key. Attribute used for primary key is `Id` of type number(N). As dynamodb is schemaless, we can add other attributes according to our need. However we will uese these attributes most frequently.
 - Id
 - Brand
 - Product
 - Color
 - Price



## CRUD operations
An item is a collection of attributes and each attributes has a name & value. Dynamodb provides these atomic operations to perfom CRUD operations on a item.
* PutItem
* GetItem
* UpdateItem
* DeleteItem
Each of these operations requires a primary key for item on which you want to work.

### PutItem
`PutItem` operation creates new item if an item with the same key does not exist. Otherwise old item is replaced with the new item.

```ts showLineNumbers
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    endpoint: 'http://localhost:8000'
  })
);

async function putItem() {
  const command = new PutCommand({
    TableName: 'ProductCatalog',
    Item: {
      Id: 505,
      Brand: 'Brand A',
      Product: 'Flagship product A',
      Color: 'Saffron',
      Price: 4000
    }
    ConditionExpression: 'attribute_not_exists(Id)',
  });

  const result = await docClient.send(command);
  console.log(result);
}

putItem();
```

:::info Tip
We can prevent replacement of old item by using `ConditionExpression: 'attribute_not_exists(Id)'`.
:::

### GetItem
To get an item form dynamodb, we need to specify the complete primary key for `GetItem` operation.
This operation gives eventually consistent value by default. However we can request strongly consisten value using `ConsistentRead` paramter.

```ts showLineNumbers
async function getItem() {
  const command = new GetCommand({
    TableName: 'ProductCatalog',
    Key: {
      Id: 505
    },
    ConsistentRead: true,
  });
  const result = await docClient.send(command);
  console.log(result);
}

getItem();
```
:::info Tip
**ConsistentRead** is false by default. Set this parameter to `true` for requesting strongly consistent value.
:::

### UpdateItem
`UpdateItem` operation is used to modify attributes of an existing item for a given primay key.
If an item does not exist of that key, then a new element is created. This operations performs kind of `upsert` operation.

```ts showLineNumbers
async function updateItem() {
  const id = 505;

  const command = new UpdateCommand({
    TableName: 'ProductCatalog',
    Key: {
      Id: id
    },
    ReturnValues: `ALL_NEW`,
    UpdateExpression: 'Set Brand = :brand, Price = :price',
    ConditionExpression: 'Id = :id',
    ExpressionAttributeValues: {
      ':brand': 'Brand A6 updated',
      ':price': 5500,
      ':id': id
    },
  });

  const result = await docClient.send(command);
  console.log(result);
}

updateItem();
```

:::info Tip
We can prevent creation of new item by using `ConditionExpression: 'Id = :id'`.
:::

### DeleteItem
`DeleteItem` operation deletes an item with the specified key.

```ts showLineNumbers
async function deleteItem() {
  const command = new DeleteCommand({
    TableName: 'ProductCatalog',
    Key: {
      Id: 605
    },
  });

  const result = await docClient.send(command);
  console.log(result);
}

deleteItem();
```
***

## ReturnValues
When we want dynamodb to return some attributes before or after a modification, we can use `ReturnValues` with put, update & delete operations. As we have used `ReturnValues` in **UpdateCommand**, we can use it in similar way with **PutCommand** & **DeleteCommand** also. Here is the list of all possible values supported by `ReturnValues` attribute.

| Operations | Supported values |
| ---------- |:----------------:|
| Put| NONE, ALL_OLD |
| Update| NONE, ALL_OLD, ALL_NEW, UPDATED_OLD, UPDATED_NEW |
| Delete | NONE, ALL_OLD |

- **ALL_OLD**: Return the entire item as it appeared before modification.
- **ALL_NEW**: Return the entire item as it appears after modification.
- **UPDATED_OLD**: Return the only affected attributes as they appeared before modification.
- **UPDATED_NEW**: Return the only affected attributes as they appears after the modification.

***

## Batch operations

***

## Atomic operations

***

## Conditional writes

***

## ReturnConsumedCapacity

***

Document operations (get, put, update, query, scan, delete [ TTL ], conditional update, batch operations)
Expressions
- Update expression
- Expression attribute values
- Project expression
- conditional expression & conditional operator, then atomic counter & conditional writes
Using expression, projection, conditional expressoin etc.
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html