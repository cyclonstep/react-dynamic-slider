import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Thumb from './Thumb';
import Track from './Track';
import Marker from './Marker';

function noop() {}

export default class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            handleCount: 1,
            drag: false,
            currentPosition: 0,
            percent: 0,
            mainThumbValues: 0,
            ratio: 20,
            markerPositions: [],
            markerPercents: [],
            markerValues: [],
            markerRatios: [],
            step: 1,
            dynamic: true,
  
        };

        this.onInteractionStart = this.onInteractionStart.bind(this);
        this.onMouseOrTouchMove = this.onMouseOrTouchMove.bind(this);
        this.onInteractionEnd = this.onInteractionEnd.bind(this);
        this.onDynamicThumbInteraction = this.onDynamicThumbInteraction.bind(this);
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
        console.log(eventType);
        const leftMouseButton = 0;
        if ((eventType === 'mouse') && (e.button !== leftMouseButton)) { return; }
        this.updateSliderValue(e, eventType);
        if (!this.state.dynamic) {
            this.setState({ drag: true });
        }
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

    onDynamicThumbInteraction(e) {
        console.log(e);
        console.log("masuk dynamic thumb loh");
    }

    getSliderInfo() {
        const sl = this.refs.slider;
        const sliderInfo = {
            bounds: sl.getBoundingClientRect(),
            length: sl.clientWidth,
            height: sl.clientHeight,
        };
        //console.log(sliderInfo);
        return sliderInfo;
    }

    addEvents(type) {
        // console.log("events type: " + type);
        switch (type) {
            case 'mouse': {
                document.addEventListener('mousemove', this.onMouseOrTouchMove);
                document.addEventListener('mouseup', this.onInteractionEnd);
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
        let xCoords;
        if (!this.state.dynamic) {
            xCoords = (eventType !== 'touch' ? e.pageX: e.touches[0].pageX) - window.pageXOffset;
        } else {
            let currentPosition = this.state.currentPosition;
            let currPlusThumb = currentPosition + (this.state.thumbSize) + (this.state.thumbSize * 0.5);
            xCoords = (e.pageX <= currPlusThumb ? e.pageX : this.getSliderInfo().bounds.left) - window.pageXOffset;
            // console.log("current pos: " + currentPosition);
            // console.log("currPlusThumb: " + currPlusThumb);
            // console.log("e.pageX: " + e.pageX);
            // console.log("xCoords: " + xCoords);
            if (xCoords === (this.getSliderInfo().bounds.left - window.pageXOffset)) {
                let markPosition = e.pageX - window.pageXOffset;
                // add the marker
                this.addMarker(markPosition);
            } else {
                // Hacky, but it needed to make the thumb can be dragged
                this.setState({
                    drag: true
                });
            }
        }
        // compare position to slider length to get percentage
        let currentPosition;
        let lengthOrHeight;
        currentPosition = xCoords - this.getSliderInfo().bounds.left;
        //console.log("updateSlider xCoords: " + xCoords);
        // console.log("updateSlider position: " + currentPosition);
        lengthOrHeight = this.getSliderInfo().length;
        //console.log("updateSlider lengthorh: " + lengthOrHeight);

        const percent = this.clampValue(+(currentPosition / lengthOrHeight).toFixed(2), 0, 1);
        // console.log("updateSlider percent: " + percent);
        // convert percent -> value the match value to notch as per props/state.step
        const rawValue = this.valueFromPercent(percent);
        // console.log("updateSlider rawValue: " + rawValue);
        mainThumbValue = this.calculateMatchingNotch(rawValue);
        //console.log("updateSlider mainThumbValue: " + mainThumbValue);
        // avoid repeated updates of the same value
        if (mainThumbValue === this.state.mainThumbValues) {return;}
        // percentage of the range to render the track/thumb to
        const ratio = (mainThumbValue - minValue) * 100 / (maxValue - minValue);
        // console.log("updateSlider Ratio: " + ratio);
        this.setState({
            percent,
            mainThumbValue,
            ratio,
            currentPosition
        }, this.handleChange);
    }

    handleChange() {
        this.props.onChange(this.state);
    }

    valueFromPercent(percentage) {
        const { range, minValue } = this.state;
        //console.log("range: " + range);
        const val = (range * percentage) + minValue;
        //console.log("val: " + val);
        return val;
    }

    calculateMatchingNotch(value) {
        const { step, maxValue, minValue } = this.state;
        //console.log("step: " + step);
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
        let { markerValues, handleCount } = props;
        //console.log("handleCount: " + handleCount);
        //console.log(markerValues);
        // put the handlCount first
        this.setState({
            handleCount: handleCount
        });

        if ( markerValues !== undefined || markerValues.length !== 0) {
            for (let i = 0; i < handleCount; i++) {
                if (markerValues.length > 0) {
                    this.setState(prevState => ({
                        markerValues: [...prevState.markerValues, markerValues[i]]
                    }));
                } else {
                    this.setState(prevState => ({
                        markerValues: [...prevState.markerValues, ...[0]]
                    }));
                }
            }
        }

        let { markerSize, thumbSize, sliderSize } = props;
        //console.log("thumbSize: " + thumbSize);
        if (props.thumbSize === undefined) {
            //console.log("sliderSize: " + sliderSize);
            thumbSize = (this.props.disableThumb ? 0 : sliderSize * 2);
        }
        if (props.markerSize === undefined) {
            markerSize = sliderSize * 0.5;
        }
        //console.log("thumbSize after: " + thumbSize);

        const { minValue, maxValue, id } = props;
        const range = maxValue - minValue;
        // const checkVal = markerValues[0] === undefined ? 0 : markerValues[0];
        const ratio = Math.max((this.state.mainThumbValue - minValue), 0) * 100 / (maxValue - minValue);
        //console.log("markerValues[0]: " + markerValues[0]);
        //console.log("range: " + range);
        //console.log("ratio: " + ratio);

        this.setState(prevState => ({
            markerValues: [...prevState.markerValues, markerValues],
            minValue,
            maxValue,
            range,
            ratio,
            thumbSize,
            markerSize,
            id
        }));        
    }

    addMarker(markerPosition) {
        console.log("!MARK START!");
        console.log("addMarker markerPosition: " + markerPosition);
        // compare position to slider length to get percentage
        let currentPosition = markerPosition - this.getSliderInfo().bounds.left,
            lengthOrHeight  = this.getSliderInfo().length;

        const percent       = this.clampValue(+(currentPosition / lengthOrHeight).toFixed(2), 0, 1);
        const rawValue      = this.valueFromPercent(percent);
        const markerValue   = this.calculateMatchingNotch(rawValue);

        // put marker state array into array variable
        let markerArray     = this.state.markerValues;

        // get slider's max and min value
        const { maxValue, minValue } = this.state;

        // console.log("addMarker position: " + currentPosition);
        // console.log("addMarker lengthorh: " + lengthOrHeight);
        // console.log("addMarker percent: " + percent);
        // console.log("addMarker rawValue: " + rawValue);
        // console.log("addMarker markerValue: " + markerValue);

        // avoid repeated updates of the same value
        if (
            markerValue === this.state.mainThumbValues ||
            markerValue === markerArray.includes(markerValue)
        ) { return; }

        // percentage of the range to render the track/thumb to
        const ratio = (markerValue - minValue) * 100 / (maxValue - minValue);
        this.setState({
            percent,
            markerValues : [...this.state.markerValues, markerValue],
            markerRatios : [...this.state.markerRatios, ratio],
            markerPositions : [...this.state.markerPositions, currentPosition]
        }, this.handleChange);

        console.log(this.state.markerValues);
        // console.log("addMarker Ratio: " + ratio);

    }

    render() {
        //console.log(this.state);
        //console.log("ratio: " + this.state.ratio);
        const {
            clsName,
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

        //console.log(this.props);
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
                className={`${clsName}-slider`}
                onMouseDown={this.onInteractionStart}
                onTouchStart={this.onInteractionStart}
                style={eventWrapperStyle}

            >
                <div
                    className={`${clsName}-line`}
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
                        value={this.state.value}
                    />
                    {
                        this.state.markerPositions.length > 0 &&
                            this.state.markerValues.map((markerValue, index) =>
                                (
                                    <Marker
                                        color='yellow'
                                        key={index}
                                        markerNumber={index}
                                        markerSize={this.state.markerSize}
                                        position={markerValue}
                                        sliderSize={sliderSize}
                                    />
                                )
                            )
                    }
                </div>
            </div>
        );
    }

}

// Determine the propTypes and its default value(s)

Slider.propTypes = {
    clsName: PropTypes.string,
    dynamic: PropTypes.bool,
    handleCount: PropTypes.number,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    // markerValues: PropTypes.arrayOf(PropTypes.number),
    onChange: PropTypes.func,
    onChangeComplete: PropTypes.func,
    id: PropTypes.string,
    sliderColor: PropTypes.string,
    trackColor: PropTypes.string,
    thumbColor: PropTypes.string,
    disableThumb: PropTypes.bool,
    mainThumbValue: PropTypes.number,
};

Slider.defaultProps = {
    clsName: "dynamic-slider",
    handleCount: 2,
    minValue: 0,
    maxValue: 100,
    markerValues: {},
    onChange: noop,
    onChangeComplete: noop,
    sliderColor: 'blue',
    trackColor: 'green',
    thumbColor: 'red',
    id: null,
    disableThumb: false,
    sliderSize: 30,
    mainThumbValue: 0
};