import { type JSX, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { ChevronDown, LogOut, Menu, X, Church } from "lucide-react";
import { User, PageProps } from "@/types";
import styles from "./header.module.css";

interface HeaderProps {
    user: User | null;
}

export default function Header({ user }: HeaderProps): JSX.Element {
    const { settings } = usePage<PageProps>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        router.post("/logout");
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <Church className={styles.logoIcon} />
                    <h1 className={styles.logoText}>{settings.event_name}</h1>
                </div>

                {user && (
                    <div className={styles.userInfoDesktop}>
                        <span className={styles.welcomeText}>Welcome, {user.name}</span>
                        <span className={styles.bidderBadge}>Bidder #{user.bidder_number}</span>

                        <div className={styles.dropdownMenu}>
                            <button className={styles.dropdownButton} onClick={toggleDropdown} aria-haspopup="true" aria-expanded={dropdownOpen}>
                                <ChevronDown size={16} />
                            </button>
                            <div className={`${styles.dropdownContent} ${dropdownOpen ? styles.open : ""}`}>
                                {user.role === "admin" && (
                                    <Link href="/admin" className={styles.dropdownItem}>
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutButton}`}>
                                    <LogOut size={16} className={styles.menuIcon} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button className={styles.mobileMenuButton} onClick={toggleMobileMenu} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>
                    {mobileMenuOpen ? <X className={styles.mobileMenuIcon} /> : <Menu className={styles.mobileMenuIcon} />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && user && (
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileMenuContainer}>
                        <div className={styles.mobileMenuContent}>
                            <div className={styles.userInfoMobile}>
                                <span className={styles.welcomeText}>{user.name}</span>
                                <span className={styles.bidderBadge}>Bidder #{user.bidder_number}</span>
                            </div>
                            <hr className={styles.divider} />
                            {user.role === "admin" && (
                                <Link href="/admin" className={styles.menuLink}>
                                    Admin Dashboard
                                </Link>
                            )}
                            <button onClick={handleLogout} className={`${styles.menuButton} ${styles.logoutButton}`}>
                                <LogOut size={16} className={styles.menuIcon} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
