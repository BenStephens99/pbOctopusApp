'use client'

import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { getStandingCharge, getUnitRate, add } from "@/app/actions/calculations";

export default function UsageChart(props) {
    const [labels, setLabels] = useState([]);
    const [gasData, setGasData] = useState([]);
    const [electricData, setElectricData] = useState([]);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    function createData(usage, unitRates, standingCharges) {
        let dataToCreate = [];

        for (const label of labels) {
            switch (props.view.period) {
                case 'day':
                    let usageData = (usage.find(data => data.interval_start.split('T')[0] === label))?.consumption || 0;
                    let unitRate = getUnitRate(unitRates, label);
                    let standingCharge = getStandingCharge(standingCharges, label);

                    let dailyCost = (add(usageData * unitRate, standingCharge) / 100).toFixed(2);

                    dataToCreate.push(dailyCost);
                    break;
                case 'week':
                    // Handle week case
                    break;
                case 'month':
                    let start = new Date(label);
                    let end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

                    let monthlyUsage = 0;

                    for (const data of usage) {
                        let dataDate = new Date(data.interval_start);
                        if (dataDate >= start && dataDate <= end) {
                            monthlyUsage += data.consumption;
                        }
                    }

                    let monthlyUnitRate = getUnitRate(unitRates, label);

                    let monthlyStandingCharge = getStandingCharge(standingCharges, label);

                    monthlyStandingCharge = monthlyStandingCharge * (end.getDate() - start.getDate() + 1);

                    let monthlyCost = (add(monthlyUsage * monthlyUnitRate, monthlyStandingCharge) / 100).toFixed(2);

                    dataToCreate.push(monthlyCost);
                    break;
                case 'year':
                    // Handle year case
                    break;
                default:
                    break;
            }
        }
        return dataToCreate;
    }

    function createLabels(period, startDate, endDate) {
        let labelsToCreate = [];
        switch (period) {
            case 'day':
                let date = new Date(startDate);
                while (date <= new Date(endDate)) {
                    labelsToCreate.push(date.toISOString().split('T')[0]);
                    date.setDate(date.getDate() + 1);
                }
                break;
            case 'week':
                // Handle week case
                break;
            case 'month':
                let start = new Date(startDate);
                let end = new Date(endDate);
                let current = new Date(start.getFullYear(), start.getMonth(), 1);

                while (current <= end) {
                    labelsToCreate.push(current.toISOString().split('T')[0].slice(0, 7));
                    current.setMonth(current.getMonth() + 1);
                }
                break;
            case 'year':
                // Handle year case
                break;
            default:
                break;
        }

        return labelsToCreate;
    }

    useEffect(() => {
        setLabels(createLabels(props.view.period, props.view.startDate, props.view.endDate));
    }, [props.view.period, props.view.startDate, props.view.endDate]);

    useEffect(() => {
        if (!labels.length) {
            return
        }
        setElectricData(createData(props.property.usage.electric, props.property.electric.unitRates, props.property.electric.standingCharges));
        setGasData(createData(props.property.usage.gas, props.property.gas.unitRates, props.property.gas.standingCharges));
    }, [labels]);

    useEffect(() => {
        if (gasData.length && electricData.length) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Electricity Usage',
                            data: electricData,
                            borderColor: 'rgba(71, 205, 120, 1)',
                            backgroundColor: 'rgba(71, 205, 120, 0.2)',
                        },
                        {
                            label: 'Gas Usage',
                            data: gasData,
                            borderColor: 'rgba(92, 156, 234, 1)',
                            backgroundColor: 'rgba(92, 156, 234, 0.2)',
                        },
                    ],
                },
                options: {
                    responsive: true,
                    color: 'white',
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date',
                                color: 'white',
                            },
                            ticks: {
                                color: 'white',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Usage',
                                color: 'white',
                            },
                            ticks: {
                                color: 'white',
                                callback: function (value, index, values) {
                                    return '£' + value.toFixed(2);
                                }
                            },
                        },
                    },
                },
            });
        }
    }, [electricData, gasData, labels]);

    return (
        <canvas ref={chartRef} id="usageChart" style={{ display: 'block', width: '100%', height: '100%', color: 'white' }}></canvas>
    );
}
