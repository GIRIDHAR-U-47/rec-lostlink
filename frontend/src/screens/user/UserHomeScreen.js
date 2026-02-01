import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const UserHomeScreen = ({ navigation }) => {
    const { logout, userInfo } = useContext(AuthContext);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, {userInfo?.name}</Text>
                <Text style={styles.subText}>Student / Faculty</Text>
            </View>

            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={[styles.card, { backgroundColor: '#e3f2fd' }]}
                    onPress={() => navigation.navigate('ReportLost')} // To be implemented
                >
                    <Text style={styles.cardTitle}>Report Lost Item</Text>
                    <Text style={styles.cardDesc}>Did you lose something? Report it here.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: '#e8f5e9' }]}
                    onPress={() => navigation.navigate('ReportFound')} // To be implemented
                >
                    <Text style={styles.cardTitle}>Report Found Item</Text>
                    <Text style={styles.cardDesc}>Found something? Help return it.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: '#fff3e0' }]}
                    onPress={() => navigation.navigate('FoundItems')} // To be implemented
                >
                    <Text style={styles.cardTitle}>View Found Items</Text>
                    <Text style={styles.cardDesc}>Browse items currently in Lost & Found.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: '#f3e5f5' }]}
                    onPress={() => navigation.navigate('MyRequests')} // To be implemented
                >
                    <Text style={styles.cardTitle}>My Requests</Text>
                    <Text style={styles.cardDesc}>Track your lost reports and claims.</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    header: {
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003366',
    },
    subText: {
        fontSize: 16,
        color: '#666',
    },
    actionContainer: {
        marginBottom: 30,
    },
    card: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    cardDesc: {
        fontSize: 14,
        color: '#666',
    },
    logoutButton: {
        padding: 15,
        backgroundColor: '#eee',
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: '#333',
        fontWeight: 'bold',
    },
});

export default UserHomeScreen;
