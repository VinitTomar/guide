---
title:  "Introduction"
date:   2022-11-05 06:00:00 +0000
displayed_sidebar: dynamodb
sidebar_position: 001
---
# Dynamodb 

 DynamoDB is a NoSQL database that comes under the category of those databases that stores data in the form of key-value pair. When we create a table in DynamoDB we have to specify only those attributes required for the primary key.

DynamoDB stores data on partitions and a partition is chosen based on the primary key. Choosing the proper primary key is very important for the performance of read-write operations. If we want a consistent performance for tables regardless of the table size, whether it is 1GB or 100GB, then we should carefully look at the access pattern required by our application. Ideally, for one access pattern, there should be  only one request.

It is also important to note that DynamoDB uses HTTP for communications. Therefore lesser the number of connections better is the performance.

If we look at the high level, these are the basic component of DynamoDB.
* **Tables**: DynamoDB stores data in the form of tables where each table has zero or more Items.
* **Items**: Items in DynamoDB are similar to tuples or records as in other databases. An item contains data in the form of attributes. Each item has key attributes and non-key attributes. Key attributes identify each item uniquely in the table.
* **Attributes**: Each item in the table contains at least one attribute. An attribute is the fundamental data storage element that can be decomposed further.

In this tutorial we are going to cover following topics.
1. [Setup](setup)
2. [Tables](table)
3. [Primary key](primary-key)
5. [Data types](data-types)