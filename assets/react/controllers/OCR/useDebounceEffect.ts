import { useEffect, DependencyList } from 'react';

export function useDebounceEffect(
    fn: () => void,
    waitTime: number,
    deps: DependencyList = []
) {
    useEffect(() => {
        const t = setTimeout(() => {
            fn();
        }, waitTime);

        return () => {
            clearTimeout(t);
        };
        // Ensure deps is always an array
    }, [fn, waitTime, ...(deps ?? [])]);
}
