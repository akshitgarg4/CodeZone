const initialEditorState = {
    isEditorReady: false,
    editor: {
        selectedLanguageId: 19, // 19 is the id of javasctipt
        options: {
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: 'on',
            accessibilitySupport: 'auto',
            autoIndent: false,
            automaticLayout: true,
            codeLens: true,
            colorDecorators: true,
            contextmenu: true,
            cursorBlinking: 'blink',
            cursorStyle: 'line',
            dragAndDrop: false,
            formatOnPaste: false,
            formatOnType: false,
            readOnly: false,
            smoothScrolling: false,
        },
    },

    editorMode: 'editor',

    diffEditor: {
        selectedLanguageId: 19, // 19 is the id of javasctipt
    },
};

export default function editor(state = initialEditorState, action) {
    switch (action.type) {
        default:
            return state;
    }
}