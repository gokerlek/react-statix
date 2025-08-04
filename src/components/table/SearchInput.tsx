import React from 'react';
import { useStyle } from './useStyle';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    placeholder = "Search...",
    onFocus,
    onBlur
}) => {
    const styles = useStyle();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        target.style.borderColor = styles.searchInputFocus.borderColor;
        target.style.backgroundColor = styles.searchInputFocus.backgroundColor;
        target.style.boxShadow = styles.searchInputFocus.boxShadow;
        onFocus?.();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        target.style.borderColor = styles.searchInput.border.split(' ')[2];
        target.style.backgroundColor = styles.searchInput.backgroundColor;
        target.style.boxShadow = 'none';
        onBlur?.();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={styles.searchInput}
        />
    );
};

export default SearchInput;