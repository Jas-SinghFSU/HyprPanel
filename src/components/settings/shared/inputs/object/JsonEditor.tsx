import { Gtk, Gdk } from 'astal/gtk3';
import TextView from 'src/components/shared/TextView';
import { JsonEditorProps } from './types';
import { Variable } from 'astal';

export const JsonEditor = ({
    editorText,
    onSave,
    onTextChange,
    className = '',
}: JsonEditorProps): JSX.Element => {
    return (
        <scrollable
            className={`json-editor-scrollable ${className}`}
            vscroll={Gtk.PolicyType.AUTOMATIC}
            hscroll={Gtk.PolicyType.AUTOMATIC}
            css="min-height: 300px;"
        >
            <TextView
                className="json-editor-textview"
                monospace
                editable={true}
                canFocus={true}
                wrapMode={Gtk.WrapMode.NONE}
                leftMargin={15}
                rightMargin={15}
                topMargin={10}
                bottomMargin={10}
                css="background-color: rgba(0, 0, 0, 0.3); border-radius: 4px; font-size: 0.95em;"
                onKeyPressEvent={(self, event) => handleKeyPress(self, event, onSave)}
                setup={(self) => setupTextView(self, editorText, onTextChange)}
            />
        </scrollable>
    );
};

function handleKeyPress(self: TextView, event: Gdk.Event, onSave: (text: string) => void): boolean {
    const [, keyval] = event.get_keyval();
    const modifiers = event.get_state()[1];

    const ENTER_KEY = 65293;
    if (keyval === ENTER_KEY && modifiers & Gdk.ModifierType.CONTROL_MASK) {
        const buffer = self.get_buffer();
        const [start, end] = buffer.get_bounds();
        const text = buffer.get_text(start, end, true);
        onSave(text);
        return true;
    }
    return false;
}

function setupTextView(
    self: TextView,
    editorText: Variable<string>,
    onTextChange: (text: string) => void,
): void {
    const buffer = self.get_buffer();

    buffer.set_text(editorText.get(), -1);

    buffer.connect('changed', () => {
        const [start, end] = buffer.get_bounds();
        const currentText = buffer.get_text(start, end, true);
        onTextChange(currentText);
    });

    self.hook(editorText, () => {
        const currentBuffer = self.get_buffer();
        const [start, end] = currentBuffer.get_bounds();
        const currentText = currentBuffer.get_text(start, end, true);

        if (currentText !== editorText.get()) {
            currentBuffer.set_text(editorText.get(), -1);
        }
    });

    setTimeout(() => self.grab_focus(), 100);
}
