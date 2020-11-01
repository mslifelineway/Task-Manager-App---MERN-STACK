import Axios from "axios";
import { Component } from "react";
import { Link } from "react-router-dom";
import Helpers from "../utils/helpers.method";

export default class NewTaskComponent extends Component {
  constructor(props) {
    super(props);

    this.onChangeTaskTitle = this.onChangeTaskTitle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);

    this.state = {
      listId: "",
      taskTitle: "",
      error: "",
    };
  }

  //this method will call on component load but once
  componentDidMount(props) {
    //get all the tasks by list id, we take list id from the params if present
    if (this.props.match.params.listId) {
      this.setState({
        listId: this.props.match.params.listId,
      });
    }
  }

  //onchange task title
  onChangeTaskTitle(e) {
    this.setState({
      taskTitle: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    //let's store in database
    if (this.state.taskTitle && this.state.listId) {
      Axios.post(
        Helpers.getRootUrl() + "list/" + this.state.listId + "/tasks",
        { title: this.state.taskTitle, listId: this.state.listId }
      )
        .then((response) => {
          if (response) {
            if (response.data.status) {
              //created successfully
              //navigate to home page with list id
              window.location = "/list/" + this.state.listId;
            } else {
              //failed
              this.state({ error: response.data.message });
            }
          } else {
            //something went wrong
            this.setState({
              error: "Oops! something went wrong, please try again...",
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
          <h1 className="title">New Task</h1>
          <form onSubmit={this.onSubmit}>
            <input
              onChange={this.onChangeTaskTitle}
              className="input has-background-light is-medium"
              type="text"
              placeholder="Enter task name..."
              value={this.state.taskTitle}
            />
            <br />
            <br />
            <div className="buttons is-right">
              <Link to="/" className="button is-medium">
                Cancel
              </Link>
              <button className="button is-primary has-text-white is-medium">
                Create
              </button>
            </div>
            <div className="has-text-danger error">{this.state.error}</div>
          </form>
        </div>
      </div>
    );
  }
}
