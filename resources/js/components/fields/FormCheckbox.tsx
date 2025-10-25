import { type JSX } from "react";
import sharedStyles from "./Fields.module.css";
import styles from "./FormCheckbox.module.css";

interface FormCheckboxProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    description?: string;
    errors?: string[] | undefined[];
}

export function FormCheckbox({ label, value, onChange, description, errors = [] }: FormCheckboxProps): JSX.Element {
    return (
        <div className={sharedStyles.formGroup}>
            <label className={sharedStyles.formLabel}>{label}</label>
            <label className={styles.checkboxLabel}>
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                />
                {description}
            </label>
            {errors.length > 0 && <div className={sharedStyles.formError}>{errors[0]}</div>}
        </div>
    );
}
