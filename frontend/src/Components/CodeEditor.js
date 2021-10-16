import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

function CodeEditor() {
    const editorRef = useRef(null);

    function handleEditorChange(value, event) {
        // Onchange Prop
        console.log("here is the current model value:", value);
    }

    function handleEditorDidMount(editor, monaco) {
        // Editor instance
        editorRef.current = editor;
    }

    function showValue() {
        // Instance on submit button
        alert(editorRef.current.getValue());
        console.log(editorRef.current.getValue());
    }

    return (
    <>
        <button onClick={showValue}>Submit Code</button>
        <Editor
            height="100vh"
            defaultLanguage="javascript"
            defaultValue="// Default Content Start Typing"
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
        />
    </>
    );
}

export default CodeEditor;


