import { SortedMap } from '@/types/sortedmap';

export class OrderBook {
    private asks: SortedMap<number, number>;
    private bids: SortedMap<number, number>;

    constructor() {
        this.asks = new SortedMap((a, b) => a - b);
        this.bids = new SortedMap((a, b) => b - a);
    }

    public bestAsk(): number | null {
        const bestAsk = this.asks.peekFirst();
        return bestAsk ? bestAsk[0] : null;
    }

    public bestBid(): number | null {
        const bestBid = this.bids.peekFirst();
        return bestBid ? bestBid[0] : null;
    }

    public limitOrder(side: 0 | 1, price: number, qty: number): void {
        const book = side === 0 ? this.asks : this.bids;
        if (Object.keys(book).length >= 20) {
            return;
        }
        if (book.has(price)) {
            book.set(price, (book.get(price) || 0) + qty);
        } else {
            book.set(price, qty);
        }
    }

    public marketOrder(side: 0 | 1, qty: number): void {
        const book = side === 0 ? this.asks : this.bids;
        while (qty > 0 && book.size > 0) {
            const best = book.peekFirst();
            if (!best) break;

            const [bestPrice, availableQty] = best;
            if (availableQty > qty) {
                book.set(bestPrice, availableQty - qty);
                qty = 0;
            } else {
                qty -= availableQty;
                book.delete(bestPrice);
            }
        }
    }

    public getBook(): { asks: [number, number][], bids: [number, number][] } {
        return {
            asks: Array.from(this.asks.entries()),
            bids: Array.from(this.bids.entries())
        };
    }
}
