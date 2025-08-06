import { Binding, Variable } from 'astal';
import { Opt } from 'src/lib/options';

export interface ObjectInputterProps<T> {
    opt: Opt<T>;
    isUnsaved: Variable<boolean>;
    className: string;
}

export interface JsonEditorState {
    jsonError: Variable<string>;
    showEditor: Variable<boolean>;
    editorText: Variable<string>;
}

export interface JsonEditorHook extends JsonEditorState {
    handleOpen: () => void;
    handleSave: () => void;
    handleTextChange: (text: string) => void;
    validateJson: (text: string) => boolean;
}

export interface JsonPreviewProps {
    value: Binding<unknown>;
    onClick: () => void;
    isExpanded: Binding<boolean>;
}

export interface JsonEditorProps {
    editorText: Variable<string>;
    jsonError: Variable<string>;
    onSave: (text: string) => void;
    onTextChange: (text: string) => void;
    className?: string;
}

export interface EditorControlsProps {
    jsonError: Variable<string>;
    onSave: () => void;
}
