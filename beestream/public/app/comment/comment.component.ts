import { Component,
         Input,
         OnDestroy,
         OnChanges,
         SimpleChange,
         ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VideoService } from '../video/video.service';

/*CommentComponent
* This component displays a comments box as well as a list of comments for
* the current video.
*/
@Component({
  selector: 'comments',
  template: require('./comment.template.html'),
  providers: [VideoService]
})
export class CommentComponent implements OnChanges, OnDestroy{
  @Input() video: any;
  @ViewChild('commentForm') myForm;
  hive: string;
  date: string;
  time: string;
  displayTime: string;
  maxUserLength: number = 30;
  maxCommentLength: number = 160;
  loadedComments: number = 5;
  username: string;
  comment: string;
  comments: Array<any>;
  errors: Array<any>;
  showHelp: boolean = false;

  /*constructor
  * Constructor for CommentComponent
  * Gets the videoservice and puts it in the _ioService attribute
  *
  * @params:
  *   _ioService: VideoService - a service instance for socket io interactions
  */
  public constructor(private _ioService: VideoService) { }

  /*ngOnInit
  * This overrides the ngOnInit function to add additional functionality.
  */
  public ngOnInit() {
    //Handles errors associated wtih saving comments.
    this._ioService.on('commentError', (message) => {
      this.errors.push(message.message);
      console.log(`Recieved an error: ${message.message}`);
    });
    //Handles successful saving of comments.  Requests new list of comments.
    this._ioService.on('commentSuccess', (message) => {
      var videoDate = new Date(`${this.date.substr(6, 4)}-${this.date.substr(0, 2)}-${this.date.substr(3, 2)}T${this.time}`)
      this._ioService.emit('getComments', {
        hive: this.hive,
        datetime: videoDate
      });
      this.loadedComments++;
    });
    //Handler for recieving and populating a list of comments.
    this._ioService.on('commentList', (message) => {
      this.comments = message.comments;
    });
    this._ioService.emit('getComments', {
      hive: this.hive,
      datetime: new Date(`${this.date.substr(6, 4)}-${this.date.substr(0, 2)}-${this.date.substr(3, 2)}T${this.time}`)
    });
  }

  /*ngOnChanges
  * This method handles variable changes.
  * Whenever the video source changes, we process that source breaking it up
  * into hive, date, and time.
  *
  * @params:
  *   changes: SimpleChange - an array of key:value pairs holding the input
  *                           variable changes.
  */
  public ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    //console.log("ngOnChanges is being run here.");
    //throw new Error('Getting an error in ngOnChanges');
    if (changes['video'].currentValue != null) {
      var newVideo = changes['video'].currentValue;
      console.log(newVideo);
      newVideo = newVideo.split('/')[2];
      [this.hive, this.date, this.time] = newVideo.split('@');
      this.time = this.time.replace(/-/g, ':');
      this.displayTime = +this.time.substr(0, 2) > 12 ?
        `${+this.time.substr(0, 2) - 12}${this.time.substr(2, 7)}PM` :
        `${this.time}AM`;
      this.date = `${this.date.substr(5, 2)}/${this.date.substr(8, 2)}/${this.date.substr(0, 4)}`;
      this._ioService.emit('getComments', {
        hive: this.hive,
        datetime: new Date(`${this.date.substr(6, 4)}-${this.date.substr(0, 2)}-${this.date.substr(3, 2)}T${this.time}`)
      });
    }
  }

  /*submitComment
  * This method is a handler for our comment form submission.
  * This will emit the proper socket.io message to store the comment and resets
  * form state.
  *
  * @params:
  *   form: NgForm - the form to submit, should have value username and comment
  *   hive: string - the current hive
  *   date: string - the current video's date
  *   time: string - the current video's time
  */
  private submitComment(form: NgForm, hive: string, date: string, time: string) {
    //console.log(`Submit comment being run with hive ${hive}, date ${date}, and time ${time}.`);
    if (form.valid) {
      var usernametemp = form.value.username;
      var videoDate = new Date(`${date.substr(6, 4)}-${date.substr(0, 2)}-${date.substr(3, 2)}T${time}`);
      console.log(`The date given for the video: ${videoDate}`)
      this._ioService.emit('newComment', {
        username: form.value.username,
        comment: form.value.comment,
        hive: hive,
        datetime: videoDate
      });
      this.myForm.resetForm();
      this.myForm.controls['username'].setValue(usernametemp);
    }
  }

  /*formatDate
  * This method is a helper method to format the date into a readable format.
  *
  * @params:
  *   d: string - a string representing the datetime in a format that Date()
  *               will understand.
  */
  private formatDate(d: string) {
    var date = new Date(d);
    var minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
    var time = +date.getHours() > 12 ?
      `${date.getHours() - 12}:${minutes}PM` :
      `${date.getHours()}:${minutes}AM`;
    var dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` +
                     ` at ${time}`;
    return dateString;
  }

  /*moreComments
  * This method returns the remaining number of comments to load if it is less
  * than 5, or 5 if it is larger.
  */
  private moreComments() {
    if (this.comments != null && this.loadedComments < this.comments.length) {
      return ((this.comments.length - this.loadedComments) < 5) ?
       (this.comments.length - this.loadedComments): 5;
    }
    return 0;
  }

  /*showMoreComments
  * This method increases the "loadedComments" field by the appropriate amount
  * so that more comments are loaded on screen
  */
  private showMoreComments() {
    if (this.comments != null && this.loadedComments < this.comments.length) {
      this.loadedComments += ((this.comments.length - this.loadedComments) < 5) ?
       (this.comments.length - this.loadedComments): 5;
    }
  }

  /*ngOnDestroy
  * This function makes sure that our socket removes its listeners when the
  * connection is destroyed/browser is closed.
  *
  * Have to stop listening for 'commentList', 'commentSuccess', 'commentError'
  */
  public ngOnDestroy() {
    this._ioService.removeListener('commentList');
    this._ioService.removeListener('commentSuccess');
    this._ioService.removeListener('commentError');
  }
}
