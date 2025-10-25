import { type JSX } from "react";
import sharedStyles from "./Fields.module.css";
import styles from "./FormTextarea.module.css";

interface FormTextareaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    errors?: string[] | undefined[];
    required?: boolean;
}

export function FormTextarea({
    label,
    value,
    onChange,
    placeholder,
    errors = [],
    required = false,
}: FormTextareaProps): JSX.Element {
    return (
        <div className={sharedStyles.formGroup}>
            <label className={sharedStyles.formLabel}>
                {label}
                {required && <span className={sharedStyles.requiredMark}>*</span>}
            </label>
            <textarea
                className={`${sharedStyles.formInput} ${styles.formTextarea}`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {errors.length > 0 && <div className={sharedStyles.formError}>{errors[0]}</div>}
        </div>
    );
}
