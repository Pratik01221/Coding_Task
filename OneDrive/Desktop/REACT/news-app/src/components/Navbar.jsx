import React, { Component } from 'react'

export class Navbar extends Component {
  render() {
    return (
      <div style={styleNavbar}>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">NEWSFLASH</a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="/navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" href="/">Home</a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/">About</a>
                </li>
              </ul>

              <form className="d-flex">
                <input className="form-control me-2" type="search" placeholder="Search" />
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

export default Navbar


const styleNavbar = {
  backgroundColor: 'white',
  fontFamily: 'Times New Roman',
  color: 'black',
  border: '1px solid black',
  padding: '20px',
  // display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}