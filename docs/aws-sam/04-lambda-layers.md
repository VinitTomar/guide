---
title:  "Lambda layers"
date:   2022-10-05 06:00:00 +0000
displayed_sidebar: aws
---

If you are using **ZIP** as a packaging system with your lambdas, you can use layers to share code & dependencies across teams in your organization. This tutorial will show how lambda handles layers in the node js environment and how we can create a layer with AWS SAM.

## Intro

In our code, if we are importing a function such as
>```ts
>import { fun } from 'fun-lib';
>```

then the node will try to resolve this dependency from the local `node_modules` folder OR from the path specified by the `NODE_PATH` env variable OR from `/opt/nodejs/node_modules`. If our `fun-lib` is stored inside `nodejs/node_modules/fun-lib`, then our code will work without any import problems.

When lambda prepares the execution environment for our function, it extracts the content of our layer's zip file into the `/opt` directory. If we keep the path for our dependencies as `nodejs/node_modules/dependency-pkg`, then we can import these dependencies in our code without specifying the path.

Let's continue with our **todo** app to see how we can create and upload lambda layers from our local system. Download [this](https://github.com/VinitTomar/todo-aws-sam/tree/impr) code to begin with our tutorial.

***

## Add layers
When you look at the code, you will find a folder **util** with two files `helper.ts` & `todo-put.ts`. For these two files, we are going to create two layers `LayerHelper` & `LayerTodoPut` respectively.

Open file `todo-create.ts` and observe how we have imported functions from files inside the **util** folder.
```ts
import { putTodo } from "./util/todo-put";
import { lambdaWrapper, jsonResponse } from "./util/helper";
```
If we want these imports to be included from our lambda layers, then we need to adjust these imports as below.
```ts
import { putTodo } from "@util/todo-put";
import { lambdaWrapper, jsonResponse } from "@util/helper";
```

### tsconfig.json
We also need to tell **tsc compiler** where it can locate files for scope `@util`, hence update the `tsconfig` with the below code.
```json showLineNumbers title="tsconfig.json"
{
  "compilerOptions": {
    "baseUrl": "./src",
    "target": "es2020",
    "strict": true,
    "preserveConstEnums": true,
    "sourceMap": false,
    "module": "es2015",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@util/*": [
        "./util/*"
      ]
    }
  },
  "exclude": [
    "node_modules",
    "**/*.test.ts"
  ]
}
```
At **line 3** we have added `baseUrl` which points to the `./src` folder and at **line 13** we have configured **paths** for `@util/*` which points to the `./util/*` folder.

### webpack.config.js
We are using webpack for bundling our application. We need to update the `webpack.config.js` file so that **webpack** can generate js files as required by lambda layers.

```js showLineNumbers title="webpack.config.js"
const path = require('path');
const fs = require('fs');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const entry = fs.readdirSync('./src/')
  .filter(file => (file.endsWith('.ts')
    && !file.endsWith('.d.ts')
    && !file.includes('util'))
  )
  .reduce((result, curr) => {
    const name = curr.replace('.ts', '');
    result[name] = './src/' + curr;
    return result;
  }, {});

const layerEntry = fs.readdirSync('./src/util/')
  .reduce((result, curr) => {
    const name = curr.replace('.ts', '');
    const dirName = `layer_${name}/nodejs/node_modules/@util/${name}`;
    result[dirName] = `./src/util/${curr}`;
    return result;
  }, {});

const layerExternals = fs.readdirSync('./src/util')
  .reduce((result, curr) => {
    const name = curr.replace('.ts', '');
    result[`@util/${name}`] = true;
    return result;
  }, {});

module.exports = {
  mode: 'production',
  entry: { ...entry, ...layerEntry },
  target: 'node',
  externals: {
    'aws-sdk/clients/dynamodb': true,
    ...layerExternals
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json"
      }),
    ],
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    clean: true
  },
};
```

To make webpack aware of paths in `tsconfig.json` file we need to use plugin **TsconfigPathsPlugin**. Install this plugin as a dev dependency inside our project. This plugin will create aliases for webpack according to the paths in the ts config file. Therefore we do not need to maintain the same configurations at two places. We have added a new instance of **TsconfigPathsPlugin** plugin at **line 51** & imported it at **line 3**.

From lines **16 to 22**, we have initialized `layerEntry` which has the configuration for entries of our source code. Keys in this configuration will help in generating **js files** for our layers inside the **dist** folder. We will have folders named "`layer_file-name`" where `file-name` is the name of a file inside the **util** folder. Now you can figure out from **keys** what path will be generated for our **js** required by lambda layers.

We also need to make **util** imports as **external dependencies** so that webpack does not bundle these with lambda handler code. Code from **lines 24 to 29** is generating configuration for making **util** imports as external dependencies.

Add `layerEntry` to the `entry` and `layerExternals` to the `externals` of webpack config.

Now run `yarn build` to generate code for our layers. Open **dist** folder and you will see **layer_helper** & **layer_todo-put** folder inside it. These two folders contain code for our **LayerHelper** and **LayerTodoPut** layers.

### template.yaml

Add two **resources** of type `AWS::Serverless::LayerVersion` to our `template.yaml` file.
```yaml showLineNumbers
LayerHelper:
    Type: AWS::Serverless::LayerVersion
    Properties:
      LayerName: LayerHelper
      Description: Helper layer for todo lambdas.
      ContentUri: "dist/layer_helper/"
      CompatibleRuntimes:
        - nodejs16.x

LayerTodoPut:
  Type: AWS::Serverless::LayerVersion
  Properties:
    LayerName: LayerTodoPut
    Description: TodoPut layer for create & update todo lambdas.
    ContentUri: "dist/layer_todo-put/"
    CompatibleRuntimes:
      - nodejs16.x
```

If you run `yarn deploy` this will create two lambda layers as per the **template.yaml** configuration. You can verify the same by navigation to the lambda layers page in your AWS console account.

Now lets add these layers to our lambda **CreateTodoFunction** function. 
```yaml showLineNumbers
CreateTodoFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: dist/todo-create
      Handler: index.createTodoHandler
      Layers:
        - !Ref LayerHelper
        - !Ref LayerTodoPut
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref TodoTable
      Environment:
        Variables:
          TODO_TABLE: !Ref TodoTable
      Events:
        CreateTodo:
          Type: Api
          Properties:
            Path: /todos
            Method: POST
```
On **lines 7 & 8** we have added our layers. These will be available for our function at the execution time.

If you look in the file `src/todo-by-id.ts`, we are only importing functions from the **helper** file. Therefore for our function **GetTodosFunction** we only need to add **LayerHelper** layer. Now update the import for all the todo files & add the required layers to all lambda functions in `template.yaml` file.

Now you can deploy your code and check if it is working as expected.

:::caution Check list
* For a single lambda function, we can only add up to 5 lambda layers.
* Total size of a lambda function should not exceed more than 250 MB including the size of all layers combined.
* If you want to use lambda layers to overcome the 250 MB size restriction, you are looking at the wrong place. You need to use container images that support up to 10GB of size.
:::