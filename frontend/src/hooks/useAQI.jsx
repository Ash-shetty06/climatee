function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import { useState, useEffect } from 'react';
import { aqiAPI } from '../services/api';
var useAQI = location => {
  var [aqiData, setAQIData] = useState(null);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState(null);
  useEffect(() => {
    if (!location) return;
    var fetchAQI = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* () {
        setLoading(true);
        setError(null);
        try {
          var response = yield aqiAPI.getCurrent(location.lat, location.lon, location.city);
          if (response.data.success) {
            setAQIData(response.data.data);
          } else {
            setError('Failed to fetch AQI data');
          }
        } catch (err) {
          var _err$response;
          setError(((_err$response = err.response) === null || _err$response === void 0 || (_err$response = _err$response.data) === null || _err$response === void 0 ? void 0 : _err$response.message) || 'Network error');
          console.error('AQI fetch error:', err);
        } finally {
          setLoading(false);
        }
      });
      return function fetchAQI() {
        return _ref.apply(this, arguments);
      };
    }();
    fetchAQI();
  }, [location]);
  return {
    aqiData,
    loading,
    error
  };
};
export default useAQI;