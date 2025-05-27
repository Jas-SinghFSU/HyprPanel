import { Gdk } from 'astal/gtk3';
import SourceView from 'src/components/shared/SourceView';

/**
 * Handles key press events for the JSON editor.
 * Triggers save on Ctrl+Enter combination.
 * @param self - The SourceView instance
 * @param event - The key press event
 * @param onSave - Callback to save the content
 */
export function handleKeyPress(self: SourceView, event: Gdk.Event, onSave: (text: string) => void): boolean {
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
