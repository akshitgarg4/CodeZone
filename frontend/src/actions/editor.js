const setIsEditorReady = ({ state }, isReady) => {
    state.isEditorReady = isReady;
};

const setEditorMode = ({ state }, editorMode) => {
    state.editorMode = editorMode;
};

const setSelectedLanguageId = type => ({ state }, id) => {
    state[type].selectedLanguageId = id;
};

const editor = {
    setSelectedLanguageId: setSelectedLanguageId('editor'),
    setOptions({ state }, options) {
        state.editor.options = options;
    },
    setMonacoTheme({ state }, theme) {
        state.monacoTheme = theme;
    },
};

const diffEditor = {
    setSelectedLanguageId: setSelectedLanguageId('diffEditor'),
};

export {
    setEditorMode,
    setIsEditorReady,
    editor, diffEditor,
};
