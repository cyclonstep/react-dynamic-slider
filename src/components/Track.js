import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Track extends Component {
    render() {
        let length = this.props.length;
        
        let trackStyles = {
            backgroundColor: this.props.color,
            get width() { return !length ? '100%' : `${length}%`;},
            position: 'absolute',
            bottom: 0,
        };

        console.log(trackStyles);

        return (
            <div style={trackStyles} />
        );
    }
}

Track.propTypes = {
    color: PropTypes.string,
    length: PropTypes.number,
};
