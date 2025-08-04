import {Column, RowData, LocalizationData} from "../components/table/types";

export function flattenObject(obj: any, currentPath = "", res: { [key: string]: string } = {}) {
    if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
        Object.keys(obj).forEach((key) => {
            const fullPath = currentPath ? `${currentPath}.${key}` : key;
            if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], fullPath, res);
            } else {
                res[fullPath] = obj[key];
            }
        });
    }
    return res;
}

// Yardımcı fonksiyon: İç içe nesnede bir değeri ayarlar
export function setNestedValue(obj: any, path: string, value: any) {
    const pathParts = path.split('.');
    let current = obj;
    for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (typeof current[part] !== 'object' || current[part] === null) {
            current[part] = {};
        }
        current = current[part];
    }
    current[pathParts[pathParts.length - 1]] = value;
}


// Yardımcı fonksiyon: i18n verisini tablo prop'larına dönüştürür (LocaleTable'dan adapte edildi)
export function transformLocalizationDataToTableProps(localizationData: LocalizationData): { columns: Column[], data: RowData[] } {
    const languages = Object.keys(localizationData);
    const allKeys = new Set<string>();

    // Tüm dillerden benzersiz anahtarları topla
    languages.forEach(lang => {
        const flattened = flattenObject(localizationData[lang]);
        Object.keys(flattened).forEach(key => allKeys.add(key));
    });

    // Kolonları oluştur
    const columns: Column[] = [
        { id: 'key', header: 'Key/Path', accessor: 'key', width: 250 }, // Sabit ilk kolon
        ...languages.map(lang => ({
            id: lang,
            header: lang.toUpperCase(), // Dil kodunu başlık olarak göster
            accessor: lang, // Bu accessor aslında kullanılmayacak, doğrudan row.values[lang] erişilecek
            width: 150, // Dil kolonları için varsayılan genişlik
        })),
    ];

    // Veri satırlarını oluştur
    const data: RowData[] = Array.from(allKeys).map(fullKey => {
        const pathParts = fullKey.split(".");
        const key = pathParts[pathParts.length - 1];
        const path = pathParts.slice(0, -1).join(".");

        const values: { [langCode: string]: string } = {};
        languages.forEach(lang => {
            const flattenedLangData = flattenObject(localizationData[lang]);
            values[lang] = flattenedLangData[fullKey] || ''; // Çeviriyi al, bulunamazsa boş string
        });
        return { id: fullKey, key, path, values }; // id artık fullKey
    });

    // Tutarlı sıralama için anahtara göre sırala
    data.sort((a, b) => a.id.localeCompare(b.id)); // id (fullKey) üzerinden sırala

    return { columns, data };
}
