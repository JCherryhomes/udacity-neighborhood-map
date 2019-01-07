import React, { Component } from 'react';
import { Map } from './components/Map/Map';
import './App.css';
import { 
  CircularProgress, 
  AppBar, 
  Toolbar,
  IconButton,
  Typography,
  Paper
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { SideNavigation } from './components/SideNavigation/SideNavigation';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      left: false,
      mapPoint: null
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer(event, isOpen) {
    this.setState({
        left: isOpen
    });
  }

  selectMapPoint(mapPoint) {
    this.setState({
      mapPoint: mapPoint,
      left: false
    });
  }

  render() {
    if (!this.props.google) {
      return (
        <div>
          <h2>Loading Maps API</h2>
          <CircularProgress></CircularProgress>
        </div>
      )
    }

    return (
      <div className="App">
        <AppBar position="absolute">
          <Toolbar>
            <IconButton color='inherit' onClick={(event) => this.toggleDrawer(event, true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              Neighborhood Map
            </Typography>
          </Toolbar>
        </AppBar>
        <SideNavigation open={this.state.left} onClose={this.toggleDrawer} onSelect={(data) => this.selectMapPoint(data)}></SideNavigation>
        <main>
          <Map google={this.props.google} mapPoint={this.state.mapPoint}></Map>
        </main>  
        <Paper className="ta_logo" elevation={1}>
          <Typography variant="subheading" color="inherit" noWrap>
            Made with <a href="http://here.com">HERE.com</a>
          </Typography>
        </Paper>    
      </div>
    );
  }
}

export default App;
