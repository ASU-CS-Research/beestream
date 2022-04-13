"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.StreamComponent = void 0;
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var common_1 = require("@angular/common");
var video_service_1 = require("../video/video.service");
/*This component will handle the streaming page and video streaming.
* This file uses the stream service to interface with the videos.
*/
var StreamComponent = /** @class */ (function () {
    /*constructor
    * Sets and initializes necessary fields.
    *
    * @params:
    *   _videoService: VideoService - an object wrapper for socket.io interactions
    *   document: DOCUMENT          - an object encapsulation of the DOM, used for
    *                                 all DOM interactions.
    */
    function StreamComponent(_videoService, document) {
        this._videoService = _videoService;
        this.document = document;
        this.videoUrl = null;
        this.checkUrl = null;
    }
    StreamComponent_1 = StreamComponent;
    /*ngOnInit
    * This overrides the ngOnInit function to add additional functionality.
    * This initializes arrays for the hives option list, starts the necessary
    * listeners, and emits the getStreamHive message to get the hives list.
    */
    StreamComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.hives = new Array();
        this.videoLoading = false;
        this.streamHiveSelect = null;
        this.error = null;
        this.correctLength = false;
        this._videoService.on('streamHiveList', function (hvlst) {
            _this.hives = hvlst.hiveNames.sort();
        });
        this._videoService.on('streamRequestRecieved', function (data) {
            _this.videoLoading = true;
        });
        this._videoService.on('streamReady', function (data) {
            if (_this.videoUrl == data.url) {
                _this.videoLoading = false;
            }
            _this.checkUrl = data.url;
            _this.error = null;
        });
        this._videoService.on('novideo', function (data) {
            console.log(data.message);
            _this.error = data.message;
        });
        this._videoService.emit('getStreamHive', {});
    };
    /*checkDuration
    * This method verifies that the video is longer than 50 seconds.  If we have
    * a complete video it should last longer than 50 seconds, if it does not, we
    * request a new video after a delay.
    *
    * @params:
    *   video: HTMLVideoElement - the HTML video player element to check the
    *           duration of.
    */
    StreamComponent.prototype.checkDuration = function (video) {
        var _a;
        var hive = this.getVideoInfo(this.checkUrl)[0];
        if (video.duration < 50) {
            //Emit closeSession to tell the server to delete our session's video
            this._videoService.emit('closeSession', { video: this.checkUrl });
            //call reattempt to reattempt the stream.
            this.reattempt(hive);
        }
        else {
            this.videoLoading = false;
            this.correctLength = true;
            this.videoUrl = this.checkUrl;
            _a = this.getVideoInfo(this.videoUrl), this.hive = _a[0], this.date = _a[1], this.time = _a[2];
        }
    };
    /*resubmit
    * This function sends the hive choice as a 'getStreamVideo' message from a
    * context.  It will use service to send a message containing hive and videoUrl
    * This is meant for use by checkDuration.
    *
    * @params:
    *   hive: string     - the hive name that is currently being streamed
    *   videoUrl: string - the current videoUrl, which defines the current video
    *   service          - the calling object's socketio service object
    */
    StreamComponent.resubmit = function (hive, videoUrl, service) {
        if (hive) {
            service.emit('getStreamVideo', {
                hive: hive,
                previous: videoUrl
            });
        }
    };
    /*reattempt
    * Reloads the video after a 10 second delay.
    *
    * @params:
    *   hive: string - the name of the hive currently being streamed
    */
    StreamComponent.prototype.reattempt = function (hive) {
        this.videoLoading = true;
        var url = this.checkUrl;
        this.checkUrl = null;
        setTimeout(StreamComponent_1.resubmit.bind(null, hive, url, this._videoService), 10000);
    };
    /*showTitle
    * This function takes the place of the condition for the video title div.
    * This has been implemented to simplify our angluar template and comply with
    * angular standards.
    */
    StreamComponent.prototype.showTitle = function () {
        return this.videoUrl && !this.error &&
            this.hive && this.date && this.time;
    };
    /*showVideo
    * this fucntion takes the place of the condition for the video div.
    * This has been implemented to simplify our angular template and comply with
    * angular standards.
    */
    StreamComponent.prototype.showVideo = function () {
        return this.videoUrl && !this.error;
    };
    /*onSubmit
    * This function sends the hive choice as a 'getStreamVideo' message.
    * The selection for the hives comes from the input box.
    *
    * @params:
    *   hive: string - the name of the hive currently being streamed
    */
    StreamComponent.prototype.onSubmit = function (hive) {
        if (hive != null && !this.videoLoading) {
            var message = {
                hive: hive,
                previous: this.videoUrl
            };
            this._videoService.emit('getStreamVideo', message);
        }
    };
    /*getVideoInfo
    * This function handles the formatting of the video's hive, date, and time
    * into a human readable format to be displayed.
    *
    * @params:
    *   The videoUrl value to be split up into  a readable format.
    */
    StreamComponent.prototype.getVideoInfo = function (videoMetaData) {
        var _a;
        var newVideo = videoMetaData.split('/')[2];
        var hive, date, time;
        _a = newVideo.split('@'), hive = _a[0], date = _a[1], time = _a[2];
        time = time.replace(/-/g, ':');
        var displayTime = +time.substr(0, 2) > 12 ?
            "".concat(+time.substr(0, 2) - 12).concat(time.substr(2, 7), "PM") :
            "".concat(time, "AM");
        date = "".concat(date.substr(5, 2), "/").concat(date.substr(8, 2), "/").concat(date.substr(0, 4));
        return [hive, date, displayTime];
    };
    /*beforeunloadHandler
    * This function handles the user closing the window.  It sends the
    * 'closeSession' signal to make sure that the server cleans up the video
    * that the client was streaming.
    *
    * @params:
    *   event - the event to be handled.  In this case it is ignored as the method
    *            invocation is bouind to an event.
    */
    StreamComponent.prototype.beforeunloadHandler = function (event) {
        this._videoService.emit('closeSession', { video: this.videoUrl });
    };
    /*ngOnDestroy
    * This function makes sure that our socket removes its listeners when the
    * connection is destroyed/browser is closed.  This also sends the closeSession
    * message containing the current video's url since we are done with that video
    *
    * Have to stop listening for 'hiveList', 'dateList', and 'timeList'.
    */
    StreamComponent.prototype.ngOnDestroy = function () {
        this._videoService.emit('closeSession', { video: this.videoUrl });
        this._videoService.removeListener('streamHiveList');
        this._videoService.removeListener('streamRequestRecieved');
        this._videoService.removeListener('streamReady');
    };
    var StreamComponent_1;
    __decorate([
        (0, core_2.HostListener)('window:beforeunload', ['$event'])
    ], StreamComponent.prototype, "beforeunloadHandler");
    StreamComponent = StreamComponent_1 = __decorate([
        (0, core_2.Component)({
            selector: 'stream',
            template: require('./stream.template.html'),
            providers: [video_service_1.VideoService]
        }),
        __param(1, (0, core_1.Inject)(common_1.DOCUMENT))
    ], StreamComponent);
    return StreamComponent;
}());
exports.StreamComponent = StreamComponent;
