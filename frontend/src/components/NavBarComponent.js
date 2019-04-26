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
                    <a className="brand" href="#">Necropolis by Schematical Games</a>
                    <div className="nav-collapse collapse">
                        <ul className="nav">
                            <li className="active"><a href="#">Home</a></li>

                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">View <b
                                    className="caret"></b></a>
                                <ul className="dropdown-menu">
                                    <li><a href="#">None</a></li>
                                    <li><a href="#">Population</a></li>

                                    <li className="divider"></li>
                                    <li><a href="#">Debug</a></li>
                                </ul>
                            </li>
                        </ul>
                        {/*<form className="navbar-form pull-right">
                            <input className="span2" type="text" placeholder="Email" />
                            <input className="span2" type="password" placeholder="Password" />
                            <button type="submit" className="btn">Sign in</button>
                        </form>*/}
                        <div className="pull-right">
                            <ul className="nav">
                                <li className="active">
                                    <a href="#">{ Math.floor(this.props.app.state.globalLifecycle/1000)} - Cycle: { this.props.app.state.cycleCount }</a>
                                </li>
                            </ul>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
  }
}

export default NavBarComponent;
