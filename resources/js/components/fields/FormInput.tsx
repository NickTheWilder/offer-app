import { type JSX } from "react";
import sharedStyles from "./Fields.module.css";

interface FormInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    errors?: string[] | undefined[];
    required?: boolean;
}

export function FormInput({
    label,
    value,
    onChange,
    placeholder,
    errors = [],
    required = false,
}: FormInputProps): JSX.Element {
    return (
        <div className={sharedStyles.formGroup}>
            <label className={sharedStyles.formLabel}>
                {label}
                {required && <span className={sharedStyles.requiredMark}>*</span>}
            </label>
            <input
                className={sharedStyles.formInput}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {errors.length > 0 && <div className={sharedStyles.formError}>{errors[0]}</div>}
        </div>
    );
}
