import { type JSX } from "react";
import styles from "../AdminDashboard.module.css";

interface FormInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    errors: string[] | undefined[];
}

export function FormInput({ value, onChange, placeholder, errors }: FormInputProps): JSX.Element {
    return (
        <>
            <input className={styles.formInput} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
            {errors.length > 0 && <div className={styles.formError}>{errors[0]}</div>}
        </>
    );
}
