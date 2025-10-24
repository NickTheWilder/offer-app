import { type JSX } from "react";
import sharedStyles from "./Fields.module.css";
import styles from "./FormCurrencyInput.module.css";

interface FormCurrencyInputProps {
    label: string;
    value: number | undefined;
    onChange: (value: number) => void;
    placeholder?: string;
    errors?: string[] | undefined[];
    required?: boolean;
}

export function FormCurrencyInput({ label, value, onChange, placeholder, errors = [], required = false }: FormCurrencyInputProps): JSX.Element {
    return (
        <div className={sharedStyles.formGroup}>
            <label className={sharedStyles.formLabel}>
                {label}
                {required && <span className={sharedStyles.requiredMark}>*</span>}
            </label>
            <div className={styles.currencyInput}>
                <span className={styles.currencySymbol}>$</span>
                <input className={sharedStyles.formInput} type="number" placeholder={placeholder} value={value || ""} onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : 0)} />
            </div>
            {errors.length > 0 && <div className={sharedStyles.formError}>{errors[0]}</div>}
        </div>
    );
}
