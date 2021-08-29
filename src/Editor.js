import "remirror/styles/all.css";

import React from "react";
import { NotesEditor } from "./NotesEditor";

export function Editor({ content, isEditing }) {
  return (
    <NotesEditor
      placeholder="Start typing..."
      content={content}
      editable={isEditing}
    />
  );
}
