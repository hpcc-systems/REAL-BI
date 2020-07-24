import {
  GET_WORKSPACE,
  SET_WORKSPACE_ERROR,
  UPDATE_WORKSPACE,
  CLEAR_WORKSPACE,
  UPDATE_WORKSPACE_DASHBOARDS,
} from './actions';

const initState = { errors: {}, workspace: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    case GET_WORKSPACE:
    case UPDATE_WORKSPACE:
    case CLEAR_WORKSPACE:
      return { ...state, errors: {}, workspace: payload };
    case SET_WORKSPACE_ERROR:
      return { ...state, errors: payload };
    case UPDATE_WORKSPACE_DASHBOARDS:
      return { ...state, errors: {}, workspace: { ...state.workspace, openDashboards: payload } };
    default:
      return state;
  }
};