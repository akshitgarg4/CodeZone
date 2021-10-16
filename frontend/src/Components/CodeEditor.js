import React, { useRef } from "react";
import { useState } from "react";
import Editor from "@monaco-editor/react";

function CodeEditor() {
    const editorRef = useRef(null);
    const [editorLanguage, setEditorLanguage] = useState("javascript")


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

    function onChangeHandler (event) {
        setEditorLanguage(event.target.value);
    };

    return (
    <>
        <h3>Editor Settings</h3>
        <label>Editor Language </label>
        <input
            type="text"
            name="name"
            onChange={onChangeHandler}
            value={editorLanguage}
        />
        <hr></hr>
        <Editor
            height="30vh"
            defaultLanguage= {editorLanguage}
            defaultValue="
            // Default Content
            "
            onMount={handleEditorDidMount}
            onChange={handleEditorChange}
        />
        <button onClick={showValue}>Submit Code</button>

    </>
    );
}

export default CodeEditor;



