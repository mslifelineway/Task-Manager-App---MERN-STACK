import Axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Helpers from "../utils/helpers.method";

export default class EditListComponent extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      listId: "",
      title: "",
      error: "",
    };
  }

  componentDidMount() {
    // console.log(this.props)
    //get all the tasks by list id, we take list id from the params if present
    if (this.props.match.params.listId) {
      this.setState({
        listId: this.props.match.params.listId,
      });
      //now after getting the listId from the params let's find the list by id
      this.getListById(this.props.match.params.listId);
    }
  }

  //find the listTitle by id
  getListById(listId) {
    if (listId) {
      Axios.get(Helpers.getRootUrl() + "lists/" + listId)
        .then((response) => {
          if (response) {
            if (response.data.status) {
              this.setState({ title: response.data.result[0].title });
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
    this.setState({ title: e.target.value });
  }

  //onsubmit method
  onSubmit(e) {
    e.preventDefault();

    if (this.state.title && this.state.listId) {
      Axios.patch(Helpers.getRootUrl() + "lists/" + this.state.listId, {
        _id: this.state.listId,
        list: { _id: this.state.listId, title: this.state.title },
      })
        .then((response) => {
          if (response) {
            if (response.data.status) {
              //updated, so let's navigate to home screen
              window.location = "/list/" + this.state.listId;
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
            <h1 className="title">Edit list</h1>

            <input
              onChange={this.onChangeTitle}
              className="input has-background-light is-medium"
              type="text"
              placeholder="Enter list name..."
              value={this.state.title}
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
