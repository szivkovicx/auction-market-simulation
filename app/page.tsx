'use client';

import { Market } from "@/simulator";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from 'chart.js';
import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Table } from "@chakra-ui/react"

import styles from './page.module.css';
import { Provider } from "@/components/ui/provider";

ChartJS.register(...registerables);

type PriceData = number | null;

type Book = { asks: [number,number][]; bids: [number,number][]; };

export default function Home() {
  const [asks, setAsks] = useState<PriceData[]>([]);
  const [bids, setBids] = useState<PriceData[]>([]);
  const [time, setTime] = useState<number[]>([]);
  const [spread, setSpread] = useState<PriceData[]>([]);
  const [book, setBook] = useState<Book>();
  const [mid, setMid] = useState<PriceData[]>([]);
  const [passiveSupply, setPassiveSupply] = useState<number>(10);
  const [passiveDemand, setPassiveDemand] = useState<number>(10);
  const [activeSupply, setActiveSupply] = useState<number>(10);
  const [activeDemand, setActiveDemand] = useState<number>(10);
  const [passiveQtyRange, setPassiveQtyRange] = useState<[number,number]>([1, 50]);
  const [activeQtyRange, setActiveQtyRange] = useState<[number,number]>([1, 10]);
  const [passiveSpreadRange, setPassiveSpreadRange] = useState<[number,number]>([0.1, 2.0]);

  const marketRef = useRef(new Market(
    101, 99,
    passiveSupply,
    passiveDemand,
    activeSupply,
    activeDemand,
    passiveQtyRange,
    activeQtyRange,
    passiveSpreadRange

  ));

  const getVolume = (price: 'asks' | 'bids') => {
    if (book) {
      return book[price].slice(0, 10).map((data) => data[1]);
    }
    return [];
  }

  const getPrices = (price: 'asks' | 'bids') => {
    if (book) {
      return book[price].slice(0, 10).map((data) => data[0]);
    }
    return [];
  }

  const getBook = () => {
    if (book) {
      const bookAsks = book.asks.slice(0,5);
      const bookBids = book.bids.slice(0,5);
      return [...bookAsks.map((row) => [row[1], row[0], null]), ...bookBids.map((row) => [null, row[0], row[1]])]
    }
    return []
  }

  useEffect(() => {
    if (typeof window !== "undefined")
      import("chartjs-plugin-zoom").then((plugin) => {
        ChartJS.register(plugin.default);
      });
    }, []);

  useEffect(() => {
    marketRef.current.updateParameters(
      passiveSupply, passiveDemand, activeSupply, activeDemand,
      passiveQtyRange, activeQtyRange, passiveSpreadRange
    )  
  }, [
    passiveSupply, passiveDemand, activeSupply, activeDemand,
    passiveQtyRange, activeQtyRange, passiveSpreadRange
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const ob = marketRef.current.nextTick();
      const ask = ob.bestAsk();
      const bid = ob.bestBid();
      const orderBook = ob.getBook();
      const currentTime = marketRef.current.currentTick;
      setAsks((pre) => [...pre, ask]);
      setBids((pre) => [...pre, bid]);
      if (ask && bid) {
        setSpread((pre) => [...pre, ask-bid]);
        setMid((pre) => [...pre, (ask+bid)/2]);
      }
      setTime((pre) => [...pre, currentTime]);
      setBook(orderBook);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time.length > 50) {
      setAsks((pre) => pre.slice(5));
      setMid((pre) => pre.slice(5));
      setBids((pre) => pre.slice(5));
      setTime((pre) => pre.slice(5));
      setSpread((pre) => pre.slice(5));
    }
  }, [time])

  return (
    <Provider>
        <div className={styles.page}>
          <div className={styles.controlContainer}>
            <div className={styles.controlPanel}>
              <Slider
                label='Passive supply'
                value={[passiveSupply]}
                onValueChange={(e) => setPassiveSupply(e.value[0])}
                max={100}
                min={1}
                step={1}
              />
              <Slider
                label='Passive demand'
                value={[passiveDemand]}
                onValueChange={(e) => setPassiveDemand(e.value[0])}
                max={100}
                min={1}
                step={1}
              />
              <Slider
                label='Active supply'
                value={[activeSupply]}
                onValueChange={(e) => setActiveSupply(e.value[0])}
                max={100}
                min={1}
                step={1}
              />
              <Slider
                label='Active demand'
                value={[activeDemand]}
                onValueChange={(e) => setActiveDemand(e.value[0])}
                max={100}
                min={1}
                step={1}
              />
              <Slider
                label='Passive volume range'
                value={passiveQtyRange}
                onValueChange={(e) => setPassiveQtyRange(e.value as [number, number])}
                max={100}
                min={1}
                step={1}
              />
              <Slider
                label='Active volume range'
                value={activeQtyRange}
                onValueChange={(e) => setActiveQtyRange(e.value as [number, number])}
                max={100}
                min={1}
                step={1}
              />
              <Slider
                label='Spread range'
                value={passiveSpreadRange}
                onValueChange={(e) => setPassiveSpreadRange(e.value as [number, number])}
                max={100}
                min={1}
                step={1}
              />
            </div>
            <div className={styles.orderBook}>
              <Table.Root interactive showColumnBorder>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader textAlign="center">Ask</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">Price</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">Bid</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {getBook().map((row, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell textAlign="center">
                        {row[0]}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {row[1]}
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        {row[2]}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </div>
          </div>
          <div className={styles.priceChart}>
            <Line
              options={{
                maintainAspectRatio: false,
                spanGaps: true,
                plugins: {
                  zoom: {
                    zoom: {
                      wheel: {
                        enabled: true,
                      },
                      pinch: {
                        enabled: true
                      },
                      mode: 'y',
                    }
                  }
                }
              }}
              data={{
                labels: time,
                datasets: [
                  {
                    data: asks,
                    label: 'Ask',
                    stepped: true,
                    borderColor: 'red',
                  },
                  {
                    data: bids,
                    label: 'Bid',
                    stepped: true,
                    borderColor: 'green'
                  }
                ]
              }}
            />
          </div>
          <div className={styles.orderflowContainer}>
              <div className={styles.orderflowChart}>
                <Line
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      zoom: {
                        zoom: {
                          wheel: {
                            enabled: true,
                          },
                          pinch: {
                            enabled: true
                          },
                          mode: 'y',
                        }
                      }
                    }
                  }}
                  data={{
                    labels: time,
                    datasets: [
                      {
                        data: mid,
                        label: 'Mid',
                        stepped: true,
                        borderColor: 'blue',
                      },
                    ]
                  }}
                />
              </div>
              <div className={styles.orderflowChart}>
                <Line
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        ticks: {
                          display: false,
                        },
                      }
                    },
                    plugins: {
                      zoom: {
                        zoom: {
                          wheel: {
                            enabled: true,
                          },
                          pinch: {
                            enabled: true
                          },
                          mode: 'y',
                        }
                      }
                    }
                  }}
                  data={{
                    labels: [...getPrices('bids'), ...getPrices('asks')],
                    datasets: [
                      {
                        data: [...getVolume('bids').map((_, i) => {
                            return getVolume('bids').slice(0, i + 1).reduce((acc, qty) => acc + qty, 0);
                        }).reverse(), ...getVolume('asks').map((_, i) => {
                          return getVolume('asks').slice(0, i + 1).reduce((acc, qty) => acc + qty, 0);
                        })],
                        label: 'Market Depth',
                        stepped: true,
                        borderColor: 'rgba(0, 123, 255, 1)',
                        backgroundColor: 'rgba(0, 123, 255, 0.2)',
                        fill: true,
                        pointStyle: false
                      },
                    ]
                  }}
                />
              </div>
              <div className={styles.orderflowChart}>
                <Bar
                  options={{
                    maintainAspectRatio: false,
                  }}
                  data={{
                    labels: ['Sellers', 'Buyers'],
                    datasets: [
                      {
                        data: [
                          getVolume("asks").reduce((partialSum, a) => partialSum + a, 0),
                          getVolume("bids").reduce((partialSum, a) => partialSum + a, 0)
                        ],
                        label: 'Passive Order Volume',
                        backgroundColor: ['red', 'green'],
                      },
                    ]
                  }}
                />
              </div>
              <div className={styles.orderflowChart}>
                <Line
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      zoom: {
                        zoom: {
                          wheel: {
                            enabled: true,
                          },
                          pinch: {
                            enabled: true
                          },
                          mode: 'y',
                        }
                      }
                    }
                  }}
                  data={{
                    labels: time,
                    datasets: [
                      {
                        data: spread,
                        label: 'Spread',
                        stepped: true,
                        borderColor: 'blue',
                      },
                    ]
                  }}
                />
              </div>
          </div>
        </div>
    </Provider>
  );
}
