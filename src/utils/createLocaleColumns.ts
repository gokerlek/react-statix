import { Column } from "../components/table/types";

/**
 * Creates table columns for locale data
 * @param languages Array of language codes
 * @returns Array of column definitions
 */
export const createLocaleColumns = (languages: string[]): Column[] => [
    { id: 'key', header: 'Key/Path', accessor: 'key', width: 250 },
    ...languages.map(lang => ({
        id: lang,
        header: lang.toUpperCase(),
        accessor: lang,
        width: 200
    }))
];
