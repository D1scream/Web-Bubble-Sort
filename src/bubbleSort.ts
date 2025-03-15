
export function bubbleSort(arr: number[]): number[] {
    const sorted = [...arr];
    const n = sorted.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (sorted[j] > sorted[j + 1]) {
                [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
            }
        }
    }

    return sorted;
}