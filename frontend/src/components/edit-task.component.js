import Axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helpers from "../utils/helpers.method";

export default class EditTaskComponent extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      error: "",
      task: {
        _id: "",
        title: "",
        _listId: "",
      },
    };
  }

  componentDidMount() {
    if (this.props.match.params.taskId) {
      this.setState({
        taksId: this.props.match.params.taskId,
      });
      //now after getting the task id from the params let's find the task by id
      this.getTaskById(this.props.match.params.taskId);
    }
  }
  //find the taskTitle by id
  getTaskById(taskId) {
    if (taskId) {
      Axios.get(Helpers.getRootUrl() + "tasks/" + taskId)
        .then((response) => {
          if (response) {
            if (response.data.status) {
              this.setState({ task: response.data.result[0] });
              // this.setState({ title: response.data.result[0].title });
            } else {
              this.setState({ error: response.data.message });
            }
          } else {
            this.setState({
              error: "Oops! something went wrong. please try again...",
            });
          }
        })
        .catch((e) => {
          this.setState({
            error: e,
          });
        });
    }
  }

  //onchange method
  onChangeTitle(e) {
    this.setState({ task: { _id: this.state.task._id,  _listId: this.state.task._listId, title: e.target.value } });
    // this.setState({ task.title: e.target.value});
  }

  //onsubmit method
  onSubmit(e) {
    e.preventDefault();
    if (this.state.task.title && this.state.task._id) {
      Axios.patch(Helpers.getRootUrl() + "tasks", {
        _id: this.state.task._id,
        task: this.state.task,
      })
        .then((response) => {
          if (response) {
            if (response.data.status) {
              //updated, so let's navigate to home screen
              window.location = "/list/" + this.state.task._listId;
            } else {
              this.state({ error: response.data.message });
            }
          } else {
            this.state({
              error: "Oops! something went wrong. please try again...",
            });
          }
        })
        .catch((e) => {
          this.setState({ error: e });
        });
    }
  }

  render() {
    return (
      <div className="centered-content">
        <div className="modal-box">
          <form onSubmit={this.onSubmit}>
            <h1 className="title">Edit Task</h1>

            <input
              onChange={this.onChangeTitle}
              className="input has-background-light is-medium"
              type="text"
              placeholder="Enter task name..."
              value={this.state.task.title}
            />
            <br />
            <br />
            <div className="buttons is-right">
              <Link to="/" className="button is-medium">
                Cancel
              </Link>
              <button className="button is-primary has-text-white is-medium">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
