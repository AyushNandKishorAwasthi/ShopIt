import { Link } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import MetaData from '../../Component/layouts/MetaData';
const SuccessOrder = ({history}) => {
  const { isAuthenticated } = useSelector(state=>state.auth);

  useEffect(()=>{
    window.onpopstate=()=>{
      window.location.replace(`${window.location.origin}/`)
    }
  },[history])
  return (
    <Fragment>
      <MetaData title={isAuthenticated ? "Order Success" : 'Only the excellent products'}/>
      <div className="row justify-content-center">
        <div className="col-6 mt-5 text-center">
          <img
            className="my-5 img-fluid d-block mx-auto"
            src="/images/success.png"
            alt="Order Success"
            width="200"
            height="200"
          />

          <h2>Your Order has been placed successfully.</h2>

          <Link to="/orders/me">Go to Orders</Link>
        </div>
      </div>
    </Fragment>
  );
};
export default SuccessOrder;
