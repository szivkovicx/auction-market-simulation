export class SortedMap<K, V> extends Map<K, V> {
    constructor(private comparator: (a: K, b: K) => number) {
        super();
    }

    set(key: K, value: V): this {
        const entries = Array.from(this.entries());
        const index = entries.findIndex(([k]) => this.comparator(k, key) > 0);
        if (index === -1) {
            super.set(key, value);
        } else {
            entries.splice(index, 0, [key, value]);
            super.clear();
            for (const [k, v] of entries) {
                super.set(k, v);
            }
        }
        return this;
    }

    peekFirst(): [K, V] | null {
        return this.size ? [...this.entries()][0] : null;
    }

    peekLast(): [K, V] | null {
        return this.size ? [...this.entries()][this.size - 1] : null;
    }
}
