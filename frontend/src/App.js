import React from 'react';
import './App.css';
import AppHeader from './layout/AppHeader';
import AppMenu from './layout/AppMenu';
import TimeSheetComponent from './components/TimeSheetComponent'

function App() {
  return (
    <React.Fragment>
    <AppHeader></AppHeader>

<div className="container-fluid">
  <div className="row">
  <AppMenu></AppMenu>
    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Maio</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
            <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
          </div>
          <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle" id="navbarDropdown">
            <span data-feather="calendar"></span>
            This week
          </button>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <button className="dropdown-item" href="#">Action</button>
          <button className="dropdown-item" href="#">Another action</button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" href="#">Something else here</button>
        </div>
        </div>
      </div>
   <TimeSheetComponent></TimeSheetComponent>
    </main>
  </div>
</div>
    </React.Fragment>
  );
}

export default App;
