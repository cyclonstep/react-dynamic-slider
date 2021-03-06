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
            markerCount: 0,
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
            atobwidth: 0,
            markerRatio: 0,
            limitMax: 100,
            limitMin: 0
        };

        this.onInteractionStart = this.onInteractionStart.bind(this);
        this.onMouseOrTouchMove = this.onMouseOrTouchMove.bind(this);
        this.onInteractionEnd = this.onInteractionEnd.bind(this);
    }
    
    componentWillMount() {
        this.propsToState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.propsToState(nextProps);
    }

    onInteractionStart(e) {
        const eventType = (e.touches !== undefined ? 'touch' : 'mouse');
        // console.log(eventType);
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
        this.handleChangeComplete();
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
        const { maxValue, minValue, dynamic } = this.state;
        let { mainThumbValue } = this.state;        
        
        let xCoords = (eventType !== 'touch' ? e.pageX : e.touches[0].pageX) - window.pageXOffset;

        if (dynamic) {
            const currentPosition = this.state.currentPosition + this.getSliderInfo().bounds.left;

            let maxThumbArea = currentPosition + (this.state.thumbSize * 0.5);
            let minThumbArea = currentPosition - (this.state.thumbSize * 0.5);
            let thumbXCoords = ((e.pageX >= minThumbArea) && (e.pageX <= maxThumbArea) ? e.pageX : this.getSliderInfo().bounds.left) - window.pageXOffset;
            
            if (thumbXCoords === (this.getSliderInfo().bounds.left - window.pageXOffset)) {
                let markPosition = e.pageX - window.pageXOffset;
                if (!this.state.drag) {this.addMarker(markPosition);}
            } else {
                this.setState({ drag: true });
            }

            // console.log("maxThumbArea: " + maxThumbArea);
            // console.log("minThumbArea: " + minThumbArea);
            // console.log("e.pageX: " + e.pageX);
            // console.log("xCoords: " + xCoords);
            // console.log("thumbXCoords: " + thumbXCoords);
        }
        // compare position to slider length to get percentage
        let lengthOrHeight;
        let currentPosition = xCoords - this.getSliderInfo().bounds.left;
        lengthOrHeight = this.getSliderInfo().length;
        const percent = this.clampValue(+(currentPosition / lengthOrHeight).toFixed(2), 0, 1);
        // convert percent -> value the match value to notch as per props/state.step
        const rawValue = this.valueFromPercent(percent);
        mainThumbValue = this.calculateMatchingNotch(rawValue);
        // avoid repeated updates of the same value
        if (mainThumbValue === this.state.mainThumbValues) {return;}
        // percentage of the range to render the track/thumb to
        let ratio = (mainThumbValue - minValue) * 100 / (maxValue - minValue);
        // forcing the thumb to the most left of slider
        if (ratio === 1) {
            ratio = 0;
        }
        this.setState({
            percent,
            mainThumbValue,
            ratio,
            currentPosition,
        }, this.handleChange);
    }

    handleChange() {
        if (this.state.lock === true) {
            return;
        }
        this.props.onChange(this.state);
    }

    handleChangeComplete() {
        if (this.state.lock === true) {
            this.releaseMainThumbLock();
            return;
        }
        this.props.onChangeComplete(this.state);
    }

    handleAddMarker() {
        // console.log(this.state.markerValues);
        let { min, max } = this.maxMinMarkerValues();
        let { lockToMinMark, lockToMaxMark } = this.props;

        let atobwidth = Math.abs(max.ratios - min.ratios);
        let markerRatio = min.ratios;
        
        if (lockToMinMark === true) {
            this.moveMainThumb(min);
        } else if (lockToMaxMark === true) {
            this.moveMainThumb(max);
        }
        
        if (this.state.markerRatios.length > 0) {
            this.moveTrack(atobwidth, markerRatio);

        }

        // this.releaseMainThumbLock();
        this.setLimit(min.ratios, max.ratios);

        this.props.onAddMarker(this.state);
    }

    maxMinMarkerValues(){
        const markerValuesArray = this.state.markerValues,
            markerPositionsArray = this.state.markerPositions,
            markerRatiosArray = this.state.markerRatios,
            markerPercentsArray = this.state.markerPercents;

        let minValuesVal = Math.min(...markerValuesArray),
            minPositionsVal = Math.min(...markerPositionsArray),
            minRatiosVal = Math.min(...markerRatiosArray),
            minPercentsVal = Math.min(...markerPercentsArray),
            maxValuesVal = Math.max(...markerValuesArray),
            maxPositionsVal = Math.max(...markerPositionsArray),
            maxRatiosVal = Math.max(...markerRatiosArray),
            maxPercentsVal = Math.max(...markerPercentsArray);

        return {
            min : {
                values: minValuesVal,
                positions: minPositionsVal,
                ratios: minRatiosVal,
                percents: minPercentsVal
            },
            max : {
                values: maxValuesVal,
                positions: maxPositionsVal,
                ratios: maxRatiosVal,
                percents: maxPercentsVal
            }
        };
    }

    moveMainThumb(value) {
        this.setMainThumbLock();
        this.setState({
            mainThumbValue: value.values,
            percent: value.percents,
            ratio : value.ratios,
            currentPosition: value.positions,
        });
    }

    moveTrack(atobwidth, markerRatio) {
        this.setState({
            atobwidth: atobwidth,
            markerRatio: markerRatio
        });
    }

    setLimit(min, max) {
        this.setState({
            limitMax: max,
            limitMin: min,
        });
    }
    
    setMainThumbLock() {
        this.setState({
            lock: true
        });
    }

    releaseMainThumbLock() {
        this.setState({
            lock: false
        });
    }

    releaseDynamicValues() {
        this.setState(prevState => ({
            markerPositions: [],
            markerPercents: [],
            markerValues: [],
            markerRatios: [],
        }));
        this.setLimit(0,100);
    }


    valueFromPercent(percentage) {
        const { range, minValue } = this.state;
        const val = (range * percentage) + minValue;
        return val;
    }

    calculateMatchingNotch(value) {
        const { step, maxValue, minValue } = this.state;
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
        // console.log("match: " + match);
        return match;
    }

    clampValue(val, min, max) {
        return Math.max(min, Math.min(val, max));
    }

    propsToState(props) {
        let { 
            markerCount,
            markerValues,
            markerPercents,
            markerPositions,
            markerRatios 
        } = props;

        //console.log("markerCount: " + markerCount);
        //console.log(markerValues);
        // put the handlCount first
        if (this.state.markerCount !== markerCount) {
            this.setState({
                markerCount: markerCount
            });
        }

        if ( markerValues !== undefined || markerValues.length !== 0) {
            // console.log("markerCount: " + markerCount);
            for (let i = 0; i < markerCount; i++) {
                // console.log("i di marker values: " + i);
                if (markerValues.length > 0) {
                    if (this.state.markerValues.length < markerCount) {
                        // console.log("markervalues setstate triger #2");
                        this.setState(prevState => ({
                            markerValues: [...prevState.markerValues, markerValues[i]],
                            markerRatios: [...prevState.markerRatios, markerRatios[i]],
                            markerPercents: [...prevState.markerPercents, markerPercents[i]],
                            markerPositions: [...prevState.markerPositions, markerPositions[i]]
                        }));
                    }
                } else {
                    if (this.state.markerValues.length < markerCount) {
                        // console.log("markervalues setstate triger #3");
                        this.setState(prevState => ({
                            markerValues: [...prevState.markerValues, ...[0]],
                            markerRatios: [...prevState.markerRatios, ...[0]],
                            markerPercents: [...prevState.markerPercents, ...[0]],
                            markerPositions: [...prevState.markerPositions, ...[0]]
                        }));
                    }
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
            markerSize = sliderSize;
        }
        //console.log("thumbSize after: " + thumbSize);

        const { minValue, maxValue, id, dynamic } = props;
        const range = maxValue - minValue;
        let value = (props.value > 100 ? 100 : props.value);
        let ratio;

        if (value && value > 0) {
            ratio = Math.max((value - minValue), 0) * 100 / (maxValue - minValue);
        } else {
            ratio = Math.max((this.state.mainThumbValue - minValue), 0) * 100 / (maxValue - minValue);
        }

        if (dynamic === false) {
            // Release all if dynamic is false
            this.releaseDynamicValues();
        }

        this.setState(prevState => ({
            minValue,
            maxValue,
            range,
            ratio,
            thumbSize,
            markerSize,
            id,
            dynamic
        }));        
    }

    addMarker(markerPosition) {
        // console.log("!MARK START!");
        // console.log("addMarker markerPosition: " + markerPosition);

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

        // avoid repeated updates of the same value
        if (
            markerValue === this.state.mainThumbValues ||
            markerValue === markerArray.includes(markerValue)
        ) { return; }

        // check if marker is more than markerCount, if it is a yes, 
        // use immutable shift for FIFO : (arr.slice(1))
        // console.log(this.state.markerValues.length);

        // percentage of the range to render the track/thumb to
        const ratio = (markerValue - minValue) * 100 / (maxValue - minValue);
        this.setState((prevState, props) => {

            if (prevState.markerValues.length >= prevState.markerCount) {
                var newValuesArr = this.state.markerValues.slice(1),
                    newRatiosArr = this.state.markerRatios.slice(1),
                    newPercsArr  = this.state.markerPercents.slice(1),
                    newPosArr    = this.state.markerPositions.slice(1);
                // React or browser bug? array position state change by itself
                if (newValuesArr !== newRatiosArr) {
                    newValuesArr = newRatiosArr;
                }
            } 
      
            return {
                percent,
                markerValues : newValuesArr ? [...newValuesArr, markerValue] : [...prevState.markerValues, markerValue],
                markerRatios : newRatiosArr ? [...newRatiosArr, ratio] : [...prevState.markerRatios, ratio],
                markerPositions : newPosArr ? [...newPosArr, currentPosition] : [...prevState.markerPositions, currentPosition],
                markerPercents : newPercsArr ? [...newPercsArr, percent] : [...prevState.markerPercents, percent]
            };

        }, this.handleAddMarker);

        // console.log(this.state.markerValues);
        // console.log("addMarker Ratio: " + ratio);

    }

    render() {
        // console.log(this.state.markerValues);
        // console.log(this.state.markerPositions);
        // console.log(this.state.markerPercents);
        // console.log(this.state.markerRatios);
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
            markerColor,
            verticalSliderHeight,
            eventWrapperPadding
        } = this.props;

        // console.log("markerCount: " + this.state.markerCount);

        //console.log(this.props);
        const eventWrapperStyle = {
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
                        dynamic={this.state.dynamic}
                        length={!this.state.dynamic ? this.state.ratio : this.state.atobwidth}
                        startFrom={!this.state.dynamic ? 0 : this.state.markerRatio}
                        vertical={vertical}
                    />
                    {
                        this.state.markerPositions.length > 0 &&
                        this.state.markerValues.map((markerValue, index) =>
                            (
                                <Marker
                                    color={markerColor}
                                    key={index}
                                    markerNumber={index}
                                    markerSize={this.state.markerSize}
                                    position={markerValue}
                                    sliderSize={sliderSize}
                                />
                            )
                        )
                    }
                    <Thumb
                        color={thumbColor}
                        customThumb={children}
                        disableThumb={disableThumb}
                        dynamic={this.state.dynamic}
                        limitMax={this.state.limitMax}
                        limitMin={this.state.limitMin}
                        position={this.state.ratio}
                        sliderSize={sliderSize}
                        thumbSize={this.state.thumbSize}
                        value={this.state.value}
                    />
                </div>
            </div>
        );
    }

}

