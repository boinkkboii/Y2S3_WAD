import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const VersionScreen = () => {
  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>
        <Image
          source={require('../img/buslogo.png')}
          style={styles.logo}
        />
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.versionText}>Release Date: May 10, 2025</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 myBus. All rights reserved.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    paddingTop: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 15,
    color: '#7f8d94',
    fontWeight: '600',
    fontFamily: 'Nunito',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#7f8d94',
  },
  logo: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
});

export default VersionScreen;