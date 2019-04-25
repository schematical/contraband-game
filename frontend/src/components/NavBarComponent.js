import React, { Component } from 'react';



class NavBarComponent extends Component {
  render() {
    return (
        <div className="navbar navbar-inverse navbar-fixed-top">
            <div className="navbar-inner">
                <div className="container">
                    <button type="button" className="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <a className="brand" href="#">Project name</a>
                    <div className="nav-collapse collapse">
                        <ul className="nav">
                            <li className="active"><a href="#">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">Dropdown <b
                                    className="caret"></b></a>
                                <ul className="dropdown-menu">
                                    <li><a href="#">Action</a></li>
                                    <li><a href="#">Another action</a></li>
                                    <li><a href="#">Something else here</a></li>
                                    <li className="divider"></li>
                                    <li className="nav-header">Nav header</li>
                                    <li><a href="#">Separated link</a></li>
                                    <li><a href="#">One more separated link</a></li>
                                </ul>
                            </li>
                        </ul>
                        <form className="navbar-form pull-right">
                            <input className="span2" type="text" placeholder="Email" />
                                <input className="span2" type="password" placeholder="Password" />
                                <button type="submit" className="btn">Sign in</button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
  }
}

export default NavBarComponent;
