'use client';

import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { getStandingCharge, getUnitRate, add } from '@/app/actions/calculations';

export default function UsageChart(props) {
  const [labels, setLabels] = useState([]);
  const [gasData, setGasData] = useState([]);
  const [electricData, setElectricData] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  function createData(usage, unitRates, standingCharges) {
    let dataToCreate = [];

    for (let i = 0; i < labels.length; i++) {
      switch (props.view.period) {
        case 'day':
          let usageData =
            usage.find((data) => data.interval_start.split('T')[0] === labels[i])?.consumption || 0;
            
          if (props.property.usage.gas === usage) {
            usageData = usageData * 40.0 * 1.02264 / 3.6;
          }
          
          let unitRate = getUnitRate(unitRates, labels[i]);
          let standingCharge = getStandingCharge(standingCharges, labels[i]);

          let dailyCost = (add(usageData * unitRate, standingCharge) / 100).toFixed(2);

          dataToCreate.push(dailyCost);
          break;
        case 'week':
          // Handle week case
          break;
        case 'month':
          let start = new Date(labels[i]);
          let end = new Date(start.getFullYear(), start.getMonth() + 1, 0);

          let monthlyUsage = 0;

          const monthData = usage.find((data) => data.interval_start.slice(0, 7) === labels[i]);

          if (monthData) {
            monthlyUsage = monthData.consumption;
            
            if (props.property.usage.gas === usage) {
              monthlyUsage = monthlyUsage * 40.0 * 1.02264 / 3.6;
            }

            let monthlyUnitRate = getUnitRate(unitRates, labels[i]);

            let monthlyStandingCharge = getStandingCharge(standingCharges, labels[i]);

            if (i !== labels.length - 1) {
              monthlyStandingCharge = monthlyStandingCharge * (end.getDate() - start.getDate() + 1);
            } else {
              monthlyStandingCharge =
                monthlyStandingCharge * (new Date().getDate() - start.getDate() + 1);
            }

            const monthlyCost = (
              add(monthlyUsage * monthlyUnitRate, monthlyStandingCharge) / 100
            ).toFixed(2);

            dataToCreate.push(monthlyCost);
          } else {
            dataToCreate.push(0);
          }

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
        let start = startDate.slice(0, 7);
        let end = endDate.slice(0, 7);
        let current = start;

        while (current <= end) {
          labelsToCreate.push(current);
          let year = current.split('-')[0];
          let month = current.split('-')[1];

          year = parseInt(year);
          month = parseInt(month);

          month++;

          if (month > 12) {
            month = 1;
            year++;
          }

          current = `${year}-${month.toString().padStart(2, '0')}`;
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
      return;
    }
    setElectricData(
      createData(
        props.property.usage.electric,
        props.property.electric.unitRates,
        props.property.electric.standingCharges
      )
    );
    setGasData(
      createData(
        props.property.usage.gas,
        props.property.gas.unitRates,
        props.property.gas.standingCharges
      )
    );
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
                },
              },
            },
          },
        },
      });
    }
  }, [electricData, gasData, labels]);

  return (
    <canvas
      ref={chartRef}
      id="usageChart"
      style={{ display: 'block', width: '100%', height: '100%', color: 'white' }}
    ></canvas>
  );
}
