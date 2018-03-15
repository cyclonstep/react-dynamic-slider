import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Thumb extends Component {
    render() {

        let {
            clsName,
            color,
            defaultThumb,
            position,
            sliderSize,
            thumbSize
        } = this.props;

        console.log("position: " + this.props.position);

        const thumbCentering = (sliderSize - thumbSize) * 0.5;
        const thumbWrapperStyles = {
            position: 'absolute',
            left: `${position}%`,
            top: '0px',
            bottom: undefined,
            marginTop: `${thumbCentering}px`,
            marginLeft: `-${thumbSize * 0.5}px`,
            marginBottom: undefined
        };
        if (!this.props.customThumb) {
            const defaultThumbStyles = {
                backgroundColor: color,
                borderRadius: '100%',
                height: `${thumbSize}px`,
                width: `${thumbSize}px`
            };
            defaultThumb = <div style={defaultThumbStyles} />;
        }

        return (
            <div
                className={`${clsName}-thumb`} 
                style={thumbWrapperStyles}
            >
                {this.props.customThumb}
                {defaultThumb && defaultThumb}
            </div>
        );
    }
}

Thumb.propTypes = {
    clsName: PropTypes.string,
    color: PropTypes.string,
    customThumb: PropTypes.node,
    offsetLeft: PropTypes.number,
    offsetTop: PropTypes.number,
    position: PropTypes.number,
    sliderSize: PropTypes.number,
    thumbSize: PropTypes.number,
};

Thumb.defaultProps = {
    clsName: 'dynamic-slider',
    position: 0,
};
