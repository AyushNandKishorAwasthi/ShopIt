import { countries } from 'countries-list';
import React, { Fragment, useState } from 'react';
import MetaData from '../layouts/MetaData';
import CartSteps from './CartSteps';
import { shipping } from '../../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';

const ShippingInfo = ({ history }) => {
  const dispatch = useDispatch();
  const { shippingInfo } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector(state=>state.auth);
  const countryList = Object.values(countries);
  const [postCode, setPostCode] = useState(shippingInfo.postCode);
  const [city, setCity] = useState(shippingInfo.city);
  const [phone, setPhone] = useState(shippingInfo.phone);
  const [address, setAddress] = useState(shippingInfo.address);
  const [country, setCountry] = useState(shippingInfo.country || 'India');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(shipping({ postCode, city, phone, address, country }));
    history.push('/order/confirm');
  };
  return (
    <Fragment>
      <MetaData title={isAuthenticated ? "Shipping Information" : 'Only the excellent products'} />
      <CartSteps cart shipping />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Shipping Info</h1>
            <div className="form-group">
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city_field">City</label>
              <input
                type="text"
                id="city_field"
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_field">Phone No</label>
              <input
                type="text" inputMode="numeric" pattern="[0-9]*"
                id="phone_field"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="postal_code_field">Postal Code</label>
              <input
                type="number"
                id="postal_code_field"
                className="form-control"
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="country_field">Country</label>
              <select
                id="country_field"
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                {countryList.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <button id="shipping_btn" type="submit" className="btn btn-block py-3">
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ShippingInfo;
