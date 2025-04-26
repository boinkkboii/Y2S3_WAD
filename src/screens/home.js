/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {Component} from 'react';
import {Button, View, Text} from 'react-native';

export default class Home extends Component {
  render() {
    return (
      <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 24, fontWeight: 'bold'}}>Home Screen with buttons</Text>

        <View style={{margin: 10}}>
          <Button
            title="About"
            onPress={() => this.props.navigation.navigate('About')}
          />
        </View>

        <View style={{margin: 10}}>
          <Button
            title="Profile"
            onPress={() => this.props.navigation.navigate('Profile')}
          />
        </View>

        <View style={{margin: 10}}>
          <Button
            title="Home Page"
            onPress={() => this.props.navigation.navigate('Homepage')}
          />
        </View>
      </View>
    );
  }
}
