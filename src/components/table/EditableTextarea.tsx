import React, { useCallback, useEffect, useRef } from 'react';
import { useStyle } from './useStyle';

interface EditableTextareaProps {
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

const EditableTextarea: React.FC<EditableTextareaProps> = ({
    value,
    onChange,
    onFocus,
    onBlur
}) => {
    const styles = useStyle();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Function to adjust textarea height
    const adjustTextareaHeight = useCallback((textarea: HTMLTextAreaElement | null) => {
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, []);

    // Adjust height when value changes
    useEffect(() => {
        adjustTextareaHeight(textareaRef.current);
    }, [value, adjustTextareaHeight]);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        target.style.borderColor = styles.textareaFocus.borderColor;
        target.style.backgroundColor = styles.textareaFocus.backgroundColor;
        target.style.boxShadow = styles.textareaFocus.boxShadow;
        onFocus?.();
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        target.style.borderColor = styles.textarea.border.split(' ')[2];
        target.style.backgroundColor = styles.textarea.backgroundColor;
        target.style.boxShadow = 'none';
        onBlur?.();
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        adjustTextareaHeight(e.currentTarget);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onInput={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            rows={1}
            style={styles.textarea}
        />
    );
};

export default EditableTextarea;
