---
title:  "Transaction"
displayed_sidebar: dynamodb
hide: true
---

Transactions
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html

Next topics:

8. Working with items (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDB_API.html)
17. Pagination
9. Locking
  - https://aws.amazon.com/blogs/database/building-distributed-locks-with-the-dynamodb-lock-client/
  - https://dynobase.dev/dynamodb-locking/
  - https://stackoverflow.com/questions/48198949/does-dynamodb-have-locking-by-default
  - https://blog.revolve.team/2020/09/08/implement-mutex-with-dynamodb/
11. Indexing (https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html)
10. Sharding (Problems with partition such as hot partition)
12. Backups
13. Events
14. Streams
16. Global tables
    - single region tables
    - Table version
    - Global tables
      - Must use on demand capacity or auto-scale provisioned capacity
      - eventually consistent
      - Last writer wins reconciliation
      - Convert local table to global table
15. Quota
18. Partial Query language (maybe)

Topics for Database
1. Strong consistency vs eventual consistency
    - https://hackernoon.com/eventual-vs-strong-consistency-in-distributed-databases-282fdad37cf7