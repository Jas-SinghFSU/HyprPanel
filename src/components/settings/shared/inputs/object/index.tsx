import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import icons from 'src/lib/icons/icons';
import { ObjectInputterProps } from './types';
import { JsonPreview } from './JsonPreview';
import { JsonEditor } from './JsonEditor';
import { EditorControls } from './EditorControls';
import { useJsonEditor } from './helpers';

export const ObjectInputter = <T extends string | number | boolean | object>({
    opt,
    isUnsaved,
    className,
}: ObjectInputterProps<T>): JSX.Element => {
    const { jsonError, showEditor, editorText, handleOpen, handleSave, handleTextChange } = useJsonEditor(
        opt,
        isUnsaved,
    );

    return (
        <box className="object-input-container" vertical>
            <box className="unsaved-icon-container">
                {bind(isUnsaved).as((unsaved) =>
                    unsaved ? (
                        <icon
                            className="unsaved-icon"
                            icon={icons.ui.warning}
                            tooltipText="Unsaved changes"
                        />
                    ) : (
                        <box />
                    ),
                )}
                <JsonPreview value={bind(opt)} onClick={handleOpen} isExpanded={bind(showEditor)} />
            </box>

            <revealer
                revealChild={bind(showEditor)}
                transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                transitionDuration={200}
            >
                <box className="json-editor-wrapper" vertical>
                    <JsonEditor
                        editorText={editorText}
                        jsonError={jsonError}
                        onSave={handleSave}
                        onTextChange={handleTextChange}
                        className={className}
                    />

                    <EditorControls jsonError={jsonError} onSave={handleSave} />
                </box>
            </revealer>
        </box>
    );
};
