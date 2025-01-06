'use client';

import { useState, useEffect } from 'react';
import { calculateGas, calculateElectric, add } from '@/app/actions/calculations';
import {
  Card,
  CardHeader,
  CardBody,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from '@nextui-org/react';
import Loading from '@/app/components/loading';
import UsageChart from './Components/UsageChart';
import {
  getElectricUsage,
  getElectricUnitRates,
  getElectricStandingCharges,
  getGasUsage,
  getGasUnitRates,
  getGasStandingCharges,
} from '@/app/actions/octopus';
import { getAccount } from '@/app/actions/account';

export default function Page({ params }) {
  let date = new Date();
  date.setDate(28);
  date.setMonth(date.getMonth() - 1);
  let lastMonth28th = date.toISOString();

  const views = {
    currentMonth: {
      name: 'Current Month',
      period: 'day',
      startDate: lastMonth28th,
      endDate: new Date().toISOString(),
    },
    past12Months: {
      name: 'Past 12 Months',
      period: 'month',
      startDate: new Date(
        new Date(new Date().setFullYear(new Date().getFullYear() - 1)).setDate(1)
      ).toISOString(),
      endDate: new Date().toISOString(),
    },
  };

  const [property, setProperty] = useState({});
  const [loading, setLoading] = useState(true);

  const [electricCost, setElectricCost] = useState(0);
  const [gasCost, setGasCost] = useState(0);

  const [view, setView] = useState('currentMonth');

  useEffect(() => {
    const postcode = new URLSearchParams(window.location.search).get('postcode');

    if (sessionStorage.getItem(`${params.id}-${postcode}`)) {
      setProperty(JSON.parse(sessionStorage.getItem(`${params.id}-${postcode}`)));
    } else {
      console.error('No data found');
      setLoading(false);
      return;
      s;
    }
  }, []);

  useEffect(() => {
    if (Object.keys(property).length === 0) return;

    setElectricCost(
      calculateElectric(
        property.usage.electric,
        property.electric.standingCharges,
        property.electric.unitRates,
        views[view].period
      )
    );

    setGasCost(
      calculateGas(
        property.usage.gas,
        property.gas.standingCharges,
        property.gas.unitRates,
        views[view].period
      )
    );

    setLoading(false);
  }, [property]);

  useEffect(() => {
    if (Object.keys(property).length === 0) return;

    async function fetchData() {
      setLoading(true);

      const account = await getAccount(params.id);
      const electricUsage = await getElectricUsage(
        account.api_key,
        property.mpan,
        property.electricSerialNumbers,
        views[view].startDate,
        views[view].endDate,
        views[view].period
      );
      const electricUnitRates = await getElectricUnitRates(
        account.product_code.code,
        `E${account.product_code.tariff_code}${account.area_code.group_id}`,
        views[view].startDate,
        views[view].endDate
      );

      const electricStandingCharges = await getElectricStandingCharges(
        account.product_code.code,
        `E${account.product_code.tariff_code}${account.area_code.group_id}`,
        views[view].startDate,
        views[view].endDate
      );

      const gasUsage = await getGasUsage(
        account.api_key,
        property.mprn,
        property.gasSerialNumbers,
        views[view].startDate,
        views[view].endDate,
        views[view].period
      );
      const gasUnitRates = await getGasUnitRates(
        account.product_code.code,
        `G${account.product_code.tariff_code}${account.area_code.group_id}`,
        views[view].startDate,
        views[view].endDate
      );
      const gasStandingCharges = await getGasStandingCharges(
        account.product_code.code,
        `G${account.product_code.tariff_code}${account.area_code.group_id}`,
        views[view].startDate,
        views[view].endDate
      );

      setProperty({
        ...property,
        usage: {
          electric: electricUsage,
          gas: gasUsage,
        },
        electric: {
          unitRates: electricUnitRates,
          standingCharges: electricStandingCharges,
        },
        gas: {
          unitRates: gasUnitRates,
          standingCharges: gasStandingCharges,
        },
      });
    }

    fetchData();
  }, [view]);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <h1 className="capitalize">
            {property.addressLine1 ? property.addressLine1?.toLowerCase() : '...'}
          </h1>
          <p className="text-sm">{property.postcode ? property.postcode : '..'}</p>
        </div>
        <div className="flex gap-3 sm:flex-wrap">
          <Card className="bg-default-100 w-full sm:w-fit">
            <CardHeader>
              <Tabs variant="bordered" selectedKey={view} onSelectionChange={setView}>
                {Object.keys(views).map((key) => (
                  <Tab key={key} title={views[key].name} />
                ))}
              </Tabs>
            </CardHeader>
            <CardBody>
              <div className="flex justify-between gap-4">
                <span>Electric:</span>
                <span className="text-green-400">&pound;{!loading ? electricCost : '...'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Gas:</span>
                <span className="text-blue-400">&pound;{!loading ? gasCost : '...'}</span>
              </div>
              <Divider className="my-4" />
              <div className="flex justify-between gap-4">
                <span>Total:</span>
                <span>&pound;{!loading ? add(electricCost, gasCost) : '...'}</span>
              </div>
            </CardBody>
          </Card>
        </div>
        <Card className="bg-default-100 w-full max-w-[902px] h-[350px] sm:h-[500px]">
          <CardBody className="w-full max-w-[1000px] h-full max-h-[500px]">
            {!loading ? <UsageChart property={property} view={views[view]} /> : <Loading />}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
