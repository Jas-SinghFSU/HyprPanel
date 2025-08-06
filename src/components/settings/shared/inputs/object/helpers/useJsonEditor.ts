import { Variable } from 'astal';
import { Opt } from 'src/lib/options';
import { JsonEditorHook } from '../types';

/**
 * Custom hook for managing JSON editor state and logic
 *
 * Handles JSON parsing, validation, and synchronization
 * between the editor and the option value
 */
export function useJsonEditor<T>(opt: Opt<T>, isUnsaved: Variable<boolean>): JsonEditorHook {
    const jsonError = Variable<string>('');
    const showEditor = Variable<boolean>(false);
    const editorText = Variable<string>(JSON.stringify(opt.get(), null, 2));

    /**
     * Validates JSON and updates error state
     */
    const validateJson = (text: string): boolean => {
        try {
            JSON.parse(text || '{}');
            jsonError.set('');
            return true;
        } catch (error) {
            if (error instanceof Error) {
                jsonError.set(`Invalid JSON: ${error.message}`);
            }
            return false;
        }
    };

    /**
     * Opens the editor and syncs current value
     */
    const handleOpen = (): void => {
        editorText.set(JSON.stringify(opt.get(), null, 2));
        showEditor.set(!showEditor.get());
        jsonError.set('');
    };

    /**
     * Saves valid JSON and closes editor
     */
    const handleSave = (): void => {
        const text = editorText.get();
        if (validateJson(text)) {
            try {
                const parsedValue = JSON.parse(text || '{}');
                opt.set(parsedValue);
                isUnsaved.set(false);
                showEditor.set(false);
            } catch (error) {
                console.error('Unexpected error saving JSON:', error);
            }
        }
    };

    /**
     * Handles text changes in the editor
     */
    const handleTextChange = (text: string): void => {
        editorText.set(text);
        validateJson(text);

        const serializedOpt = JSON.stringify(opt.get(), null, 2);
        isUnsaved.set(text !== serializedOpt);
    };

    opt.subscribe(() => {
        const newText = JSON.stringify(opt.get(), null, 2);
        editorText.set(newText);
        isUnsaved.set(false);
        jsonError.set('');
    });

    return {
        jsonError,
        showEditor,
        editorText,
        handleOpen,
        handleSave,
        handleTextChange,
        validateJson,
    };
}
