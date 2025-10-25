import type { JSX } from "react";
import styles from "./PlaceholderTab.module.css";

interface PlaceholderTabProps {
    title: string;
    description: string;
}

export default function PlaceholderTab({ title, description }: PlaceholderTabProps): JSX.Element {
    return (
        <div className={styles.placeholderTab}>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}
