---
title:  "Introduction"
date:   2022-11-05 06:00:00 +0000
displayed_sidebar: dynamodb
sidebar_position: 001
---
# Dynamodb 

Dynamodb is NoSQL database wich comes under the category of those databases who stores data in the form of key value pair. When we create a table we have to specify those attributes who makes a primary key.

Dynamodb runs over https protocol.

DynamoDB stores data on partitions and a partition is chosen based on the primary key. Choosing proper primary key is very important for the performance of our tables. If we want to contistent performance for tables regardless of the table size, wheter is is 1GB of 100GB, then we should carefully look at the access pattern required by our application. Ideally for one access pattern there should be on request.

If we look at high level, these the basic component of dynamodb.
* **Tables**: DynamoDB stores data in the form of tables where each table has zero or more Items.
* **Items**: Items in dynamodb are similar to tuples or record as in other databases. An item contains data in the form of attribues. Each item has key attributes and non key attributes. Key attributes identifies each item uniquly in the table.
* **Attributes**: Each item in the table contains atleast one attribute. An attribute is the fundamental data storeage element which is decomposed any further.

In this tutorial we are going to cover following topics.
1. [Setup](setup)
2. [Tables](table)
3. [Primary key](primary-key)
5. [Data types](data-types)