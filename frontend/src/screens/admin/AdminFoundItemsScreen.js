import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../../services/api';

const AdminFoundItemsScreen = ({ navigation }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        try {
            // For Admin, we might want to see ALL found items or just PENDING ones. 
            // The backend /items/found endpoint currently returns PENDING.
            // We might need a specific admin endpoint to see all statuses, but let's use the found one for now
            // knowing admins can update PENDING items.
            const response = await api.get('/items/found');
            setItems(response.data);
        } catch (error) {
            console.log('Error fetching items', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleVerify = async (itemId) => {
        try {
            await api.put(`/items/${itemId}/status`, null, { params: { status: 'APPROVED' } });
            Alert.alert('Success', 'Item verified and marked as APPROVED');
            fetchItems(); // Refresh
        } catch (error) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.date}>{new Date(item.dateTime).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.location}>Submitted from: {item.location}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.reporter}>Reported by: {item.user?.name} ({item.user?.registerNumber})</Text>

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={[styles.button, styles.verifyButton]}
                    onPress={() => handleVerify(item.id)}
                >
                    <Text style={styles.buttonText}>Confirm Receipt</Text>
                </TouchableOpacity>
            </View>
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
                    ListEmptyComponent={<Text style={styles.emptyText}>No pending items to verify.</Text>}
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
    },
    description: {
        color: '#555',
        marginBottom: 10,
    },
    reporter: {
        fontStyle: 'italic',
        color: '#666',
        marginBottom: 10,
        fontSize: 12,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    verifyButton: {
        backgroundColor: '#28a745',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#666',
    },
});

export default AdminFoundItemsScreen;
