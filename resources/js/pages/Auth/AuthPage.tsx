import { type JSX, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Church } from "lucide-react";
import styles from "./AuthPage.module.css";
import type { PageProps } from "@/types";
import Login from "./Login";
import Register from "./Register";

export default function AuthPage({ auth }: PageProps): JSX.Element {
    const [activeTab, setActiveTab] = useState("login");

    // Redirect if already logged in
    if (auth.user) {
        router.visit("/");
        return <></>;
    }

    return (
        <>
            <Head title="Login / Register" />
            <div className={styles.container}>
                {/* Left side - Forms */}
                <div className={styles.formContainer}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconContainer}>
                                <Church className={styles.icon} />
                            </div>
                            <h2 className={styles.cardTitle}>Offer Auction</h2>
                        </div>

                        <div className={styles.cardContent}>
                            <div className={styles.tabContainer}>
                                <div className={styles.tabList}>
                                    <button type="button" className={`${styles.tabTrigger} ${activeTab === "login" ? styles.active : ""}`} onClick={() => setActiveTab("login")}>
                                        Login
                                    </button>
                                    <button type="button" className={`${styles.tabTrigger} ${activeTab === "register" ? styles.active : ""}`} onClick={() => setActiveTab("register")}>
                                        Register
                                    </button>
                                </div>

                                {/* Login Form */}
                                <div className={`${styles.tabContent} ${activeTab === "login" ? styles.active : ""}`}>
                                    <Login />
                                </div>

                                {/* Registration Form */}
                                <div className={`${styles.tabContent} ${activeTab === "register" ? styles.active : ""}`}>
                                    <Register />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Hero */}
                <div className={styles.heroContainer}>
                    <h1 className={styles.heroTitle}>Welcome to Offer Auction</h1>
                    <p className={styles.heroDesc}>
                        We get it. Nonprofit auction software <i>sucks</i>. <b>We&apos;re here to change that.</b>
                        <br />
                        Our platform is designed to make it easy for nonprofits to create and manage fundraisers, while also providing a seamless experience for bidders.
                    </p>
                    <ul className={styles.stepsList}>
                        <li className={styles.stepItem}>
                            <div className={styles.stepNumber}>1</div>
                            <span>Create an account or login</span>
                        </li>
                        <li className={styles.stepItem}>
                            <div className={styles.stepNumber}>2</div>
                            <span>Browse available auction items & track sales</span>
                        </li>
                        <li className={styles.stepItem}>
                            <div className={styles.stepNumber}>3</div>
                            <span>Manage users and build reports</span>
                        </li>
                        <li className={styles.stepItem}>
                            <div className={styles.stepNumber}>4</div>
                            <span>Make life just a little bit easier</span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
