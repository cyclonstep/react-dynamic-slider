import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Thumb from './Thumb';
import Track from './Track';

function noop() {}

export default class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handleCount: 1,
            drag: false,
            values: [0],
        };
    }
    
    componentWillMount() {
        this.propsToState(this.props);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        this.propsToState(nextProps);
    }

    onInteractionStart(e) {
        const eventType = (e.touches !== undefined ? 'touch' : 'mouse');
        const leftMouseButton = 0;
        if ((eventType === 'mouse') && (e.button !== leftMouseButton)) { return; }
        this.updateSliderValue(e, eventType);
        this.setState({ drag: true, displayLabel: true });
        this.addEvents(eventType);
        e.preventDefault();
    }

    onInteractionEnd() {
        this.setState({
            drag: false,
        });
        this.removeEvents();
    }

    onMouseOrTouchMove(e) {
        const eventType = (e.touches !== undefined ? 'touch' : 'mouse');
        if (!this.state.drag) {return;};
        this.updateSliderValue(e, eventType);
        e.stopPropagation();
    }

    getSliderInfo() {
        const sl = this.refs.slider;
        const sliderInfo = {
            bounds: sl.getBoundingClientRect(),
            length: sl.clientWidth,
            height: sl.clientHeight,
        };

        return sliderInfo;
    }

    addEvents(type) {
        switch (type) {
            case 'mouse': {
                document.addEventListener('mousemove', this.onMouseOrTouchMove);
                document.addEventListener('nouseup', this.onInteractionEnd);
                break;
            }
            case 'touch': {
                document.addEventListener('touchmove', this.onMouseOrTouchMove);
                document.addEventListener('touchend', this.onInteractionEnd);
                break;
            }
            default: //nothing
        }
    }

    removeEvents() {
        document.removeEventListener('mousemove', this.onMouseOrTouchMove);
        document.removeEventListener('mouseup', this.onInteractionEnd);
        document.removeEventListener('touchmove', this.onMouseOrTouchMove);
        document.removeEventListener('touchend', this.onInteractionEnd);    
    }

    updateSliderValue(e, eventType) {
        const { max, min } = this.state;
        const { vertical } = this.props;

        let { value } = this.state;
        const xCoords = (eventType !== 'touch' ? e.pageX: e.touches[0].pageX) - window.pageXOffset;
        const yCoords = (eventType !== 'touch' ? e.pageY : e.touches[0].pageY) - window.pageYOffset;
        // compare position to slider length to get percentage
        let position;
        let lengthOrHeight;
        position = xCoords - this.getSliderInfo().bounds.left;
        lengthOrHeight = this.getSliderInfo().length;

        const percent = this.clampValue(+(position / lengthOrHeight).toFixed(2), 0, 1);
        // convert percent -> value the match value to notch as per props/state.step
        const rawValue = this.valueFromPercent(percent);
        value = this.calculateMatchingNotch(rawValue);
        // avoid repeated updates of the same value
        if (value === this.state.value) {return;}
        // percentage of the range to render the track/thumb to
        const ratio = (value - min) * 100 / (max - min);
        this.setState({
            percent,
            value,
            ratio,
        }, this.handleChange);
    }

    handleChange() {
        this.props.onChange(this.state);
    }

    valueFromPercent(percentage) {
        const { range, min } = this.state;
        const val = (range * percentage) + min;
        return val;
    }

    calculateMatchingNotch(value) {
        const { step, max, min } = this.state;
        const values = [];
        for (let i = min; i <= max; i++) {
            values.push(i);
        }

        const notches = [];
        // find how many entries in values are divisible by step (+min,+max)
        for (const s of values) {
            if (s === min || s === max || s % step === 0) {
                notches.push(s);
            }
        }

        // reduce over the potential notches and find which is the closest
        const match = notches.reduce((prev, curr) => {
            if (Math.abs(curr - value) < Math.abs(prev - value)) {
                return curr;
            }
            return prev;
        });
        return match;
    }

    clampValue(val, min, max) {
        return Math.max(min, Math.min(val, max));
    }

    propsToState(props) {
        let { values, handleCount } = props;
        if ( values !== undefined || values.length !== 0) {
            for (let i = 0; i < handleCount; i++) {
                if (values.length > 0) {
                    this.setState(prevState => ({
                        values: [...prevState.values, values[i]]
                    }));
                } else {
                    this.setState(prevState => ({
                        values: [...prevState.values, 0]
                    }));
                }
                console.log(this.state.values);
            }
        }

        let { thumbSize } = props;
        if (props.thumbSize === undefined) {
            thumbSize = (this.props.disableThumb ? 0 : props.sliderSize * 2);
        }

        const { minValue, maxValue, id } = props;
        const range = maxValue - minValue;
        const ratio = Math.max((values[0] - minValue), 0) * 100 / (maxValue - minValue);
        this.setState(prevState => ({
            values: [...prevState.values, values],
            minValue,
            maxValue,
            range,
            ratio,
            thumbSize,
            id
        }));        
    }
    render() {
        const {
            vertical,
            sliderSize,
            disableThumb,
            disableTrack,
            children,
            label,
            trackColor,
            thumbColor,
            verticalSliderHeight,
            eventWrapperPadding
        } = this.props;
        const eventWrapperStyle = {
            height: '100%',
            position: 'relative',
            cursor: 'pointer',
            margin: '0 auto',
            get padding() {
                return !vertical ? `${eventWrapperPadding}px 0` : `0 ${eventWrapperPadding}px`;
            },
            get width() { return !vertical ? 'auto' : `${sliderSize}px`;}
        };
        const sliderStyle = {
            backgroundColor: this.props.sliderColor,
            position: 'relative',
            overflow: 'visible',
            get height() {
                return !vertical ? `${sliderSize}px` : verticalSliderHeight;
            },
            get width() { return !vertical ? '100%' : `${sliderSize}px`;}
        };
        return ( 
            <div
                style={eventWrapperStyle}
                onMouseDown={this.onInteractionStart}
                onTouchStart={this.onInteractionStart}
            >
                <div
                    ref="slider"
                    style={sliderStyle}
                >
                    <Track
                        color={trackColor}
                        length={this.state.ratio}
                        vertical={vertical}
                    />
                    <Thumb
                        color={thumbColor}
                        customThumb={children}
                        disableThumb={disableThumb}
                        position={this.state.ratio}
                        sliderSize={sliderSize}
                        thumbSize={this.state.thumbSize}
                        value={this.state.value} />
                </div>
            </div>
        );
    }

}

// Determine the propTypes and its default value(s)

Slider.propTypes = {
    clsName: PropTypes.string,
    handleCount: PropTypes.number,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    values: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    onChangeComplete: PropTypes.func,
    id: PropTypes.string,
    sliderColor: PropTypes.string,
    trackColor: PropTypes.string,
    thumbColor: PropTypes.string
};

Slider.defaultProps = {
    clsName: "",
    handleCount: 2,
    minValue: 0,
    maxValue: 100,
    values: {},
    onChange: noop,
    onChangeComplete: noop,
    id: null
};