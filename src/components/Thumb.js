import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Thumb extends Component {
    render() {
        let defaultThumb,
            sliderSize = this.props.sliderSize,
            thumbSize = this.props.thumbSize,
            position = this.props.position,
            color = this.props.color;

        console.log("position: " + this.props.position);

        const thumbCentering = (sliderSize - thumbSize) * 0.5;
        const thumbWrapperStyles = {
            position: 'absolute',
            left: position,
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
            <div style={thumbWrapperStyles}>
                {this.props.customThumb}
                {defaultThumb && defaultThumb}
            </div>
        );
    }
}

Thumb.propTypes = {
    position: PropTypes.number,
    offsetTop: PropTypes.number,
    offsetLeft: PropTypes.number,
    sliderSize: PropTypes.number,
    thumbSize: PropTypes.number,
    color: PropTypes.string,
    customThumb: PropTypes.node
};

Thumb.defaultProps = {
    position: 20
};
