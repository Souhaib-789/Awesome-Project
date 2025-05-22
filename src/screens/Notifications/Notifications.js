import React, { useState } from 'react';
import { FlatList,  View, StyleSheet, SafeAreaView } from 'react-native';
import Header from '../../components/Header';
import TextComponent from '../../components/TextComponent';

const Notifications = () => {

    const dummyNotifications = [
    {
        id: '1',
        title: 'New message from Ali',
        description: 'Hey! Are you available for a quick call?',
        time: '2 min ago',
    },
    {
        id: '2',
        title: 'Video uploaded',
        description: 'Your new video was successfully posted.',
        time: '10 min ago',
    },
    {
        id: '3',
        title: 'Friend request accepted',
        description: 'Ahmed accepted your friend request.',
        time: '1 hour ago',
    },
    {
        id: '4',
        title: 'System Update',
        description: 'App has been updated to version 1.2.0.',
        time: 'Yesterday',
    },
];

const NotificationItem = ({ title, description, time }) => (
    <View style={styles.notificationCard}>
        <View style={{ flex: 1 }}>
            <TextComponent style={styles.title} text={title} />
            <TextComponent style={styles.description} text={description} />
        </View>
        <TextComponent style={styles.time} text={time} />
    </View>
);

    return (
        <>
            <Header title="Notifications" back />
            <FlatList
                data={dummyNotifications}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <NotificationItem
                        title={item.title}
                        description={item.description}
                        time={item.time}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        marginVertical: 20,
    },
    notificationCard: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        elevation: 1,
        width: '95%',
        alignSelf: 'center',
    },
    title: {
        fontWeight: '600',
        fontSize: 14,
    },
    description: {
        color: '#555',
        marginTop: 4,
    },
    time: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        marginLeft: 10,
    },
});
