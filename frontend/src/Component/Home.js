import React, { Fragment, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import MetaData from './layouts/MetaData';
import Loader from './layouts/Loader';
import Pagination from 'react-js-pagination';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import { Product } from './product/Product';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const Home = ({ match, history }) => {
  const [price, setPrice] = useState([1, 200000]);
  const [ change, setChange ]  = useState(false);
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);
  const categories = [
    'Electronics',
    'Cameras',
    'Laptops',
    'Headphones',
    'Accessories',
    'Food',
    'Mobile',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home',
    'Reset All Categories',
  ];
  const keyword = match.params.keyword;
  const [currentPage, setCurrentPage] = useState(1);
  const alert = useAlert();
  const dispatch = useDispatch();
  const { logout} = useSelector((state) => state.auth);
  const { products, productCount, loading, error, resPerPage, results } = useSelector((state) => state.products);
  useEffect(() => {
    if (logout) {
      window.onpopstate=()=>{
        window.location.replace(window.location.href)
      }
    }
    if (error) return alert.error(error);
    if(change){
      const timeoutId = setTimeout(() => {
        dispatch(getProducts({ keyword, currentPage, price, category, rating }));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    dispatch(getProducts({ keyword, currentPage, price, category, rating }));
  }, [dispatch,change, history, alert, error, keyword, currentPage, price, category, rating, logout]);

  function setCurrentPageNo(page) {
    setCurrentPage(page);
  }

  return (
    <Fragment>
      {loading ? (
          <Loader />
      ) : (
          <Fragment>
          <MetaData title={'Only the excellent products'} />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {keyword ? (
                <Fragment>
                  <div className="col-6 col-md-3 mt-5 mb-5">
                    <div className="px-5">
                      <Range
                        marks={{
                          1: '₹1',
                          200000: '₹200000',
                        }}
                        min={1}
                        max={200000}
                        defaultValue={[1, 200000]}
                        tipFormatter={(value) => `₹${value}`}
                        tipProps={{
                          placement: 'top',
                          visible: true,
                        }}
                        value={price}
                        onChange={(price) =>{ setPrice(price);
                          setChange(true);
                        }}
                      />

                      <hr className="my-5" />
                      <div className="mt-5">
                        <h4 className="mb-3">Categories</h4>
                        <ul className="pl-0">
                          {categories.map((category) => {
                            return (
                              <li
                                style={{
                                  cursor: 'pointer',
                                  listStyleType: 'none',
                                }}
                                key={category}
                                onClick={() => setCategory(category)}
                              >
                                {category}
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <hr className="my-3" />
                      <div className="mt-5">
                        <h4 className="mb-3">Ratings</h4>
                        <ul className="pl-0">
                          {[5, 4, 3, 2, 1].map((star) => {
                            return (
                              <li
                                style={{
                                  cursor: 'pointer',
                                  listStyleType: 'none',
                                }}
                                key={star}
                                onClick={() => setRating(star)}
                              >
                                <div className="rating-outer">
                                  <div
                                    className="rating-inner"
                                    style={{
                                      width: `${star * 20}%`,
                                    }}
                                  ></div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-9">
                    <div className="row">
                      {results ? (
                        products.map((product) => <Product key={product._id} product={product} col={4} />)
                      ) : (
                        <h4 className="display-3">Sorry no products found</h4>
                      )}
                    </div>
                  </div>
                </Fragment>
              ) : (
                products.map((product) => <Product key={product._id} product={product} col={3} />)
              )}
            </div>
          </section>
          {(
            <div className="d-flex justify-content-center mt-5 mb-5">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={history.location.pathname!=='/'?results:productCount}
                onChange={setCurrentPageNo}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
