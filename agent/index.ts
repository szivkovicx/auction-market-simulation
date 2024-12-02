import { OrderBook } from "@/orderbook";
import { AgentType, Side } from "@/enums";

export class ZeroIntelligenceAgent {
    private orderbook: OrderBook;
    private agentType: AgentType;
    private spreadRange: [number, number];
    private activeQtyRange: [number, number];
    private passiveQtyRange: [number, number];

    constructor(
        orderbook: OrderBook,
        agentType: AgentType,
        spreadRange: [number, number],
        activeQtyRange: [number, number],
        passiveQtyRange: [number, number]
    ) {
        this.orderbook = orderbook;
        this.agentType = agentType;
        this.spreadRange = spreadRange;
        this.activeQtyRange = activeQtyRange;
        this.passiveQtyRange = passiveQtyRange;
    }

    private randomSpread(): number {
        return Math.random() * (this.spreadRange[1] - this.spreadRange[0]) + this.spreadRange[0];
    }

    private randomQty(range: [number, number]): number {
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }

    private generatePrice(isBid: boolean): number {
        const bestAsk = this.orderbook.bestAsk();
        const bestBid = this.orderbook.bestBid();
        let midPrice = bestAsk !== null && bestBid !== null
            ? (bestAsk + bestBid) / 2
            : bestAsk !== null
            ? bestAsk
            : bestBid || 0;

        return isBid ? midPrice - this.randomSpread() : midPrice + this.randomSpread();
    }

    public execute(): void {
        const mmQty = this.randomQty(this.passiveQtyRange);
        const mtQty = this.randomQty(this.activeQtyRange);

        switch (this.agentType) {
            case AgentType.LIQUIDITY_PROVIDER_BUY:
                this.orderbook.limitOrder(Side.BUY, this.generatePrice(true), mmQty);
                break;
            case AgentType.LIQUIDITY_PROVIDER_SELL:
                this.orderbook.limitOrder(Side.SELL, this.generatePrice(false), mmQty);
                break;
            case AgentType.LIQUIDITY_TAKER_BUY:
                this.orderbook.marketOrder(Side.BUY, mtQty);
                break;
            case AgentType.LIQUIDITY_TAKER_SELL:
                this.orderbook.marketOrder(Side.SELL, mtQty);
                break;
        }
    }
}
