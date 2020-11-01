import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.scss';

import DashboardComponent from './components/dashboard.component'
import NewTaskComponent from './components/new-task.component'
import NewListComponent from './components/new-list.component'
import EditListComponent from './components/edit-list.component'
import EditTaskComponent from './components/edit-task.component'


function App() {
  return (
    <Router>
      <Route path="/" exact component={DashboardComponent} />
      <Route path="/lists" exact component={DashboardComponent} />
      <Route path="/list/:listId" exact component={DashboardComponent} />
      <Route path="/list/:listId/new-task" exact component={NewTaskComponent} />
      <Route path="/lists/new-list" exact component={NewListComponent} />
      <Route path="/edit-list/:listId" exact component={EditListComponent} />
      <Route path="/edit-task/:taskId" exact component={EditTaskComponent} />
      {/* <Route path="/**" exact component={PageNotFoundComponent} /> */}
    </Router>
  );
}

export default App;
