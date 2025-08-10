import { describe, expect, test } from "vitest";

import { createLocaleColumns } from "../../utils";

describe("createLocaleColumns", () => {
    test("creates columns with empty languages array", () => {
        const result = createLocaleColumns([]);
        
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            id: 'key',
            header: 'Key/Path',
            accessor: 'key',
            width: 250
        });
    });

    test("creates columns with single language", () => {
        const result = createLocaleColumns(['en']);
        
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
            id: 'key',
            header: 'Key/Path',
            accessor: 'key',
            width: 250
        });
        expect(result[1]).toEqual({
            id: 'en',
            header: 'EN',
            accessor: 'en',
            width: 200
        });
    });

    test("creates columns with multiple languages", () => {
        const result = createLocaleColumns(['en', 'tr', 'fr']);
        
        expect(result).toHaveLength(4);
        expect(result[0]).toEqual({
            id: 'key',
            header: 'Key/Path',
            accessor: 'key',
            width: 250
        });
        expect(result[1]).toEqual({
            id: 'en',
            header: 'EN',
            accessor: 'en',
            width: 200
        });
        expect(result[2]).toEqual({
            id: 'tr',
            header: 'TR',
            accessor: 'tr',
            width: 200
        });
        expect(result[3]).toEqual({
            id: 'fr',
            header: 'FR',
            accessor: 'fr',
            width: 200
        });
    });

    test("handles language codes with mixed case", () => {
        const result = createLocaleColumns(['En', 'TR', 'fr-CA']);
        
        expect(result).toHaveLength(4);
        expect(result[1].header).toBe('EN');
        expect(result[2].header).toBe('TR');
        expect(result[3].header).toBe('FR-CA');
        
        // Accessor should use original case
        expect(result[1].accessor).toBe('En');
        expect(result[2].accessor).toBe('TR');
        expect(result[3].accessor).toBe('fr-CA');
    });

    test("preserves order of languages", () => {
        const languages = ['zh', 'es', 'de', 'ja'];
        const result = createLocaleColumns(languages);
        
        expect(result).toHaveLength(5);
        expect(result[1].id).toBe('zh');
        expect(result[2].id).toBe('es');
        expect(result[3].id).toBe('de');
        expect(result[4].id).toBe('ja');
    });
});
