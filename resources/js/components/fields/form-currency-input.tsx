import { type JSX } from "react";
import styles from "../AdminDashboard.module.css";

interface FormCurrencyInputProps {
    value: number | undefined;
    onChange: (value: number) => void;
    placeholder?: string;
    errors: string[] | undefined[];
}

export function FormCurrencyInput({ value, onChange, placeholder, errors }: FormCurrencyInputProps): JSX.Element {
    return (
        <>
            <div className={styles.currencyInput}>
                <span className={styles.currencySymbol}>$</span>
                <input className={styles.formInput} type="number" placeholder={placeholder} value={value || ""} onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : 0)} />
            </div>
            {errors.length > 0 && <div className={styles.formError}>{errors[0]}</div>}
        </>
    );
}
