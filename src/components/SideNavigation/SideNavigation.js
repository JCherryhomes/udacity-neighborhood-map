import React, { Component } from 'react';
import './SideNavigation.css';
import { Drawer, TextField, Button } from '@material-ui/core';

export class SideNavigation extends Component {

  constructor(props) {
    super(props);

    this.state = {
      filterValue: '',
      filteredListItems: this.listItems
    };

    this.loadMapData.bind(this);
    this.applyFilter.bind(this);
    this.setFilter.bind(this);

    this.listItems.forEach(listItem => {
      this.loadMapData(listItem.url);
    });
  }

  get hereAPI() {
    return {
      appId: 'M56MQreTyeclC7ZlITa8',
      appCode: 'dPsoKRcQFs6Fh1rS0OUd3Q'
    };
  }

  get listItems() {
    return [
      {
        title: 'Central Park Zoo',
        url: `https://places.cit.api.here.com/places/v1/places/840dr5ru-0aec64649aa14bbaa63bf9c03570a862;context=Zmxvdy1pZD01MjYyNDI1YS02M2E0LTUzYzYtOWFhMi1jM2MwZmQ1YTc2MmFfMTUzNjQyMjQ4NDc4M18yNjgxXzMyNDQmcmFuaz0z?app_id=${
          this.hereAPI.appId
        }&app_code=${this.hereAPI.appCode}`
      },
      {
        title: 'Ancient Playground',
        url: `https://places.cit.api.here.com/places/v1/places/840aabd1-e774cf745d07028a57db0afed0e9fddb;context=Zmxvdy1pZD0wMTNmN2I3My1kNmQwLTVjNmUtYmVlZS1mMGE2NjQ5NDI3YzJfMTUzNjQyNTE3NjE0N183MDQ5XzUwNzgmcmFuaz0w?app_id=${
          this.hereAPI.appId
        }&app_code=${this.hereAPI.appCode}`
      },
      {
        title: 'Great Hill',
        url: `https://places.cit.api.here.com/places/v1/places/840dr72j-ccd1141b80d54fe0b1781e6eb372905b;context=Zmxvdy1pZD0xM2YwZTc3MC1iOTg3LTViODEtODI3Mi0zYmU2YzRjNDhjODlfMTUzNjQyNDY1OTgzNF8yODEyXzk2NDUmcmFuaz0x?app_id=${
          this.hereAPI.appId
        }&app_code=${this.hereAPI.appCode}`
      },
      {
        title: 'Great Lawn',
        url: `https://places.cit.api.here.com/places/v1/places/840dr5ru-688039f174754befb0135e723961f9dc;context=Zmxvdy1pZD1kZjExODUxOS05OGQ5LTUxMTEtYjg4My0zMGQ1M2QzOTUwZGZfMTUzNjQyNTAwMzg2OV84NTJfNTk3MiZyYW5rPTA?app_id=${
          this.hereAPI.appId
        }&app_code=${this.hereAPI.appCode}`
      },
      {
        title: 'Sheep Meadow',
        url: `https://places.cit.api.here.com/places/v1/places/840dr5ru-aeda6d0a871241d3a9462e6eb362ad3e;context=Zmxvdy1pZD0yODcxZDRlOS0yYWIxLTVkMGEtOTYyNi1jYTliNDdiMTQ3NjNfMTUzNjQyNTA1NTIwOV83ODE5XzY3MzQmcmFuaz0w?app_id=${
          this.hereAPI.appId
        }&app_code=${this.hereAPI.appCode}`
      }
    ];
  }

  loadMapData() {
    const mapPoints = [];
    const promises = [];

    this.state.filteredListItems.forEach(listItem => {
      promises.push(fetch(listItem.url)
        .then(result => result.json())
        .then(data => {
          try {
            var temp = {
              name: data.name,
              address: data.location.address.text,
              position: {
                lat: data.location.position[0],
                long: data.location.position[1]
              }
            };

            mapPoints.push(temp);
          } catch (e) {
            console.error('error', e);
          }
        }));

      Promise.all(promises).then(() => {            
        this.props.onFilter(mapPoints);
      });
    });
  }

  applyFilter(event) {
    if (event.target.value && event.target.value !== '') {
      this.setState({
        filterValue: event.target.value,
        filteredListItems: this.listItems.filter(li =>
          li.title.toLowerCase().includes(this.state.filterValue.toLowerCase())
        )
      });
    } else {
      this.setState({
        filterValue: '',
        filteredListItems: this.listItems
      });
    }
  }

  setFilter(listItem) {
    this.applyFilter({ target: { value: listItem.title }});
    this.loadMapData();
  }

  render() {
    return (
      <Drawer
        classes={{
          paperAnchorLeft: 'anchorLeft',
          paperAnchorDockedLeft: 'anchorLeft',
          docked: 'sidenavDocked'
        }}
        onClose={event => this.props.onClose(event, false)}
        open={this.props.open}
        variant='temporary'
        anchor='left'
      >
        <TextField
          id='search'
          value={this.state.filterValue}
          label='Filter Locations'
          type='search'
          margin='normal'
          autoComplete='off'
          onChange={this.applyFilter.bind(this)}
        />
        <Button 
          onClick={this.loadMapData.bind(this)}>
          Apply Filter
        </Button>
      </Drawer>
    );
  }
}
