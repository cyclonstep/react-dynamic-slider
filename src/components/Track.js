import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Track extends Component {
    static propTypes = {
        color: PropTypes.string,
        length: PropTypes.number,
    };

    render() {
        let trackStyles = {
            backgroundColor: this.props.color,
            get width() { return !this.props.length ? '100%' : `${length}%`;},
            position: 'absolute',
            bottom: 0,
        };

        return (
            <div style={trackStyles} />
        );
    }
}
