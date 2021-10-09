import React, { Fragment, useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../layouts/MetaData';
import { clearErrors, updateProduct, getProductDetails } from '../../actions/productActions';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
import SideBar from './SideBar';

const UpdateProduct = ({ history, match }) => {
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
  ];
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [seller, setSeller] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState([]);
  const [oldImage, setOldImage] = useState([]);
  const [picked, setPicked] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);
  const alert = useAlert();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state=>state.auth);
  const { product, error: productError } = useSelector((state) => state.productDetails);
  const { error, success, updated, loading } = useSelector((state) => state.newProduct);
  const productId = match.params.id;
  useEffect(() => {
    if (productId !== product._id || success) dispatch(getProductDetails(productId));
    else {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
      setSeller(product.seller);
      setCategory(product.category);
      setDescription(product.description);
      setOldImage(product.images);
    }

    if (error || productError) {
      alert.error(error || productError);
      dispatch(clearErrors());
    }
    if (success) {
      alert.success('Product updated successfully');
      dispatch({ type: UPDATE_PRODUCT_RESET });
      history.push('/admin/products');
    }
  }, [dispatch, error, productError, updated, success, history, product, productId, alert]);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('name', name);
    formData.set('price', price);
    formData.set('seller', seller);
    formData.set('stock', stock);
    formData.set('category', category);
    formData.set('description', description);
    picked.forEach((pick) => {
      formData.append('oldImages', pick.public_id);
    });
    image.forEach((image) => formData.append('images', image));
    dispatch(updateProduct(formData, productId));
  };
  const onChange = (e) => {
    let files = Array.from(e.target.files);
    setPreviewImage([]);
    setImage([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreviewImage((oldArray) => [...oldArray, reader.result]);
          setImage((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const selectedOldImages = (e, i) => {
    e.preventDefault();
    const check = document.getElementById(i);
    let toggle = check.classList.toggle('checked1');
    if (!toggle) {
      check.classList.toggle('checked');
      toggle = true;
    }
    if (toggle) {
      toggle = check.classList.toggle('checked1');
    }
    let selected = { ...e.target.dataset };
    if (selected.select !== 'false') {
      setPicked((picked) => [...picked, selected]);
    }
    if (selected.select !== 'true') {
      setPicked((picked) => picked.filter((im) => JSON.stringify(im.public_id) !== JSON.stringify(selected.public_id)));
    }
    e.target.dataset.select = e.target.dataset.select !== 'false' ? 'false' : 'true';
  };
  console.log('current picked', picked);
  return (
    <Fragment>
      <MetaData title={isAuthenticated ? "Update Product" : 'Only the excellent products'} />
      <div className="row">
        <div className="col-12 col-md-2">
          <SideBar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <div className="wrapper my-5">
              <form className="shadow-lg" encType="multipart/form-data" onSubmit={submitHandler}>
                <h1 className="mb-4">Update Product</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price_field">Price</label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description_field">Description</label>
                  <textarea
                    className="form-control"
                    id="description_field"
                    rows="8"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="category_field">Category</label>
                  <select
                    className="form-control"
                    id="category_field"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <Fragment key={category}>
                        <option value={category} key={category}>
                          {category}
                        </option>
                      </Fragment>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="stock_field">Stock</label>
                  <input
                    type="number"
                    id="stock_field"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="seller_field">Seller Name</label>
                  <input
                    type="text"
                    id="seller_field"
                    className="form-control"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Select previous images to remove</label>
                  <div style={{ display: 'flex' }}>
                    {oldImage &&
                      oldImage.map((image, i) => (
                        <div className="responsive" key={i}>
                          <img
                            src={image.url}
                            alt="Product"
                            style={{ float: 'left' }}
                            className="mt-3 mr-2 thumbnail"
                            width="105"
                            height="102"
                            data-public_id={image.public_id}
                            data-select={true}
                            onClick={(e) => selectedOldImages(e, i)}
                          />
                          <div className="checked1" id={i}>
                            <div className="icon"></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Images</label>
                  <div className="custom-file">
                    <input
                      type="file"
                      name="product_images"
                      className="custom-file-input"
                      id="customFile"
                      multiple
                      onChange={onChange}
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Images
                    </label>
                  </div>
                  {previewImage &&
                    previewImage.map((image, i) => (
                      <Fragment key={i}>
                        <img src={image} alt="product" className="mt-3 mr-2" width="55" height="52" />
                      </Fragment>
                    ))}
                </div>

                <button
                  id="update_button"
                  type="submit"
                  className="btn btn-block py-3"
                  disabled={loading ? true : false}
                >
                  UPDATE
                </button>
              </form>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};
export default UpdateProduct;
