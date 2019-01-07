import React, {
    Component
} from 'react';
import ReactDOM from 'react-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import './map.css';

export class Map extends Component {
    constructor(props) {
        super(props);

        this.canvas = null;

        this.setCanvas = element => {
            console.log('canvas element', element);
            this.canvas = element;
            this.loadMap();
        };

        this.state = {
            loading: true,
            markers: {}
        };

        this.marker = null;

        this.addMapPoint.bind(this);
    }

    loadMap() {

        console.log('MAP POINT', this.props.mapPoint);
        if (this.props && this.props.google) {
            const {
                google
            } = this.props;
            this.maps = google.maps;

            const node = ReactDOM.findDOMNode(this.canvas);
            const center = new this.maps.LatLng(40.7829, -73.9654);
            const zoom = 13;

            const mapConfig = Object.assign({}, {
                center: center,
                zoom: zoom
            });

            this.map = new this.maps.Map(node, mapConfig);
        }
    }

    addMapPoint() {
        if (this.marker) {
            this.marker.setMap(null);
            this.marker = null;
        }

        if (this.maps && this.props.mapPoint) {
            const position = new this.maps.LatLng(
                this.props.mapPoint.position.lat,
                this.props.mapPoint.position.long
            );

            const content = this.props.mapPoint.address;

            var infowindow = new this.maps.InfoWindow({
                content: content,
                marker: this.marker,
                position: position
            });

            this.marker = new this.maps.Marker({
                position: position,
                title: this.props.mapPoint.name,
                map: this.map
            });

            this.marker.addListener('click', function () {
                infowindow.open(this.map, this.marker);
            });
        }
    }

    componentDidMount() {
        this.setState({
            loading: false,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
            this.loadMap();
        }
    }

    render() {
        if (this.state.loading) {
            return (<CircularProgress></CircularProgress>);
            }

            this.addMapPoint();

            return (
            <div id="map_canvas"
                ref = {
                    this.setCanvas
                }></div>
            )
        }
    }