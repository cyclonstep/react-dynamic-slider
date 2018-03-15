import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Track extends Component {
    render() {
        let { length, clsName } = this.props;
        
        let trackStyles = {
            backgroundColor: this.props.color,
            get width() { return !length ? '0%' : `${length}%`;},
            position: 'absolute',
            bottom: 0,
            height: '100%'
        };

        console.log(trackStyles);

        return (
            <div  
                className={`${clsName}-track`} 
                style={trackStyles} 
            />
        );
    }
}

Track.propTypes = {
    clsName: PropTypes.string,
    color: PropTypes.string,
    length: PropTypes.number,
};

Track.defaultProps = {
    clsName: 'dynamic-slider'
}
