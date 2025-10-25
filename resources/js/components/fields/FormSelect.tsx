import { type JSX, ReactNode } from "react";
import sharedStyles from "./Fields.module.css";
import styles from "./FormSelect.module.css";

interface FormSelectProps<T> {
    label: string;
    value: string;
    onChange: (value: T) => void;
    children: ReactNode;
    errors?: string[] | undefined[];
    required?: boolean;
}

export function FormSelect<T>({
    label,
    value,
    onChange,
    children,
    errors = [],
    required = false,
}: FormSelectProps<T>): JSX.Element {
    return (
        <div className={sharedStyles.formGroup}>
            <label className={sharedStyles.formLabel}>
                {label}
                {required && <span className={sharedStyles.requiredMark}>*</span>}
            </label>
            <select
                className={styles.formInput}
                value={value}
                onChange={(e) => onChange(e.target.value as T)}
            >
                {children}
            </select>
            {errors.length > 0 && <div className={sharedStyles.formError}>{errors[0]}</div>}
        </div>
    );
}
