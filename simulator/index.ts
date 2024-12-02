import { OrderBook } from "@/orderbook";
import { ZeroIntelligenceAgent } from "@/agent";
import { AgentType, Side } from "@/enums";

export class Market {
    private initialAsk: number;
    private initialBid: number;
    private orderbook: OrderBook = new OrderBook();

    private passiveSupply: number
    private passiveDemand: number
    private activeSupply: number
    private activeDemand: number
    private passiveQtyRange: [number, number]
    private activeQtyRange: [number, number]
    private passiveSpreadRange: [number, number]

    currentTick: number = 0;

    constructor(
        initialAsk: number = 99.0,
        initialBid: number = 101.0,
        passiveSupply: number,
        passiveDemand: number,
        activeSupply: number,
        activeDemand: number,
        passiveQtyRange: [number,number],
        activeQtyRange: [number,number],
        passiveSpreadRange: [number,number]
    ) {
        this.initialAsk = initialAsk;
        this.initialBid = initialBid;
        this.passiveSupply = passiveSupply;
        this.passiveDemand = passiveDemand;
        this.activeSupply = activeSupply;
        this.activeDemand = activeDemand;
        this.activeQtyRange = activeQtyRange;
        this.passiveQtyRange = passiveQtyRange;
        this.passiveSpreadRange = passiveSpreadRange;
    }

    public updateParameters(
        passiveSupply: number, passiveDemand: number, activeSupply: number, activeDemand: number,
        passiveQtyRange: [number,number], activeQtyRange: [number,number], passiveSpreadRange: [number,number]
    ) {
        this.passiveSupply = passiveSupply;
        this.passiveDemand = passiveDemand;
        this.activeSupply = activeSupply;
        this.activeDemand = activeDemand;
        this.activeQtyRange = activeQtyRange;
        this.passiveQtyRange = passiveQtyRange;
        this.passiveSpreadRange = passiveSpreadRange;
    }

    public nextTick(): OrderBook {
        if (this.currentTick === 0) {
            this.orderbook.limitOrder(Side.BUY, this.initialAsk, this.randomQty(this.passiveQtyRange));
            this.orderbook.limitOrder(Side.SELL, this.initialBid, this.randomQty(this.passiveQtyRange));
        }

        const agents: AgentType[] = [
            ...Array(this.passiveSupply).fill(AgentType.LIQUIDITY_PROVIDER_BUY),
            ...Array(this.passiveDemand).fill(AgentType.LIQUIDITY_PROVIDER_SELL),
            ...Array(this.activeSupply).fill(AgentType.LIQUIDITY_TAKER_BUY),
            ...Array(this.activeDemand).fill(AgentType.LIQUIDITY_TAKER_SELL),
        ];

        this.shuffle(agents);

        for (const agentType of agents) {
            const agent = new ZeroIntelligenceAgent(
                this.orderbook,
                agentType,
                this.passiveSpreadRange,
                this.activeQtyRange,
                this.passiveQtyRange
            );
            agent.execute();
        }

        this.currentTick++;

        return this.orderbook;
    }

    private randomQty(range: [number, number]): number {
        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }

    private shuffle(array: any[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
