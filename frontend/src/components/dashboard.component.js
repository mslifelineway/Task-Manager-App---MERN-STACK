import { Component } from "react";
import "../styles/dashboard.scss";
import { Link } from "react-router-dom";
import PlusIcon from "../plus-icon.svg";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Helpers from "../utils/helpers.method";
import Axios from "axios";

export default class DashboardComponent extends Component {
  constructor(props) {
    super(props);
    this.getTasks = this.getTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.delteList = this.delteList.bind(this);
    this.completeTask = this.completeTask.bind(this);

    this.state = {
      listId: "",
      listArray: [],
      taskArray: undefined,
      message: "",
      error: "",
    };
  }

  //this will update the task constainer whenever we click on list
  componentDidUpdate(prevProps) {
    if (this.props.match.params.listId !== this.state.listId) {
      this.getTasksFromDatabase();
    }
  }

  //delelte list by list id
  delteList() {
    if (this.state.listId) {
      Axios.delete(Helpers.getRootUrl() + "lists/" + this.state.listId)
        .then((response) => {
          if (response) {
            if (response.data.status) {
              //deleted successfully
              //redirect to home
              window.location = "/lists";
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
          this.setState({ error: e });
        });
    }
  }

  //delete task by task id
  deleteTask(taskId) {
    if (taskId) {
      Axios.delete(Helpers.getRootUrl() + "tasks/" + taskId)
        .then((response) => {
          if (response) {
            if (response.data.status) {
              //deleted successfully
              //refresh the selected list
              window.location = "/list/" + this.state.listId;
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
          this.setState({ error: e });
        });
    }
  }

  //this will call only once when component will load
  componentDidMount() {
    this.getTasksFromDatabase();
    this.getListsFromDatabase();
  }

  //get lists from the database
  getListsFromDatabase() {
    //get all the lists
    Axios.get(Helpers.getRootUrl() + "lists")
      .then((response) => {
        if (response) {
          if (response.data.status) {
            if (response.data.result.length > 0) {
              this.setState({
                listArray: response.data.result.map((list, index) => {
                  // console.log('list ' + index + " : " + JSON.stringify(list))
                  return list;
                }),
              });
            } else {
              this.setState({
                listArray: [],
              });
            }
          }
        } else {
          this.message = response.data.message;
          this.error = response.data.result;
        }
      })
      .catch((e) => {
        this.error = e;
      });
  }

  //get tasks from the database
  getTasksFromDatabase() {
    //get all the tasks by list id, we take list id from the params if present
    if (this.props.match.params.listId) {
      this.setState({
        listId: this.props.match.params.listId,
      });
      Axios.get(
        Helpers.getRootUrl() +
          "list/" +
          this.props.match.params.listId +
          "/tasks"
      )
        .then((response) => {
          if (response) {
            if (response.data.status) {
              if (response.data.result.length > 0) {
                this.setState({
                  taskArray: response.data.result.map((task, index) => {
                    return task;
                  }),
                });
              } else {
                this.setState({
                  taskArray: [],
                });
              }
            }
          } else {
            this.message = response.data.message;
            this.error = response.data.result;
          }
        })
        .catch((e) => {
          this.error = e;
        });
    }
  }

  //complete task on task click
  completeTask(task) {
    let newTask = {
      completed: !task.completed,
      _id: task._id,
      title: task.title,
      _listId: task._listId,
    };
    this.setState({
      task: newTask,
    });

    //let's update in the database
    Axios.patch(Helpers.getRootUrl() + "tasks/", { task: newTask })
      .then((response) => {
        if (response) {
          if (response.data.status) {
            //updated
            //refreshing the data without reloading
            this.getTasksFromDatabase();
            this.getListsFromDatabase();
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
        this.setState({ error: e });
      });
  }

  //this method will show the options of task like edit and delete only if task is not completed
  showOptionsOnTaskNotCompleted(task) {
    if (!task.completed) {
      return (
        <div className="task-buttons">
          <Link to={`/edit-task/${task._id}`} className="button edit-button">
            <div className="icon">
              <FontAwesomeIcon icon={faEdit} />
            </div>
          </Link>
          <button
            value={task._id}
            className="button is-danger"
            onClick={() => this.deleteTask(task._id)}
          >
            <div className="icon">
              <FontAwesomeIcon icon={faTrashAlt} />
            </div>
          </button>
        </div>
      );
    }
  }
  //get all the available tasks. since in this case task is available i.e not undefined.
  getAvailableTasks = () => {
    if (this.state.taskArray.length > 0) {
      return this.state.taskArray.map((task, index) => {
        return (
          <div
            className={"task " + (task.completed ? "completed" : "")}
            key={index}
            onClick={() => this.completeTask(task)}
          >
            <div className="task-text">
              <p>{task.title}</p>
            </div>

            {this.showOptionsOnTaskNotCompleted(task)}
          </div>
        );
      });
    } else {
      return (
        <h3 className="empty-state-text">
          There are no tasks here! Click the add button to create a new task.
        </h3>
      );
    }
  };

  getTasks() {
    if (this.state.taskArray) {
      return (
        <div className="task-list-container has-background-light">
          <div className="top-bar">
            <h1 className="title has-text-primary">Tasks</h1>
            <div className="dropdown is-hoverable is-right">
              <div className="dropdown-trigger">
                <button
                  className="button"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu4"
                >
                  <span className="icon is-small">
                    <FontAwesomeIcon icon={faCog} />
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="dropdown-menu4" role="menu">
                <div className="dropdown-content">
                  <Link
                    to={`/edit-list/${this.state.listId}`}
                    className="dropdown-item"
                  >
                    Edit
                  </Link>
                  <p
                    className="is-button dropdown-item has-text-danger"
                    onClick={this.delteList}
                  >
                    Delete
                  </p>
                </div>
              </div>
            </div>
          </div>
          {this.getAvailableTasks()}

          <Link
            to={`/list/${this.state.listId}/new-task`}
            className="circle-add-button button is-primary"
          >
            <img src={PlusIcon} alt="img" className="has-text-white" />
          </Link>
        </div>
      );
    } else {
      return (
        <div className="task-list-container has-background-light">
          <div>
            <h3 className="empty-state-text">
              Please select a list from the sidebar
            </h3>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="centered-content">
        <div className="task-manager-container">
          <div className="sidebar has-background-white">
            <h1 className="title has-text-primary">Lists</h1>
            <div className="list-container">
              {this.state.listArray.map((list, index) => {
                return (
                  <div className="list-menu" key={index}>
                    <Link
                      to={`/list/` + list._id}
                      className={
                        `list-menu-item ` +
                        (this.state.listId === list._id ? `is-active` : `show`)
                      }
                    >
                      <p>{list.title}</p>
                    </Link>
                  </div>
                );
              })}
            </div>
            <Link
              to="/lists/new-list"
              className="button is-primary has-text-white"
            >
              + New List
            </Link>
          </div>

          {this.getTasks()}
        </div>
      </div>
    );
  }
}
