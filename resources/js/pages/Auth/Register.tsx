import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import styles from './auth.module.css';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <>
            <Head title="Register" />
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <h1 className={styles.authTitle}>Create Account</h1>
                    <p className={styles.authSubtitle}>Join the auction to start bidding</p>

                    <form onSubmit={submit} className={styles.authForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.formLabel}>
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className={styles.formInput}
                                autoComplete="name"
                                autoFocus
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <div className={styles.formError}>{errors.name}</div>}
                        </div>

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
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <div className={styles.formError}>{errors.email}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.formLabel}>
                                Phone Number (Optional)
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={data.phone}
                                className={styles.formInput}
                                autoComplete="tel"
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            {errors.phone && <div className={styles.formError}>{errors.phone}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="address" className={styles.formLabel}>
                                Address (Optional)
                            </label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                value={data.address}
                                className={styles.formInput}
                                autoComplete="street-address"
                                onChange={(e) => setData('address', e.target.value)}
                            />
                            {errors.address && <div className={styles.formError}>{errors.address}</div>}
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
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <div className={styles.formError}>{errors.password}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password_confirmation" className={styles.formLabel}>
                                Confirm Password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className={styles.formInput}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            {errors.password_confirmation && (
                                <div className={styles.formError}>{errors.password_confirmation}</div>
                            )}
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={processing}>
                            {processing ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className={styles.authFooter}>
                        Already have an account?{' '}
                        <Link href="/login">Sign in here</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
