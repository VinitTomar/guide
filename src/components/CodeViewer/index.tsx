import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';

export default function CodeViewer(): JSX.Element {

  const [code, setCode] = useState(`function HelloCodeTitle(props) {
      return <h1>Hello vin, {props.name}</h1>;
    }`);

  const prom = fetch('https://gist.githubusercontent.com/VinitTomar/20f73b09dfc9980ce7aa235119ebdd44/raw/af32a6368e27468d385b87dbc42dd0e0aeddfb07/Todo_with_BehaviorSubject.ts');
  prom.then(req => req.text()).then(txt => setCode(txt));

  return (<CodeBlock
    language="jsx"
    title="/src/components/HelloCodeTitle.js"
    showLineNumbers>
    {code}
  </CodeBlock>
  );
}