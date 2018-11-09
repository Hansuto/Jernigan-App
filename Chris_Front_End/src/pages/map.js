import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { createStackNavigator } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import { Location, Permissions } from 'expo';
import LottieView from 'lottie-react-native';

import CommentScreen from './comment'
import LocationScreen from './location'
import TimelineScreen from './timeline'
import LogoTitle from './../components/logotitle'

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      lat: null,
      long: null,
      markers: {},
      query: "",
    };
    this.getLocationAsync = this.getLocationAsync.bind(this);
    this.search = this.search.bind(this);    
  };

  static navigationOptions = {
    headerLeft: <View/>,
    headerRight: (
      // Adds refresh button to header bar
      <View style={{flex:1, flexDirection: 'row', padding: 15}}>
        <FontAwesome
          name="refresh"
          onPress={this.getLocationAsync}
          color="#fff"
          size={30}
        />
      </View>
    ),
  }

  /* Envokes on page load */
  componentWillMount() {
    this.getLocationAsync();
    this.loadLocationsMarkers()
  }

  async getLocationAsync () {
    this.setState({ isLoading: true })
    await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    this.setState({ lat: location.coords.latitude });    
    this.setState({ long: location.coords.longitude });
    this.setState({ isLoading: false })
  };

  /* Loads all comments of current location */
  async loadLocationsMarkers() {
    
    markersArray = []
/*
    const command = global.url + "api/Location/GetAvailableTimelines?longitude=" + this.state.longitude + "&latitude=" + this.state.latitude;
    const response = await fetch(command, {method: 'POST'});
 
    if (!response.ok) {
      alert("Server Down");
      throw Error(response.statusText);
    }

    const markers = await response.json();
*/
    var markers = require('../testdata/location/nearbyLocationsRequest.json');
    this.setState({ markers: markers})

    for (var i = 0; i < markers.locations.length; i++) {
      markersArray.push (
        <MapView.Marker
        key = {markers.locations[i].title} 
        coordinate={{ latitude: markers.locations[i].latitude, longitude: markers.locations[i].longitude}}
        title={markers.locations[i].title}
        description={"Click here for timeline!"}
        onCalloutPress={(event) => this.goToLocation(event) }
        pinColor= '#E9C46A'/>
      )
    }
  }

  // Navigate to location page passing name of selected marker
  goToLocation (event) {
    const markerId = event._targetInst.return.key
    this.props.navigation.navigate('Location',{ name: markerId })
  }

  search (event) {
    this.props.navigation.navigate('Location',{ name: this.state.query })
    this.setState({ query: ""})
  }
  
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20, backgroundColor: '#E76F51'}}>
          <LottieView source={require('../images/world_locations')} autoPlay/>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: this.state.lat,
            longitude: this.state.long,
            latitudeDelta: 0.7500,
            longitudeDelta: 0.7500,}}>
          {/* User's Location */}
          <MapView.Marker
            coordinate={{
              latitude: this.state.lat,
              longitude: this.state.long,
            }}>
            <View style={styles.radius}>
              <View style={styles.marker} />
            </View>
          </MapView.Marker>
          {/* Displays all available Locations */}
          {markersArray}
        </MapView>
        <View style={styles.inputArea}>
          <TextInput style={styles.inputBox}
            returnKeyType = { "done" } 
            onChangeText={(value) => this.setState({query: value})}
            value={this.state.query}
            underlineColorAndroid='rgba(0,0,0,0)'
            placeholder="Enter Name of Location"
            placeholderTextColor='rgba(38, 70, 83, 0.5)'
            selectionColor='rgba(231, 111, 81, .15)' />
            <TouchableOpacity onPress={this.search}>
            <FontAwesome 
              name="telegram" 
              size={50} 
              color='rgba(231, 111, 81, 1)' 
              margin='5' />
            </TouchableOpacity>
        </View>
      </View>
    )
  }
}

// Navigator for reaching all location related pages from Map screen
export default createStackNavigator({
  Map: {
    screen: Map
  },
  Location: {
    screen: LocationScreen
  },
  Timeline: {
    screen: TimelineScreen
  }, 
  Comment: {
    screen: CommentScreen
  }   
  },
  {
    initialRouteName: 'Map',
    navigationOptions: {
      headerTitle: LogoTitle,
      headerStyle: {
        backgroundColor: '#264653',
      },
      headerTintColor: '#ffffff',
    }
  }
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#3f3f3f',
  },

  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute'
  },

  inputArea: {
    flexDirection: 'row', 
    position: "absolute",
    bottom: 1,
    margin: 6,
  },

  inputBox: {
    flex:1,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 20,
    color: '#264653',
    marginRight: 7,
    elevation: 5,
    fontSize: 25
  },

  radius: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(231, 111, 81, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(231, 111, 81, 0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },

  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E76F51'
  },
});