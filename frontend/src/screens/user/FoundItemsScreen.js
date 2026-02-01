import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import api from '../../services/api';

const FoundItemsScreen = ({ navigation }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        try {
            const response = await api.get('/items/found');
            setItems(response.data);
        } catch (error) {
            console.log('Error fetching found items', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.date}>{new Date(item.dateTime).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.location}>📍 {item.location}</Text>
            <Text style={styles.description}>{item.description}</Text>

            {/* Assuming we might want to Claim it */}
            <TouchableOpacity
                style={styles.claimButton}
                onPress={() => navigation.navigate('ClaimItem', { item })} // To be implemented
            >
                <Text style={styles.claimButtonText}>This is mine!</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#003366" />
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No found items reported yet.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    category: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003366',
    },
    date: {
        color: '#666',
        fontSize: 12,
    },
    location: {
        color: '#444',
        marginBottom: 5,
        fontWeight: '500',
    },
    description: {
        color: '#555',
        marginBottom: 10,
    },
    claimButton: {
        backgroundColor: '#003366',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    claimButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#666',
    },
});

export default FoundItemsScreen;
