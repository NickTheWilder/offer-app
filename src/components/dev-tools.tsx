import { useState, useEffect } from "react";
import type { JSX } from "react";
import styles from "./dev-tools.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let currentForm: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function setCurrentForm(form: any): void {
    currentForm = form;
}

export function clearCurrentForm(): void {
    currentForm = null;
}

export function DevTools(): JSX.Element | null {
    const [isOpen, setIsOpen] = useState(false);
    const [, forceUpdate] = useState({});

    // Force re-render to show live form state
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            forceUpdate({});
        }, 200);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.floatingButton}
                title="Form Dev Tools"
            >
                Dev
            </button>

            {/* Dev tools panel */}
            {isOpen && (
                <div className={styles.panel}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>
                            Form Dev Tools
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={styles.closeButton}
                        >
                            ×
                        </button>
                    </div>

                    <div className={styles.content}>
                        {!currentForm ? (
                            <p className={styles.noFormMessage}>
                                No form active
                            </p>
                        ) : (
                            <div className={styles.formStateContainer}>
                                <pre className={styles.formStateJson}>
                                    {JSON.stringify(currentForm.state, (key, value) => {
                                        if (value instanceof File) {
                                            return `[File: ${value.name} (${value.size} bytes)]`;
                                        }
                                        if (value instanceof FileList) {
                                            return `[FileList: ${value.length} files]`;
                                        }
                                        return value;
                                    }, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
