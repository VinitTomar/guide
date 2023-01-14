---
title:  "Tables"
displayed_sidebar: dynamodb
---

## Create a table
To create a table in DynamoDB, you can use this code.

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

On **line 3**, we are initializing `client` with the instance of class `DynamoDBClient`. This class is imported from `@aws-sdk/client-dynamodb`. While calling the constructor of the `DynamoDBClient` class we are passing the endpoint URL of our local DynamoDB instance.
Next, we are creating the `CreateTableCommand` command for creating `MyTable` inside the `createMyTable` function.

`TableName`, `AttributeDefinitions` & `KeySchema` are the required parameters required for creating a table. The default value for `BillingMode` is `PROVISIONED`. For the provisioned billing mode we need to specify `ProvisionedThroughput`. If we know how frequently our table is going to be accessed, then we can also specify `TableClass` also. By default table class is set to `STANDARD`.Now the only thing remaining is to call client.send to create our table which we are doing at **line 37**.

Here are the inputs parameters of `CreateTableCommand` in detail.
- **TableName:** This field is used to give a to our table.
- **AttributeDefinitions:** This field is used to define the attributes of our table. As DynamoDB is schemaless there we only need to specify only those attributes that we are going to use in our primary key. Other attribute definitions are optional. It is an array of objects where each object contains `AttributeName` and `AttributeType`.
- **KeySchema:** This field is used to define those attributes we are going to use in our primary key. It is an array with at least one element and at most two elements, depending on our primary key type. Every attribute in KeySchema should be present in AttributeDefinitions. `HASH` key type is used for the **partition key** attribute and `RANGE` is used for the **sort key** type.
- **BillingMode**: This field is used to specify how we want to be billed to access our table. We can set these two billing modes. This field can be updated later. These are the two modes which we can choose from.
  * PROVISIONED: This mode should be used if we can predict how much traffic our table is going to get.
  * PAY_PER_REQUEST: Also know as **On-demand mode**. This mode should be used if we can not predict how much traffic our table is going to get.
- **ProvisionedThroughput:** This field is used when billing mode is provisioned. This field requires `ReadCapacityUnits` and `WriteCapacityUnits` to be specified. More info on read/write capacity can be found [here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html).
- **TableClass:** This field is used to optimize the cost of our table. Based on how frequently our tables are going to be accessed, we can set either of these two classes.
  * STANDARD: Should be used where data is accessed more frequently.
  * STANDARD_INFREQUENT_ACCESS: Should be used data is accessed less frequently such as application logs, e-commerce order history, etc.

***
## Table operations

These are the basic operations we can perform on tables.
- Create
- Describe
- Update
- Delete
- List all tables

### Create
We have already seen above how we can create a table.

### Describe
This operation is used to get details of a table. Have a look at this code.

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

In the above code, `result` will contain a field `Table` that has all the information about our table such as:
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
- Change the table's provisioned throughput (depends on table billing mode).
- Change the table's billing mode
- Add, update or delete the global secondary index.
- Enable or disable streams on the table.

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
In the above code `result` will be similar to `describe` table operation.

### Delete
To delete a table we use `DeleteTableCommand`. Only the table name is required to delete a table.

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
In the above code `result` will be similar to `describe` table operation.

### List all tables

To list all tables we use `ListTablesCommand`. We can pass any of these two optional parameters to this command.
- **Limit:** If no limit is provided then 100 is the default limit.
- **ExclusiveStartTableName:** When there are more tables than the limit, in that case, we can provide a table name to start counting after that table name.

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
In the above code `result` will contain all table names inside `TableNames` array. This result also contains one more important field `LastEvaluatedTableName`. This field should be used with `ExclusiveStartTableName` in `ListTablesCommand` to get the list of all tables in case we have more tables than the provided limit.

***

## Get provisioned capacity quota

At the time of creating our AWS account, we are given a quota for maximum read/write capacity units. This quota is applicable across a single region for all DynamoDB tables in that region. If you want to get that quota, you can use `DescribeLimitsCommand`.

```ts showLineNumbers
async function getProvisionedQuota() {
  const command = new DescribeLimitsCommand({});
  const result = await client.send(command);
  console.log(result);
}
getProvisionedQuota();
```

In the above code `result` will contain these important fields
- AccountMaxReadCapacityUnits
- AccountMaxWriteCapacityUnits
- TableMaxReadCapacityUnits
- TableMaxWriteCapacityUnits
