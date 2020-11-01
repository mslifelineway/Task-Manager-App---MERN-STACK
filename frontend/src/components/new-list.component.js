import Axios from "axios";
import { Component } from "react";
import { Link } from "react-router-dom";
import Helpers from "../utils/helpers.method";

export default class NewListComponent extends Component {
  constructor(props) {
    super(props);

    this.onChangeListTitle = this.onChangeListTitle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      title: "",
      error: "",
    };
  }

  //onchange list title
  onChangeListTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.title);

    if (this.state.title) {
      Axios.post(Helpers.getRootUrl() + "lists", { title: this.state.title })
        .then((response) => {
          if (response) {
            if (response.data.status) {
              //created successsfully
              //navigate to home screen with the list id which has stored
              window.location = "/list/" + response.data.result._id;
            } else {
              //failed to create successfully
              this.state({ error: response.data.message });
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

  render() {
    return (
      <div className="centered-content">
        <div className="modal-box">
          <h1 className="title">New List</h1>
          <form onSubmit={this.onSubmit}>
            <input
              onChange={this.onChangeListTitle}
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
                Create
              </button>
            </div>
            <div className="has-text-danger error">
              {this.state.error}
            </div>
          </form>
        </div>
      </div>
    );
  }
}
