import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Marker extends Component {
    render() {
        let {
            clsName,
            color,
            defaultMarker,
            position,
            sliderSize,
            markerSize,
            markerNumber
        } = this.props;
        
        const markerCentering = (sliderSize - markerSize) * 0.5;

        // console.log("marker position: " + this.props.position);
        // console.log("marker sliderSize: " + sliderSize);
        // console.log("marker markerSize: " + markerSize);
        // console.log("markerCentering: " + markerCentering);
        const markerWrapperStyles = {
            position: 'absolute',
            left: `${position}%`,
            top: '0px',
            bottom: undefined,
            marginTop: `${markerCentering}px`,
            marginLeft: `-${markerSize * 0.5}px`,
            marginBottom: undefined,
            display: position === 0 ? 'none' : 'block'
        };

        if (!this.props.customMarker) {
            const defaultMarkerStyles = {
                backgroundColor: color,
                borderRadius: '100%',
                height: `${markerSize}px`,
                width: `${markerSize}px`
            };
            defaultMarker = <div style={defaultMarkerStyles} />;
        }

        return ( 
            <div
                className={`${clsName}-${markerNumber}-marker`}
                style={markerWrapperStyles}
            >
                {this.props.customMarker}
                {defaultMarker && defaultMarker}
            </div>
        );
    }
}

Marker.propTypes = {
    clsName: PropTypes.string,
    color: PropTypes.string,
    customMarker: PropTypes.node,
    offsetLeft: PropTypes.number,
    offsetTop: PropTypes.number,
    position: PropTypes.number,
    sliderSize: PropTypes.number,
    markerSize: PropTypes.number,
    markerNumber: PropTypes.number
};

Marker.defaultProps = {
    clsName: 'dynamic-slider',
    position: 0,
};
