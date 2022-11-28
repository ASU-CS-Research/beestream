"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VideoService = void 0;
var core_1 = require("@angular/core");
var io = require('socket.io-client');
/*VideoService
* This class acts as a wrapper for socket.io communications for all of our
* clientside modules.  As such, it is an injectable RXJS service.
*/
var VideoService = /** @class */ (function () {
    function VideoService() {
        this.socket = io();
    }
    /*on
    * This method will handle all socket.on calls and intialize a socket listener
    * with the appropriate callback function.
    *
    * @params:
    *   eventName - the name of the event that we want to listen for.
    *   callback  - the callback to be mapped to the event listener.
    */
    VideoService.prototype.on = function (eventName, callback) {
        if (this.socket) {
            this.socket.on(eventName, function (data) {
                callback(data);
            });
        }
    };
    /*emit
    * This method will emit a socket.io message with specified data.
    *
    * @params:
    *   eventName - the name of the event to emit.
    *   data      - the data to send with our message/event.
    */
    VideoService.prototype.emit = function (eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    };
    /*removeListener
    * This method will remove the listener for a specified eventName.
    *
    * @params:
    *   eventName - the event name to remove the listener for.
    */
    VideoService.prototype.removeListener = function (eventName) {
        if (this.socket) {
            this.socket.removeListener(eventName);
        }
    };
    VideoService = __decorate([
        (0, core_1.Injectable)()
    ], VideoService);
    return VideoService;
}());
exports.VideoService = VideoService;
