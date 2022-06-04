"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var app_1 = __importDefault(require("./app"));
require("dotenv/config");
var _a = process.env, PORT = _a.PORT, HOST = _a.HOST;
app_1["default"].listen(PORT, function () {
    // eslint-disable-next-line no-console
    console.log("Server started on http://".concat(HOST, ":").concat(PORT));
});
