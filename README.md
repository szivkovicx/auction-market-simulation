![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

# Auction Market Simulation

Auction-based market simulation using market making and market taking zero intelligence agents. It's controlled using various basic variables that focus directly on market making configuration and aggressive supply/demand.

It contains an order book, zero intelligence agent and simulation written from scratch together with basic order book UI component.

![image](https://github.com/user-attachments/assets/b06d6b89-df7a-4f95-be2e-1e52d298d7e1)

## About Auction Markets

Auction-based market is an type of market in which participants ( buyers and sellers ) both try to offer best prices. Essentially, price is determined by best offered bid price ( buying price ) and ask price ( selling price ) and execution occurs once there is a particular seller offering to sell to a buyer and particular buyer offering to buy from specific seller.

Everything is recorded within a record called order book which is used to keep data of all orders, levels orders are submitted at and quantities ( volume ) of those orders. With an order book, we have a full picture of aggressive and passive supply and demand within an market.

Participants can post only 2 types of orders, so-called limit or passive orders and market or aggressive orders. Both types of prices are needed for an auction market to work. Limit or passive orders are orders that are submitted for future execution and serve a purpose of providing liquidity ( or ease of buying and selling ) to the market while market or aggressive orders are orders that are submitted for immediate execution at current bid/ask price ( in other words, these orders 'take' the liquditiy ).

In general, liquidity can be an complex concept to grasp but in broader terms it measures how easy it is for market participants to buy/sell at specific price. In investing, market makers use really complex algorithms and models to provide best ask/bid prices to other participants in the market in nanoseconds. Without those models, participants might wait a long time until they can actually execute the trade or might experience slippage depending on the volume of the aggressive order.

## About Zero Intelligence Agents

Zero Intelligence Agents are trading agents that don't have any intent behind their actions and trade totally randomly. They are mostly used in cases where we want to simulate an limit order book or whole markets overall. In this case, ZI agents are used to market make ( provide liquditiy by quoting bid and ask ) and aggresivelly buy/sell.

## Local Start

Simply clone the repository and install the packages:

```
 $ npm i
```

And then just run:

```
 $ npm run dev
```

## About Configuration

- Passive supply - Controls number of market making buy orders per tick
- Passive demand - Controls number of market making sell orders per tick
- Active supply - Controls number of market taking buy orders per tick
- Active demand - Controls number of market taking sell orders per tick
- Passive volume range - Controls range of volume utilized by market makers
- Active volume range - Controls range of volume utilized by market takers
- Spread range - Controls potential spread of market makers

