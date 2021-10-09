import React, {useEffect, Fragment} from 'react';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../layouts/MetaData';
import { useAlert } from 'react-alert';
import Loader from '../layouts/Loader';
import SideBar from './SideBar';
import {useDispatch, useSelector} from 'react-redux';
import { DELETE_PROFILE_RESET } from '../../constants/authConstants';
import { clearErrors, getAllUsers, deleteUser } from '../../actions/authActions';

const ListUsers = ({history}) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { isAuthenticated } = useSelector(state=>state.auth);
    const {loading, users, error} = useSelector(state => state.adminAllUsers);
    const {deleting, message, deleteError} = useSelector(state=>state.deleteProfile);
    useEffect(() => {
    dispatch(getAllUsers())
    if(error){
        alert.error(error)
        dispatch(clearErrors());
    }
    if(deleting){
        alert.success(message)
        dispatch({type:DELETE_PROFILE_RESET})
        history.push('/admin/users')
    }
    if(deleteError){
        alert.error(deleteError);
        dispatch(clearErrors());
    }
    }, [dispatch,alert,error,deleting,message,history,deleteError])
    const setUsers = () => {
        const data = {
          columns: [
            {
              label: 'UserID',
              field: 'id',
              sort: 'asc',
            },
            {
              label: 'Name',
              field: 'nameOfUser', // rows and columns are connected using this
              sort: 'asc',
            },
            {
              label: 'Role',
              field: 'role',
              sort: 'asc',
            },
            {
              label: 'Email',
              field: 'email',
              sort: 'asc',
            },
            {
              label: 'Actions',
              field: 'actions',
              sort: 'asc',
            },
          ],
          rows: [],
        };
        users && users.forEach((user) => {
          data.rows.push({
            id:user._id,
            nameOfUser:user.name,
            email: user.email,
            role: <p style={{ color: user.role !== 'admin' ? 'indianred' : 'green' }}>{user.role}</p>,
            actions: (
              <Fragment>
              <button className="btn btn-danger py-1 px-2 ml-2" 
              data-toggle="tooltip" data-placement="left" title="Delete"
              onClick={() => userDelete(user._id)}>
                  <i className="fa fa-trash"></i>
                </button>
              </Fragment>
            ),
          });
        });
        return data;
      };
      const userDelete = (user) => {
        dispatch(deleteUser(user));
      }
    return <Fragment>
              <MetaData title={isAuthenticated ? "All Users" : 'Only the excellent products'} />
              <div className="row">
                <div className="col-12 col-md-2">
                  <SideBar />
                </div>
        
                <div className="col-12 col-md-10">
                  <Fragment>
                    <h1>All Users</h1>
                    {loading||deleting ?(
                      <Loader />
                    ) : (
                      <MDBDataTable
                        data={setUsers()}
                        className="px-3"
                        bordered
                        striped
                        hover
                        entries={5}
                        entriesOptions={[5, 10, 15]}
                      />
                    )}
                  </Fragment>
                </div>
              </div>
            </Fragment>
}

export default ListUsers
