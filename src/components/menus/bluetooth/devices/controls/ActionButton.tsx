import { Binding } from 'astal';
import { ButtonProps } from 'astal/gtk3/widget';

export const ActionButton = ({ name = '', tooltipText = '', label = '', ...props }: ActionButtonProps): JSX.Element => {
    return (
        <button className={`menu-icon-button ${name} bluetooth`} {...props}>
            <label
                className={`menu-icon-button-label ${name} bluetooth txt-icon`}
                tooltipText={tooltipText}
                label={label}
            />
        </button>
    );
};

interface ActionButtonProps extends ButtonProps {
    name: string;
    tooltipText: string | Binding<string>;
    label: string | Binding<string>;
}
