import { put, takeEvery } from "redux-saga/effects"
import axios from "axios"
import { registerRequest, loginRequest, getUserInfoRequest } from "../auth"
import { notification } from "antd";


function* loginSaga ( action )
{
    try
    {
        const { data, callback } = action.payload;
        console.log(data)
        const result = yield axios.post( "http://localhost:4000/login", data );
        yield localStorage.setItem( "accessToken", result.data.accessToken )
        yield callback();
        yield put( {
            type: "loginSuccess",
            payload: {
                data: result.data,
            }

        } );
        notification.success( {
            message: "Đăng nhập thành công"
        } )
    }
    catch ( e )
    {
        yield put( {
            type: "loginFail",
            payload: {
                error: "Email hoặc mật khẩu không đúng",
            }
        } )
    }
}


function* registerSaga ( action )
{
    try
    {
        const { data, callback } = action.payload;
        const result = yield axios.post( "http://localhost:4000/register", data );
        yield callback();
        yield put( {
            type: "registerSuccess",
            payload: {
                data: result.data,
            }

        } );
        notification.success( {
            message: "Đăng ký thành công"
        } )
    }
    catch ( e )
    {
        yield put( {
            type: "registerFail",
            payload: {
                error: e.response.data,
            }
        } )
    }
}



function* getUserInfoSaga ( action )
{
    try
    {
        const { id } = action.payload;
        const result = yield axios.get( `http://localhost:4000/users/${ id }` );
        yield put( {
            type: "getUserInfoSuccess",
            payload: {
                data: result.data,
            }

        } );
    }
    catch ( e )
    {
        yield put( {
            type: "getUserInfoFail",
            payload: {
                error: "lỗi",
            }
        } )
    }
}
export default function* authSaga ()
{
    yield takeEvery( registerRequest, registerSaga )
    yield takeEvery( loginRequest, loginSaga )
    yield takeEvery( getUserInfoRequest, getUserInfoSaga )
}