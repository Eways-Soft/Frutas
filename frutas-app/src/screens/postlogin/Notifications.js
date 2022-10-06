import React, { Component } from 'react';

import { Text, View, Image, FlatList } from 'react-native';
import styles from '../../assets/css/AppDesign.js'


export default class Notifications extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        { id: 3, text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ." },
        { id: 2, text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." },
        { id: 4, text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor." },
      ]
    }
  }

  render() {
    return (
      <FlatList
      showsVerticalScrollIndicator ={false}
      showsHorizontalScrollIndicator={false}
        style={styles.root}
        data={this.state.data}
        extraData={this.state}
        ItemSeparatorComponent={() => {
          return (

            <View style={styles.notification_separator} />

          )
        }}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={(item) => {
          const Notification = item.item;
          return (

            <View style={styles.notification_container}>
              <Image source={require('../../assets/images/logo.jpg')} style={styles.notification_avatar} />
              <View style={styles.notification_content}>
                <View style={styles.notification_text_view}>
                  <Text style={[styles.notificationtext, styles.font_light]}>{Notification.text}</Text>
                </View>
                <Text style={[styles.notification_timeAgo, styles.font_light]}>
                  14 May, 2019
                </Text>
              </View>
            </View>
          );
        }} />
    );
  }
}

