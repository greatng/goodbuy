'use client';

import { useState, useEffect } from 'react';

export function usePersistentState<Type>(
    key: string,
    initialState: Type | (() => Type),
    validate?: (value: unknown) => boolean,
): [Type, React.Dispatch<React.SetStateAction<Type>>] {
    const prefixedKey = 'use-persistent-state-' + key;
    // Match the server's initial render before restoring browser preferences.
    const [value, setValue] = useState<Type>(initialState);
    const [loadedKey, setLoadedKey] = useState<string | null>(null);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(prefixedKey);
            if (stored !== null) {
                const parsed: unknown = JSON.parse(stored);
                if (!validate || validate(parsed)) setValue(parsed as Type);
            }
        } catch {
            // Storage may be unavailable or contain an incomplete saved value.
        }
        setLoadedKey(prefixedKey);
    }, [prefixedKey, validate]);

    useEffect(() => {
        if (loadedKey !== prefixedKey) return;
        try {
            window.localStorage.setItem(prefixedKey, JSON.stringify(value));
        } catch {
            // Comparisons still work when browser storage is blocked or full.
        }
    }, [value, prefixedKey, loadedKey]);

    return [value, setValue];
}
