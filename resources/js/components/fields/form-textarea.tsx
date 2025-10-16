import React, { type JSX } from "react";
import styles from "../AdminDashboard.module.css";

interface FormTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    errors: string[] | undefined[];
}

export function FormTextarea({ value, onChange, placeholder, errors }: FormTextareaProps): JSX.Element {
    return (
        <>
            <textarea className={styles.formInput} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
            {errors.length > 0 && <div className={styles.formError}>{errors[0]}</div>}
        </>
    );
}
