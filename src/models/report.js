import { getUrl } from '../services/report';

export default {
  namespace: 'report',

  state: {
    url: '',
    indicatorUrl: '',
    costTarget: '',
    monthDetail: '',
    groupEnvironmentCost: '',
    regionalCost: '',
    outBadStatis: '',
    returnLandStatis: '',
    waterOverStatis: '',
    oneUsedStatis: '',
    areaUsedStatis: '',
    dataInsertListen: '',
    waterUsedStatis: '',
    BioGasPoolMonitor: '',
    ReturnLandTargetStatistic: '',
    returnLandStatisDetail: '',
    ReturnLandTargetStatisticByCompany: '',
  },

  effects: {
    *getUrl({ payload, target }, { call, put }) {
      const response = yield call(getUrl, payload);
      if (response && response.rel === true) {
        yield put({
          type: 'url',
          payload: response.data,
          target,
        });
      }
    },
  },

  reducers: {
    url(state, action) {
      return {
        ...state,
        [action.target]: action.payload,
      };
    },
  },
};
