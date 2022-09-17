import React, { useState } from 'react';
import CodeBlock from '@theme/CodeBlock';

export default function CodeViewer(props: {
  url: string,
  language: string,
  title: string,
  start?: number,
  end?: number,
}): JSX.Element {

  const {
    url,
    language,
    title,
    start,
    end
  } = props;

  const [code, setCode] = useState(`fetching...`);

  fetch(url)
    .then(req => req.text())
    .then(txt => {
      const txtArr = txt.split('\n');
      const startIndex = start ? start - 1 : -1;
      const endIndex = end ? end - 1 : txtArr.length;
      txt = txtArr.filter((_, i) => (i >= startIndex && i <= endIndex)).join('\n');
      setCode(txt);
    });

  return (
    <CodeBlock
      language={language}
      title={title}
      showLineNumbers
    >
      {code}
    </CodeBlock>
  );
}