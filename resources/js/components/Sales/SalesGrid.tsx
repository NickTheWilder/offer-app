import { type JSX } from "react";
import { Sale } from "@/types";

export function SalesGrid({ sales = [] }: { sales: Sale[] }): JSX.Element {
    return (
        <div>
            {/* TODO: Implement SalesGrid using DataGrid component */}
            <p>Sales Grid - {sales.length} sales</p>
        </div>
    );
}
