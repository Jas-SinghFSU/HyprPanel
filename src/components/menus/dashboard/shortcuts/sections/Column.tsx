import { BindableChild } from 'astal/gtk3/astalify';

export const LeftColumn = ({ visibleClass, children }: LeftColumnProps): JSX.Element => {
    return (
        <box className={`card-button-section-container ${visibleClass ? 'visible' : ''}`}>
            {visibleClass ? (
                <box vertical hexpand vexpand>
                    {children}
                </box>
            ) : (
                <box />
            )}
        </box>
    );
};

export const RightColumn = ({ children }: RightColumnProps): JSX.Element => {
    return (
        <box className={`card-button-section-container`}>
            <box vertical hexpand vexpand>
                {children}
            </box>
        </box>
    );
};

interface LeftColumnProps {
    visibleClass?: boolean;
    children?: BindableChild | BindableChild[];
}

interface RightColumnProps {
    children?: BindableChild | BindableChild[];
}
