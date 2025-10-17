import { router, useForm } from "@inertiajs/react";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import styles from "./AuthPage.module.css";

export default function Login() {
    const loginForm = useForm({
        email: "",
        password: "",
    });

    // Login form submission
    const onLoginSubmit = (e: FormEvent) => {
        e.preventDefault();
        loginForm.post("/login");
    };

    return (
        <form onSubmit={onLoginSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                    Email
                </label>
                <input id="email" type="email" placeholder="you@example.com" className={styles.input} value={loginForm.data.email} onChange={(e) => loginForm.setData("email", e.target.value)} />
                {loginForm.errors.email && <span className={styles.error}>{loginForm.errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                    Password
                </label>
                <input id="password" type="password" placeholder="••••••••" className={styles.input} value={loginForm.data.password} onChange={(e) => loginForm.setData("password", e.target.value)} />
                {loginForm.errors.password && <span className={styles.error}>{loginForm.errors.password}</span>}
            </div>

            <button type="submit" className={styles.button} disabled={loginForm.processing}>
                {loginForm.processing ? (
                    <span className={styles.flexRow}>
                        <Loader2 className={styles.spinIcon} size={16} />
                        <span>Logging in...</span>
                    </span>
                ) : (
                    "Login"
                )}
            </button>

            <div className={styles.demoAccountsContainer}>
                <p className={styles.demoAccountsTitle}>Demo Accounts</p>
                <div className={styles.demoButtonsGrid}>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.buttonOutline}`}
                        onClick={() => {
                            router.post("/login", {
                                email: "admin@example.com",
                                password: "password",
                            });
                        }}
                    >
                        Admin Demo
                    </button>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.buttonOutline}`}
                        onClick={() => {
                            router.post("/login", {
                                email: "john@example.com",
                                password: "password",
                            });
                        }}
                    >
                        Bidder Demo
                    </button>
                </div>
            </div>
        </form>
    );
}
