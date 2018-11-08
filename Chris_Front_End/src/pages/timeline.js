import React, { Component } from 'react';
import { StyleSheet, View} from 'react-native';
import Timeline from 'react-native-timeline-listview';

export default class TimelineView extends Component {

  // Aligns the header text with back button
  static navigationOptions = {
    headerRight: <View/>
  }

  /* Envokes on page load */
  componentWillMount() {
    this.loadTimelineEntrys()
  }

  /* Loads all comments of current location */
  loadTimelineEntrys () {
    data = []
    const {navigation} = this.props
    const timelineData = navigation.getParam('data', 'failed')

    for (var i = 0; i < timelineData.length; i++) {
      data.push({time: timelineData[i].Year, description: timelineData[i].Description})
    }
    data.push({description: " "})
  }
    
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, padding: 10}}>
          <Timeline 
            style={styles.timeline}
            data={data}
            circleSize={20}
            circleColor='#E9C46A'
            lineColor='#E9C46A'
            timeContainerStyle={{minWidth:65, flex: 2, justifyContent:'center', paddingTop: 16}}
            timeStyle={{
              textAlign: 'center', 
              backgroundColor:'#2A9D8F', 
              color:'#ffffff', 
              padding:5, 
              borderRadius:13, 
              fontSize: 20, 
              fontWeight: 'bold'}}
            descriptionStyle={{color:'white'}}
            innerCircle={'dot'}
            columnFormat='single-column-left'
            options={{
              style:{paddingTop:5}
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E76F51'
  },

  headerText: {
    color: '#ffffff',
    fontSize: 40,
    marginTop: 5,
    fontWeight: '500',
    textAlign: 'center',
  },

  buttonLayout: {
    flex: .1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2
  },

  button: {
    width: '45%',
    height: 43,
    backgroundColor: '#005ccb',
    borderRadius: 25,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    paddingTop: 4
  },

  timeline: {
    top: 35
  }
});