import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Church, Database } from "lucide-react";
import { useLocation } from "wouter";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import styles from "./auth-page.module.css";
import { seedDemoData } from "@/services/api";

// Login form schema
const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration form schema
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    bidderNumber: z.string().min(2, "Bidder number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage(): JSX.Element {
    const { user, loginMutation, registerMutation } = useAuth();
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [initializingDemo, setInitializingDemo] = useState(false);
    const [activeTab, setActiveTab] = useState("login");

    // Login form
    const loginForm = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Registration form
    const registerForm = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            bidderNumber: "",
            password: "",
        },
    });

    // Use useEffect for navigation
    useEffect(() => {
        if (user) {
            setLocation("/");
        }
    }, [user, setLocation]);

    // Initialize demo data
    const initializeDemoData = async () => {
        try {
            setInitializingDemo(true);
            await seedDemoData();
            toast({
                title: "Demo data initialized",
                description: "Demo bid data has been reset. You can now login with the demo accounts.",
                duration: 5000,
            });
        } catch (error) {
            toast({
                title: "Failed to initialize demo data",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            });
        } finally {
            setInitializingDemo(false);
        }
    };

    // Login form submission
    function onLoginSubmit(values: LoginFormValues) {
        loginMutation.mutate(values);
    }

    // Registration form submission
    function onRegisterSubmit(values: RegisterFormValues) {
        registerMutation.mutate(values);
    }

    return (
        <div className={styles.container}>
            {/* Left side - Forms */}
            <div className={styles.formContainer}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.iconContainer}>
                            <Church className={styles.icon} />
                        </div>
                        <h2 className={styles.cardTitle}>Offer Auction</h2>
                        <button type="button" onClick={initializeDemoData} disabled={initializingDemo} className={`${styles.button} ${styles.buttonOutline} ${styles.buttonSmall}`}>
                            {initializingDemo ? (
                                <span className={styles.flexRow}>
                                    <Loader2 className={`${styles.icon} ${styles.spinIcon}`} size={16} />
                                    <span>Initializing...</span>
                                </span>
                            ) : (
                                <span className={styles.flexRow}>
                                    <Database size={16} />
                                    <span>Initialize Demo Data</span>
                                </span>
                            )}
                        </button>
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
                                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="email" className={styles.label}>
                                            Email
                                        </label>
                                        <input id="email" type="email" placeholder="you@example.com" className={styles.input} {...loginForm.register("email")} />
                                        {loginForm.formState.errors.email && <div className={styles.errorMessage}>{loginForm.formState.errors.email.message}</div>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="password" className={styles.label}>
                                            Password
                                        </label>
                                        <input id="password" type="password" placeholder="••••••••" className={styles.input} {...loginForm.register("password")} />
                                        {loginForm.formState.errors.password && <div className={styles.errorMessage}>{loginForm.formState.errors.password.message}</div>}
                                    </div>

                                    <button type="submit" className={styles.button} disabled={loginMutation.isPending}>
                                        {loginMutation.isPending ? (
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
                                                    loginForm.setValue("email", "admin@example.com");
                                                    loginForm.setValue("password", "admin123");
                                                    loginForm.handleSubmit(onLoginSubmit)();
                                                }}
                                            >
                                                Admin Demo
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.button} ${styles.buttonOutline}`}
                                                onClick={() => {
                                                    loginForm.setValue("email", "bidder@example.com");
                                                    loginForm.setValue("password", "bidder123");
                                                    loginForm.handleSubmit(onLoginSubmit)();
                                                }}
                                            >
                                                Bidder Demo
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Registration Form */}
                            <div className={`${styles.tabContent} ${activeTab === "register" ? styles.active : ""}`}>
                                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="name" className={styles.label}>
                                            Full Name
                                        </label>
                                        <input id="name" type="text" placeholder="John Smith" className={styles.input} {...registerForm.register("name")} />
                                        {registerForm.formState.errors.name && <div className={styles.errorMessage}>{registerForm.formState.errors.name.message}</div>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="reg-email" className={styles.label}>
                                            Email
                                        </label>
                                        <input id="reg-email" type="email" placeholder="you@example.com" className={styles.input} {...registerForm.register("email")} />
                                        {registerForm.formState.errors.email && <div className={styles.errorMessage}>{registerForm.formState.errors.email.message}</div>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="phone" className={styles.label}>
                                            Phone Number
                                        </label>
                                        <input id="phone" type="tel" placeholder="(555) 123-4567" className={styles.input} {...registerForm.register("phone")} />
                                        {registerForm.formState.errors.phone && <div className={styles.errorMessage}>{registerForm.formState.errors.phone.message}</div>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="bidderNumber" className={styles.label}>
                                            Bidder Number
                                        </label>
                                        <input id="bidderNumber" type="text" placeholder="B123" className={styles.input} {...registerForm.register("bidderNumber")} />
                                        {registerForm.formState.errors.bidderNumber && <div className={styles.errorMessage}>{registerForm.formState.errors.bidderNumber.message}</div>}
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="reg-password" className={styles.label}>
                                            Password
                                        </label>
                                        <input id="reg-password" type="password" placeholder="••••••••" className={styles.input} {...registerForm.register("password")} />
                                        {registerForm.formState.errors.password && <div className={styles.errorMessage}>{registerForm.formState.errors.password.message}</div>}
                                    </div>

                                    <button type="submit" className={styles.button} disabled={registerMutation.isPending}>
                                        {registerMutation.isPending ? (
                                            <span className={styles.flexRow}>
                                                <Loader2 className={styles.spinIcon} size={16} />
                                                <span>Registering...</span>
                                            </span>
                                        ) : (
                                            "Register"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Hero */}
            <div className={styles.heroContainer}>
                <h1 className={styles.heroTitle}>Welcome to Offer Auction</h1>
                <p className={styles.heroDesc}>Participate in our silent auction to support our community projects. Browse items, place bids, and track your auction activity all in one place.</p>
                <ul className={styles.stepsList}>
                    <li className={styles.stepItem}>
                        <div className={styles.stepNumber}>1</div>
                        <span>Create an account or login</span>
                    </li>
                    <li className={styles.stepItem}>
                        <div className={styles.stepNumber}>2</div>
                        <span>Browse available auction items</span>
                    </li>
                    <li className={styles.stepItem}>
                        <div className={styles.stepNumber}>3</div>
                        <span>Place bids on your favorite items</span>
                    </li>
                    <li className={styles.stepItem}>
                        <div className={styles.stepNumber}>4</div>
                        <span>Track your bids and winning items</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
