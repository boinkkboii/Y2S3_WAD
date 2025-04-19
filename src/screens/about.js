import React, { Component }  from "react";
import {Button,View,Text} from "react-native";

export default class About extends Component{
    render()
    {
        return(
            <View style={{flex:1, alignSelf:'center', justifyContent:'center'}} >
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>About</Text>
                <View style={{ margin: 10 }}>
                    <Button title="Go back" onPress={() => this.props.navigation.goBack()} />
                </View>
                
            </View>
        )
    }
}