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
            markValues: [0],
            ratio: 20,
            mainThumbValues: 0,
            step: 1
        };

        this.onInteractionStart = this.onInteractionStart.bind(this);
        this.onMouseOrTouchMove = this.onMouseOrTouchMove.bind(this);
        this.onInteractionEnd = this.onInteractionEnd.bind(this);
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
        console.log(sliderInfo);
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
        const { maxValue, minValue } = this.state;
        const { vertical } = this.props;

        let { mainThumbValue } = this.state;
        const xCoords = (eventType !== 'touch' ? e.pageX: e.touches[0].pageX) - window.pageXOffset;
        const yCoords = (eventType !== 'touch' ? e.pageY : e.touches[0].pageY) - window.pageYOffset;
        // compare position to slider length to get percentage
        let position;
        let lengthOrHeight;
        position = xCoords - this.getSliderInfo().bounds.left;
        console.log("updateSlider xCoords: " + xCoords);
        console.log("updateSlider position: " + position);
        lengthOrHeight = this.getSliderInfo().length;
        console.log("updateSlider lengthorh: " + lengthOrHeight);

        const percent = this.clampValue(+(position / lengthOrHeight).toFixed(2), 0, 1);
        console.log("updateSlider percent: " + percent);
        // convert percent -> value the match value to notch as per props/state.step
        const rawValue = this.valueFromPercent(percent);
        console.log("updateSlider rawValue: " + rawValue);
        mainThumbValue = this.calculateMatchingNotch(rawValue);
        console.log("updateSlider mainThumbValue: " + mainThumbValue);
        // avoid repeated updates of the same value
        if (mainThumbValue === this.state.value) {return;}
        // percentage of the range to render the track/thumb to
        const ratio = (mainThumbValue - minValue) * 100 / (maxValue - minValue);
        console.log("updateSlider Ratio: " + ratio);
        this.setState({
            percent,
            mainThumbValue,
            ratio,
        }, this.handleChange);
    }

    handleChange() {
        this.props.onChange(this.state);
    }

    valueFromPercent(percentage) {
        const { range, minValue } = this.state;
        console.log("range: " + range);
        const val = (range * percentage) + minValue;
        console.log("val: " + val);
        return val;
    }

    calculateMatchingNotch(value) {
        const { step, maxValue, minValue } = this.state;
        console.log("step: " + step);
        const values = [];
        for (let i = minValue; i <= maxValue; i++) {
            values.push(i);
        }

        const notches = [];
        // find how many entries in values are divisible by step (+min,+max)
        for (const s of values) {
            if (s === minValue || s === maxValue || s % step === 0) {
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
        let { markValues, handleCount } = props;
        console.log("handleCount: " + handleCount);
        console.log(markValues);
        // put the handlCount first
        this.setState({
            handleCount: handleCount
        });

        if ( markValues !== undefined || markValues.length !== 0) {
            for (let i = 0; i < handleCount; i++) {
                if (markValues.length > 0) {
                    this.setState(prevState => ({
                        markValues: [...prevState.markValues, markValues[i]]
                    }));
                } else {
                    this.setState(prevState => ({
                        markValues: [...prevState.markValues, ...[0]]
                    }));
                    // const nowmarkValues = this.state.markValues;
                    // const nextmarkValues = nowmarkValues.concat([1,2,3]);
                    // this.setState({
                    //     markValues: nextmarkValues
                    // }, function(){console.log(this.state.markValues)});
                }
            }
        }

        let { thumbSize, sliderSize } = props;
        console.log("thumbSize: " + thumbSize);
        if (props.thumbSize === undefined) {
            console.log("sliderSize: " + sliderSize);
            thumbSize = (this.props.disableThumb ? 0 : sliderSize * 2);
        }
        console.log("thumbSize after: " + thumbSize);

        const { minValue, maxValue, id } = props;
        const range = maxValue - minValue;
        const checkVal = markValues[0] === undefined ? 0 : markValues[0];
        const ratio = Math.max((checkVal - minValue), 0) * 100 / (maxValue - minValue);
        console.log("markValues[0]: " + markValues[0]);
        console.log("range: " + range);
        console.log("ratio: " + ratio);

        this.setState(prevState => ({
            markValues: [...prevState.markValues, markValues],
            minValue,
            maxValue,
            range,
            ratio,
            thumbSize,
            id
        }));        
    }
    render() {
        console.log(this.state);
        console.log("ratio: " + this.state.ratio);
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

        console.log(this.props);
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
                onMouseUp={this.onInteractionEnd}
                onTouchEnd={this.onInteractionEnd}
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
    // markValues: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    onChangeComplete: PropTypes.func,
    id: PropTypes.string,
    sliderColor: PropTypes.string,
    trackColor: PropTypes.string,
    thumbColor: PropTypes.string,
    disableThumb: PropTypes.bool,
    mainThumbValue: PropTypes.number
};

Slider.defaultProps = {
    clsName: "",
    handleCount: 2,
    minValue: 0,
    maxValue: 100,
    markValues: {},
    onChange: noop,
    onChangeComplete: noop,
    sliderColor: 'blue',
    trackColor: 'green',
    thumbColor: 'red',
    id: null,
    disableThumb: false,
    sliderSize: 50,
    mainThumbValue: 0
};