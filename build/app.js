"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var app = (0, express_1["default"])();
app.get("/", function (_req, res) {
    return res.status(200).json({
        message: "success",
        data: "Welcome to Audioplile Backend server"
    });
});
exports["default"] = app;