// Determine the propTypes and its default value(s)

Slider.propTypes = {
    clsName: PropTypes.string,
    dynamic: PropTypes.bool,
    markerCount: PropTypes.number,
    markerSize: PropTypes.number,
    markerColor: PropTypes.string,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    onChange: PropTypes.func,
    onChangeComplete: PropTypes.func,
    onAddMarker: PropTypes.func,
    id: PropTypes.string,
    sliderSize: PropTypes.number,
    sliderColor: PropTypes.string,
    trackSize: PropTypes.number,
    trackColor: PropTypes.string,
    thumbSize: PropTypes.number,
    thumbColor: PropTypes.string,
    disableThumb: PropTypes.bool,
    mainThumbValue: PropTypes.number,
    lockToMinMark: PropTypes.bool,
    lockToMaxMark: PropTypes.bool,
    value: PropTypes.number
};

Slider.defaultProps = {
    clsName: "dynamic-slider",
    markerCount: 2,
    minValue: 0,
    maxValue: 100,
    markerValues: [],
    markerRatios: [],
    markerPositions: [],
    markerPercents: [],
    markerColor: 'yellow',
    onChange: noop,
    onChangeComplete: noop,
    onAddMarker: noop,
    sliderColor: 'blue',
    trackColor: 'green',
    thumbColor: 'red',
    id: null,
    disableThumb: false,
    sliderSize: 30,
    mainThumbValue: 0,
    lockToMinMark : true,
    lockToMaxMark : false,
    value: 0
};
