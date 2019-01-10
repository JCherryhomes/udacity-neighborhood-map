import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import './map.css';

export class Map extends Component {
  constructor(props) {
    super(props);

    this.canvas = null;

    this.setCanvas = element => {
      this.canvas = element;
      this.loadMap();
    };

    this.state = {
      loading: true,
      markers: []
    };

    this.addMapPoints.bind(this);
  }

  loadMap() {
    if (this.props && this.props.google) {
      const { google } = this.props;
      this.maps = google.maps;

      const node = ReactDOM.findDOMNode(this.canvas);
      const center = new this.maps.LatLng(40.7829, -73.9654);
      const zoom = 13;

      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom
        }
      );

      this.map = new this.maps.Map(node, mapConfig);
    }
  }

  addMapPoints() {
    this.state.markers.forEach(marker => {
      marker.setMap(null);
      marker = null;
    });

    this.state.markers.length = 0;

    if (this.maps && this.props.mapPoints) {
      this.props.mapPoints.forEach(mapPoint => {
        const position = new this.maps.LatLng(
          mapPoint.position.lat,
          mapPoint.position.long
        );

        const content = `
            <h5>${mapPoint.name}</h5>
            <address>${mapPoint.address}</address>`;

        var infowindow = new this.maps.InfoWindow({
          content: content,
          marker: this.marker,
          position: position
        });

        var marker = new this.maps.Marker({
          position: position,
          title: mapPoint.name,
          animation: this.maps.Animation.DROP,
          map: this.map
        });

        marker.addListener('click', function() {
          infowindow.open(this.map, marker);
        });

        const bounceAnimation = this.maps.Animation.BOUNCE;
        const markers = this.state.markers;

        marker.addListener('mouseover', function(){
          markers.forEach(m => m.setAnimation(null));
          marker.setAnimation(bounceAnimation);
        });

        marker.addListener('mouseout', function(){
          marker.setAnimation(null);
        });

        if (this.state.markers.filter(m => m.title === marker.title).length === 0) {
          this.state.markers.push(marker);
        }
      });
    }
  }

  componentDidMount() {
    this.setState({
      loading: false,
      markers: []
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    this.addMapPoints();
  }

  render() {
    if (this.state.loading) {
      return <CircularProgress />;
    }

    return (
      <div id='map_canvas' ref={this.setCanvas} />
    );
  }
}
