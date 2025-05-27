import { Variable } from 'astal';
import SourceView from 'src/components/shared/SourceView';
import GtkSource from 'gi://GtkSource?version=3.0';

/**
 * Sets up the SourceView with JSON syntax highlighting and text change handling.
 * Configures the buffer, applies JSON language highlighting, and sets up event handlers
 * for text changes and synchronization with the editorText variable.
 * @param self - The SourceView instance
 * @param editorText - Variable containing the JSON text
 * @param onTextChange - Callback for text changes
 */
export function setupSourceView(
    self: SourceView,
    editorText: Variable<string>,
    onTextChange: (text: string) => void,
): void {
    const buffer = self.get_buffer();

    setupSyntaxHighlighting(buffer);
    setupTheme(buffer);
    setupTextHandling(self, buffer, editorText, onTextChange);
    setupEditorPreferences(self);

    setTimeout(() => self.grab_focus(), 100);
}

/**
 * Configures JSON syntax highlighting for the buffer
 * @param buffer - The GtkSource buffer
 */
function setupSyntaxHighlighting(buffer: GtkSource.Buffer): void {
    const langManager = GtkSource.LanguageManager.get_default();
    const jsonLang = langManager.get_language('json');

    if (jsonLang) {
        buffer.set_language(jsonLang);
    }
}

/**
 * Loads and applies the Tokyo Night theme
 * @param buffer - The GtkSource buffer
 */
function setupTheme(buffer: GtkSource.Buffer): void {
    const styleManager = GtkSource.StyleSchemeManager.get_default();

    const currentSearchPath = styleManager.get_search_path();
    const assetsPath = `${SRC_DIR}/assets`;
    styleManager.set_search_path([assetsPath, ...currentSearchPath]);

    const tokyoNight = styleManager.get_scheme('tokyo-night');

    if (tokyoNight) {
        buffer.set_style_scheme(tokyoNight);
    } else {
        const fallbackSchemes = ['solarized-dark', 'cobalt', 'oblivion'];
        for (const schemeName of fallbackSchemes) {
            const scheme = styleManager.get_scheme(schemeName);
            if (scheme) {
                buffer.set_style_scheme(scheme);
                console.debug(`Tokyo Night theme not found, using fallback: ${schemeName}`);
                break;
            }
        }
    }
}

/**
 * Sets up text handling and synchronization
 * @param self - The SourceView instance
 * @param buffer - The GtkSource buffer
 * @param editorText - Variable containing the JSON text
 * @param onTextChange - Callback for text changes
 */
function setupTextHandling(
    self: SourceView,
    buffer: GtkSource.Buffer,
    editorText: Variable<string>,
    onTextChange: (text: string) => void,
): void {
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
}

/**
 * Configures editor preferences like tab settings and indentation
 * @param self - The SourceView instance
 */
function setupEditorPreferences(self: SourceView): void {
    self.set_tab_width(2);
    self.set_insert_spaces_instead_of_tabs(true);
    self.set_auto_indent(true);
    self.set_smart_backspace(true);
    self.set_smart_home_end(GtkSource.SmartHomeEndType.AFTER);
}
