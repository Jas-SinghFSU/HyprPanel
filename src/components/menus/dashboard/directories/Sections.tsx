import { BindableChild } from 'astal/gtk3/astalify';

export const LeftSection = ({ children }: SectionProps): JSX.Element => {
    return (
        <box className={'section left'} vertical expand>
            {children}
        </box>
    );
};

export const RightSection = ({ children }: SectionProps): JSX.Element => {
    return (
        <box className={'section right'} vertical expand>
            {children}
        </box>
    );
};

interface SectionProps {
    children?: BindableChild | BindableChild[];
}
