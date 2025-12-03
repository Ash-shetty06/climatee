function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
import { useState } from 'react';
var useLocation = () => {
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState(null);
  var getCurrentLocation = () => {
    return new Promise(resolve => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        resolve(null);
        return;
      }
      setLoading(true);
      navigator.geolocation.getCurrentPosition(/*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* (position) {
          var {
            latitude,
            longitude
          } = position.coords;
          try {
            var _data$address, _data$address2, _data$address3, _data$address4;
            var response = yield fetch("https://nominatim.openstreetmap.org/reverse?lat=".concat(latitude, "&lon=").concat(longitude, "&format=json"));
            var data = yield response.json();
            setLoading(false);
            resolve({
              lat: latitude,
              lon: longitude,
              city: ((_data$address = data.address) === null || _data$address === void 0 ? void 0 : _data$address.city) || ((_data$address2 = data.address) === null || _data$address2 === void 0 ? void 0 : _data$address2.town) || ((_data$address3 = data.address) === null || _data$address3 === void 0 ? void 0 : _data$address3.village) || 'Unknown',
              country: ((_data$address4 = data.address) === null || _data$address4 === void 0 ? void 0 : _data$address4.country) || ''
            });
          } catch (err) {
            setLoading(false);
            resolve({
              lat: latitude,
              lon: longitude,
              city: 'Current Location',
              country: ''
            });
          }
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }(), err => {
        setLoading(false);
        setError('Unable to retrieve your location');
        console.error('Geolocation error:', err);
        resolve(null);
      });
    });
  };
  return {
    getCurrentLocation,
    loading,
    error
  };
};
export default useLocation;