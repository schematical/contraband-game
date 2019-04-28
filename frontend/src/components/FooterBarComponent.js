import React, { Component } from 'react';



class FooterBarComponent extends Component {
  render() {
    return (
        <div className="navbar navbar-inverse navbar-fixed-bottom">
            <div className="navbar-inner">
                <div className="container">

                    {/*<a className="brand" href="#">Necropolis by Schematical Games</a>*/}

                    <div className="pull-right">
                        <ul className="nav">
                            <li className="active">
                                <a href="#">Bob</a>
                            </li>
                        </ul>

                    </div>
                </div>

            </div>
        </div>

    );
  }
}

export default FooterBarComponent;
