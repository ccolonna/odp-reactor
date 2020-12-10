"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _leafletIcon = _interopRequireDefault(require("../functions/leafletIcon"));

var _LeafletIconParams = _interopRequireDefault(require("../classes/LeafletIconParams"));

var _bluMarkerSvg = _interopRequireDefault(require("../uri-encoded-icons/blu-marker.svg.uri"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var blueMarkerIconParams = new _LeafletIconParams["default"]({
  iconUrl: _bluMarkerSvg["default"],
  className: 'ld-ui-div-icon',
  iconAnchor: [15, 50],
  popupAnchor: [0, -50]
});
/**
 * Marker icon
 */

var blueMarkerIcon = (0, _leafletIcon["default"])(blueMarkerIconParams);
var _default = blueMarkerIcon;
exports["default"] = _default;