---
title:  "Tables"
displayed_sidebar: dynamodb
---

## Create a table
```ts showLineNumbers
import { CreateTableCommand, DynamoDBClient, TableClass } from "@aws-sdk/client-dynamodb";
const endpoint = 'http://localhost:8000';
const client = new DynamoDBClient({
  endpoint
});

async function createMyTable() {
  const command = new CreateTableCommand({
    TableName: 'User',
    AttributeDefinitions: [
      {
        AttributeName: 'Username',
        AttributeType: 'S'
      },
      {
        AttributeName: 'State',
        AttributeType: 'S'
      }
    ],
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
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    },
    TableClass: TableClass.STANDARD
  });
  const result = await client.send(command);
  console.log(result);
}
createMyTable();
```

To create our table we initializing `client` with the instance of class `DynamoDBClient` on **line 3**. This class is imported from from `@aws-sdk/client-dynamodb`. While calling the constructor of `DynamoDBClient` class we are passing enpoint url of our local DynamoDB instance. Next we creating `CreateTableCommand` command for creating `MyTable` inside `createMyTable` function.

To create a table `TableName`, `AttributeDefinitions` & `KeySchema` are required. Default value for `BillingMode` is `PROVISIONED` and with provisioned billing mode we need to specify `ProvisionedThroughput`. If we know how frequent our table is going to be accesed, then we can also specify `TableClass` also. By default table class is set to `STANDARD`.

After creating command, we are creating our table by call `client.send` method on **line 37**.

Now lets see inputs of `CreateTableCommand` in detail.
- **TableName:** This field used to give a to our table.
- **AttributeDefinitions:** This field used to define the attributes of our table. As dynamodb is schemaless there we only need to specify those attribute which we are going to use as our primary key. Other attribute definitions are optional. It is an array of object where each object contains `AttributeName` and `AttributeType`.
- **KeySchema:** This field used to define which attribues we are going to use in our primary key. It is an array with at least one element and at most two elements, depending on our primary key type. Every attribute in KeySchema should be present in AttributeDefinitions. `HASH` key type is used for **partition key** attribute and `RANGE` is used for **sort key** type.
- **BillingMode**: This field is used to specify how we want to be billed for access our table. We can set these two billing modes. This field can be updated later.
  * PROVISIONED: This mode should be used if we can predict how much traffice our table is going to get.
  * PAY_PER_REQUEST: Also know as **On-demand mode**. This mode should be used if we can not predict how much traffice our table is going to get.
- **ProvisionedThroughput:** This field is used when billing mode is provisioned. This field requires `ReadCapacityUnits` and `WriteCapacityUnits` to be specified.  More info on read/write capacity can be found [here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html).
- **TableClass:** This field is used to optimize the cost of our table. Based on how frequently our tables are going to be accessed, we can set either of these two classed.
  * STANDARD: Should be used where data is accessed more frequently.
  * STANDARD_INFREQUENT_ACCESS: Should be used data is accessed less frequently such as application logs, e-commerce order history etc.

***

## Global tables

- single region tables
- Table version
- Global tables
  - Must use on demand capacity or auto-scale provisioned capacity
  - eventually consistent
  - Last writer wins reconciliation
  - Convert local table to global table

***
## Table operations

These are the basic operations we can perform on tables.
- Create
- Describe
- Update
- Delete
- List all tables

### Create
We have already covered how we can create a table.

### Describe
This operation is used to get details of a table. Have a look a this code.

```ts showLineNumbers
async function describeMyTable() {
  const command = new DescribeTableCommand({
    TableName: 'MyTable'
  });
  const result = await client.send(command);
  console.log(result);
}
describeMyTable();
```

In above code, `result` will contain a field `Table` that has all the information about our table such as:
- TableStatus
- TableName
- TableArn
- TableSizeBytes
- AttributeDefinitions
- BillingModeSummary
- KeySchema
- ItemCount
- ProvisionedThroughput etc.

### Update

To update a table we have to use `UpdateTableCommand`. We can make any of these changes with this command.
- Change table's provisioned throughput (depends on table billing mode).
- Change table's billing mode
- Add, update or delete global secondary index.
- Enable or disable streams on table.

```ts showLineNumbers
async function updateMyTable() {
  const command = new UpdateTableCommand({
    TableName: 'MyTable',
    BillingMode: 'PROVISIONED',
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    },
    StreamSpecification: {
      StreamEnabled: true,
      StreamViewType: 'KEYS_ONLY'
    },
  });
  const result = await client.send(command);
  console.log(result);
}
```

In above code `result` will be similar to describe table operation.

### Delete
To delete a table we use `DeleteTableCommand`. Only table name is required to delete a table.

```ts showLineNumbers
async function deleteMyTable() {
  const command = new DeleteTableCommand({
    TableName: 'MyTable'
  });
  const result = await client.send(command);
  console.log(result);
}
deleteMyTable();
```
In above code `result` will be similar to describe table operation.

### List all tables

To list all tables we use `ListTablesCommand`. We can pass any of these two optional paramter to this command.
- **Limit:** If no limit is provided than 100 is the default limit.
- **ExclusiveStartTableName:** When there are more tables than the limit, in that case we can provide a table name to start counting after that table name.

```ts showLineNumbers
async function listAllTables() {
  const command = new ListTablesCommand({
    Limit: 2,
    ExclusiveStartTableName: 'MyOtherTable'
  });
  const result = await client.send(command);
  console.log(result);
}
listAllTables();
```
In above code `result` will be contains all table name inside `TableNames` array. This result also containes one more important field `LastEvaluatedTableName`. This field should be used with `ExclusiveStartTableName` in `ListTablesCommand` to get list of all tables in case if we have more tables than the provided limit.

***

## Get provisioned capacity quota

At the time of create our AWS account, we are given a quota fo maximum read/write capacity units.
This quota is applicable across a single region for all dynamodb tables in that region. If you want to get that quota, you can use `DescribeLimitsCommand`.

```ts showLineNumbers
async function getProvisionedQuota() {
  const command = new DescribeLimitsCommand({});
  const result = await client.send(command);
  console.log(result);
}
getProvisionedQuota();
```

In above code `result` will contain these important fields
- AccountMaxReadCapacityUnits
- AccountMaxWriteCapacityUnits
- TableMaxReadCapacityUnits
- TableMaxWriteCapacityUnits
