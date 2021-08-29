import "prosemirror-view/style/prosemirror.css";

import React from "react";
import { useProseMirror, ProseMirror } from "use-prosemirror";

import { schema, defaultMarkdownParser } from "prosemirror-markdown";
import { exampleSetup } from "prosemirror-example-setup";

export function Editor({ content, isEditing }) {
  const [state, setState] = useProseMirror({
    doc: defaultMarkdownParser.parse(content),
    plugins: exampleSetup({ schema, menuBar: false })
  });
  return (
    <ProseMirror state={state} onChange={setState} editable={() => isEditing} />
  );
}
