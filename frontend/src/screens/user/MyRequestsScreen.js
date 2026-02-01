import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../services/api';

const MyRequestsScreen = ({ navigation }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyRequests = async () => {
        try {
            const response = await api.get('/items/my-requests');
            setItems(response.data);
        } catch (error) {
            console.log('Error fetching my requests', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#ffc107';
            case 'APPROVED': return '#28a745';
            case 'RETURNED': return '#007bff';
            case 'RESOLVED': return '#17a2b8';
            default: return '#6c757d';
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={[styles.type, { color: item.type === 'LOST' ? '#dc3545' : '#28a745' }]}>
                    {item.type}
                </Text>
                <View style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                </View>
            </View>

            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.date}>{new Date(item.dateTime).toLocaleDateString()}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {item.location ? <Text style={styles.location}>📍 {item.location}</Text> : null}
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
                    ListEmptyComponent={<Text style={styles.emptyText}>You haven't reported anything yet.</Text>}
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
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        alignItems: 'center',
    },
    type: {
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    category: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    date: {
        color: '#888',
        fontSize: 12,
        marginBottom: 5,
    },
    description: {
        color: '#555',
        marginBottom: 5,
    },
    location: {
        color: '#444',
        fontSize: 12,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#666',
    },
});

export default MyRequestsScreen;
