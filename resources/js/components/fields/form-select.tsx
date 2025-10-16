import React, { type JSX, ReactNode } from "react";
import styles from "../AdminDashboard.module.css";

interface FormSelectProps<T> {
    value: string;
    onChange: (value: T) => void;
    children: ReactNode;
    errors: string[] | undefined[];
}

export function FormSelect<T>({ value, onChange, children, errors }: FormSelectProps<T>): JSX.Element {
    return (
        <>
            <select className={styles.formInput} value={value} onChange={(e) => onChange(e.target.value as T)}>
                {children}
            </select>
            {errors.length > 0 && <div className={styles.formError}>{errors[0]}</div>}
        </>
    );
}
