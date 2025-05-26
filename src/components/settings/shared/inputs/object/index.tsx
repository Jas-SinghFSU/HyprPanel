import { bind } from 'astal';
import { Gtk } from 'astal/gtk3';
import icons from 'src/lib/icons/icons';
import { ObjectInputterProps } from './types';
import { JsonPreview } from './JsonPreview';
import { JsonEditor } from './JsonEditor';
import { EditorControls } from './EditorControls';
import { useJsonEditor } from './useJsonEditor';

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
        <box vertical className="object-inputter">
            <box className="object-input-container">
                <box className="unsaved-icon-container" hexpand>
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
                    <JsonPreview
                        value={bind(opt).get()}
                        onClick={handleOpen}
                        isExpanded={bind(showEditor).get()}
                    />
                </box>
            </box>

            <revealer
                revealChild={bind(showEditor)}
                transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                transitionDuration={200}
            >
                <box
                    className="json-editor-container"
                    vertical
                    css="margin-top: 10px; padding: 15px; background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;"
                >
                    <label
                        className="json-editor-title"
                        label="Editor"
                        halign={Gtk.Align.START}
                        css="font-weight: bold; font-size: 1.1em; margin-bottom: 10px; color: rgba(255, 255, 255, 0.9);"
                    />

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
