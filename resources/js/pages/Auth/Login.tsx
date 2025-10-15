import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import styles from './auth.module.css';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <h1 className={styles.authTitle}>Welcome Back</h1>
                    <p className={styles.authSubtitle}>Sign in to your auction account</p>

                    <form onSubmit={submit} className={styles.authForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.formLabel}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={styles.formInput}
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <div className={styles.formError}>{errors.email}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.formLabel}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className={styles.formInput}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && (
                                <div className={styles.formError}>{errors.password}</div>
                            )}
                        </div>

                        <div className={styles.checkboxGroup}>
                            <input
                                id="remember"
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                className={styles.checkboxInput}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <label htmlFor="remember" className={styles.checkboxLabel}>
                                Remember me
                            </label>
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={processing}>
                            {processing ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className={styles.authFooter}>
                        Don&apos;t have an account? <Link href="/register">Register here</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
