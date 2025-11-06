import { type JSX, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import styles from "./SystemDashboard.module.css";
import sharedStyles from "../AdminDashboard.module.css";

export function SystemDashboard(): JSX.Element {
    const { settings } = usePage<PageProps>().props;

    const [formData, setFormData] = useState({
        event_name: settings.event_name,
        event_location: settings.event_location || "",
        primary_color: settings.primary_color,
        preview_mode: settings.preview_mode,
        auction_start: settings.auction_start ? settings.auction_start.slice(0, 16) : "",
        auction_end: settings.auction_end ? settings.auction_end.slice(0, 16) : "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.put("/admin/settings", formData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                router.visit("/admin?tab=system");
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className={styles.systemDashboard}>
            <form onSubmit={handleSubmit}>
                <div className={styles.settingsSection}>
                    <h3>Auction Schedule</h3>
                    <div className={styles.settingsGrid}>
                        <div className={styles.settingItem}>
                            <label htmlFor="auction_start">Auction Start Time</label>
                            <input
                                type="datetime-local"
                                id="auction_start"
                                name="auction_start"
                                className={sharedStyles.formInput}
                                value={formData.auction_start}
                                onChange={handleChange}
                            />
                            <span className={styles.helpText}>When bidding opens for all items</span>
                        </div>

                        <div className={styles.settingItem}>
                            <label htmlFor="auction_end">Auction End Time</label>
                            <input
                                type="datetime-local"
                                id="auction_end"
                                name="auction_end"
                                className={sharedStyles.formInput}
                                value={formData.auction_end}
                                onChange={handleChange}
                            />
                            <span className={styles.helpText}>When bidding closes for all items</span>
                        </div>

                        <div className={styles.settingItem}>
                            <label htmlFor="preview_mode">
                                <input
                                    type="checkbox"
                                    id="preview_mode"
                                    name="preview_mode"
                                    checked={formData.preview_mode}
                                    onChange={(e) =>
                                        setFormData({ ...formData, preview_mode: e.target.checked })
                                    }
                                    style={{ marginRight: "0.5rem" }}
                                />
                                Enable Preview Mode
                            </label>
                            <span className={styles.helpText}>
                                Allow users to view items before auction starts, but disable all bidding functionality
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.settingsSection}>
                    <h3>Event Information</h3>
                    <div className={styles.settingsGrid}>
                        <div className={styles.settingItem}>
                            <label htmlFor="event_name">Event Name</label>
                            <input
                                type="text"
                                id="event_name"
                                name="event_name"
                                className={sharedStyles.formInput}
                                placeholder="Church Bazaar 2025"
                                value={formData.event_name}
                                onChange={handleChange}
                                required
                            />
                            <span className={styles.helpText}>Displayed in the header</span>
                        </div>

                        <div className={styles.settingItem}>
                            <label htmlFor="event_location">Event Location</label>
                            <input
                                type="text"
                                id="event_location"
                                name="event_location"
                                className={sharedStyles.formInput}
                                placeholder="Church Hall"
                                value={formData.event_location}
                                onChange={handleChange}
                            />
                            <span className={styles.helpText}>Optional venue information</span>
                        </div>
                    </div>
                </div>

                <div className={styles.settingsSection}>
                    <h3>Appearance</h3>
                    <div className={styles.settingsGrid}>
                        <div className={styles.settingItem}>
                            <label htmlFor="primary_color">Primary Color</label>
                            <div className={styles.colorInputWrapper}>
                                <input
                                    type="color"
                                    id="primary_color"
                                    name="primary_color"
                                    className={styles.colorInput}
                                    value={formData.primary_color}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    className={sharedStyles.formInput}
                                    value={formData.primary_color}
                                    onChange={handleChange}
                                    pattern="^#[0-9A-Fa-f]{6}$"
                                    placeholder="#348feb"
                                    name="primary_color"
                                />
                            </div>
                            <span className={styles.helpText}>
                                Main theme color for the application (requires page refresh)
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.saveButtonContainer}>
                    <button
                        type="submit"
                        className={sharedStyles.saveButton}
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
}
