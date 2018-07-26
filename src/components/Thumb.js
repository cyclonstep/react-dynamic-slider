import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Thumb extends Component {
    constructor(props) {
        super(props);

        this.state = {
            limitMax: 100,
            limitMin: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        if (nextProps.dynamic) {
            this.setState({
                limitMax: nextProps.limitMax,
                limitMin: nextProps.limitMin
            });
        } else if (
            (this.props.dynamic !== nextProps.dynamic) 
            && (nextProps.dynamic === false)) 
        {
            this.setState({
                limitMax: 100,
                limitMin: 0
            });
        }
    }

    render() {

        let {
            clsName,
            color,
            defaultThumb,
            position,
            sliderSize,
            thumbSize
        } = this.props;

        if (position > this.state.limitMax) {
            position = this.state.limitMax;
        } else if (position < this.state.limitMin) {
            position = this.state.limitMin;
        }

        // console.log("position: " + this.props.position);

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
    dynamic: PropTypes.bool,
    limitMax: PropTypes.number,
    limitMin: PropTypes.number,
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
