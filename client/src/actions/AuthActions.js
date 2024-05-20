import * as AuthApi from "../api/AuthRequests";
export const logIn = (formData, navigate) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.logIn(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    navigate("/", { replace: true });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL", error: error });
  }
};

export const signUp = (formData, navigate) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.signUp(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
    navigate("/", { replace: true });
  } catch (error) {
    console.log(error);
    dispatch({ type: "AUTH_FAIL", error: error });
  }
};

export const logout = ()=> async(dispatch)=> {
  dispatch({type: "LOG_OUT"})
}
