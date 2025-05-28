import { Gtk } from 'astal/gtk3';
import { JsonEditorProps } from './types';
import SourceView from 'src/components/shared/SourceView';
import { handleKeyPress, setupSourceView } from './helpers';

export const JsonEditor = ({ editorText, onSave, onTextChange }: JsonEditorProps): JSX.Element => {
    return (
        <scrollable
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            className="json-editor-scrollable-container"
        >
            <SourceView
                className="json-editor-sourceview"
                monospace
                editable={true}
                canFocus={true}
                wrapMode={Gtk.WrapMode.NONE}
                showLineNumbers={true}
                highlightCurrentLine={true}
                onKeyPressEvent={(self, event) => handleKeyPress(self, event, onSave)}
                setup={(self) => setupSourceView(self, editorText, onTextChange)}
            />
        </scrollable>
    );
};
