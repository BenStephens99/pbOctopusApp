'use client'

import { useState, useEffect } from "react"
import { getProducts, getSingleRegisterElectricityTariffs, getSingleRegisterGasTariffs } from "@/app/actions/octopus";

import { addElectricTariff } from "@/app/actions/tariffs";
import { addGasTariff } from "@/app/actions/tariffs";

export function AddTariff(props) {

  const type = props.type || 'Electric';

  const [showModal, setShowModal] = useState(false);

  const [products, setProducts] = useState([]);
  const [singleRegisterTariffs, setSingleRegisterTariffs] = useState();

  const [productCode, setProductCode] = useState('')
  const [productName, setProductName] = useState('')
  const [tariffCode, setTariffCode] = useState('');
  const [organisation, setOrganisation] = useState('');

  useEffect(() => {
    if (props.organisations.length === 1) {
      setOrganisation(props.organisations[0].id);
    }
    const fetchData = async () => {
      const products = await getProducts();
      setProducts(products);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      switch (type) {
        case 'electric':
          const eTariffs = await getSingleRegisterElectricityTariffs(productCode);
          setSingleRegisterTariffs(eTariffs);
          break;
        case 'gas':
          const gTariffs = await getSingleRegisterGasTariffs(productCode);
          setSingleRegisterTariffs(gTariffs);
          break;
        default:
          break;
      }
    }
    if (productCode) {
      fetchData();
      setProductName(products.find((product) => product.code === productCode)?.display_name || '');
    }
  }, [productCode]);

  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    if (tariffCode && productCode) {
      setShowSaveButton(true);
    } else {
      setShowSaveButton(false);
    }
  }, [tariffCode, productCode]);

  const saveTariff = async (e) => {
    e.preventDefault();
    switch (type) {
      case 'electric':
        await addElectricTariff({
          name: `${productName} - ${tariffCode}`,
          productCode,
          tariffCode,
          organisation
        });
        break;
      case 'gas':
        await addGasTariff({
          name: `${productName} - ${tariffCode}`,
          productCode,
          tariffCode,
          organisation
        });
        break;
      default:
        break;
    }
  }

  return (
    <>
      <button className="capitalize" onClick={() => setShowModal(true)}>Add {type} Tariff</button>
      {!showModal ? ''
        :
        <div className="modal">
          <div className="modal-body max-w-screen-lg">
            <h3 className="capitalize">{type} Tariff</h3>
            <form className="max-w-full" onSubmit={saveTariff}>
              <div>
                <h4>Product</h4>
                <select onChange={(e) => setProductCode(e.target.value)} 
                  value={productCode}
                  className={!productCode ? 'bg-white' : 'bg-blue-200'}
                >
                  <option value="" className="bg-white">Select a product</option>
                  {products.map((product) => (
                    <option key={product.code} className="bg-white" value={product.code}>{product.display_name}</option>
                  ))}
                </select>
              </div>
              <div>
                {!singleRegisterTariffs || !productCode ? '' :
                  <>
                    <h4>Tariff</h4>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {Object.values(singleRegisterTariffs).map((tariff) => (
                        <div className={`border border-gray-400 p-2 hover:bg-blue-100 cursor-pointer
                                      ${tariffCode === tariff?.varying?.code ? 'bg-blue-200' : 'bg-white'}
                                  `}
                          key={tariff?.varying?.code}
                          onClick={() => setTariffCode(tariff?.varying?.code)}
                        >
                          <table className="w-full">
                            <tr>
                              <td>Unit:</td>
                              <td className="text-right">
                                {parseFloat(tariff?.varying?.standard_unit_rate_inc_vat).toFixed(2)}p
                                <span className="hidden sm:inline"> / kwh</span>
                              </td>
                            </tr>
                            <tr>
                              <td>Standing:</td>
                              <td className="text-right">
                                {parseFloat(tariff?.varying?.standing_charge_inc_vat).toFixed(2)}p
                                <span className="hidden sm:inline"> / day</span>
                              </td>
                            </tr>
                          </table>
                        </div>
                      ))}
                    </div>
                  </>
                }
              </div>
              {props.organisations.length > 1 ?
                <div>
                  <h4>Organisation</h4>
                  <select onChange={(e) => setOrganisation(e.target.value)} value={organisation}
                    className={!organisation ? 'bg-white' : 'bg-blue-200'}
                  >
                    <option value="" className="bg-white">Select an organistion</option>
                    {props.organisations.map((organisation) => (
                      <option key={organisation.id} className="bg-white" value={organisation.id}>
                        {organisation.name}
                      </option>
                    ))}
                  </select>
                </div>
                : ''}
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowModal(false)}>Cancel</button>
                {showSaveButton ? <button type="submit">Save</button> : ''}
              </div>
            </form>
          </div>
        </div>
      }
    </>
  );
}