import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Thumb extends Component {
    static propTypes = {
        position: PropTypes.number,
        offsetTop: PropTypes.number,
        offsetLeft: PropTypes.number,
        sliderSize: PropTypes.number,
        thumbSize: PropTypes.number,
        color: PropTypes.string,
        customThumb: PropTypes.node
    }

    render() {
        let defaultThumb;
        const thumbCentering = (sliderSize - thumbSize) * 0.5;
        const thumbWrapperStyles = {
            position: 'absolute',
            left: this.props.position,
            top: '0px',
            bottom: undefined,
            marginTop: `${thumbCentering}px`,
            marginLeft: `-${thumbSize * 0.5}px`,
            marginBottom: undefined
        };
        if (!this.props.customThumb) {
            const defaultThumbStyles = {
                backgroundColor: this.props.color,
                borderRadius: '100%',
                height: `${this.props.thumbSize}px`,
                width: `${this.props.thumbSize}px`
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