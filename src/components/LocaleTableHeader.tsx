import {FC} from "react";
import SearchInput from "./table/SearchInput";
import {SaveStatix} from "./SaveStatix";
import ColumnVisibilityToggle from "./table/ColumnVisibilityToggle";

/**
 * Header component containing search and controls
 */
interface TableHeaderProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export const TableHeader: FC<TableHeaderProps> = ({ searchTerm, onSearchChange }) => (
    <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 0"
    }}>
        <SearchInput
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search keys or translations..."
        />

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <SaveStatix />
            <ColumnVisibilityToggle />
        </div>
    </div>
);
