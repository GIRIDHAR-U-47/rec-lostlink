import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import api from '../../services/api';

const ReportFoundScreen = ({ navigation }) => {
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!category || !description || !location) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/items/report', {
                type: 'FOUND',
                category,
                description,
                location,
                dateTime: new Date().toISOString(),
                status: 'PENDING'
            });
            Alert.alert('Success', 'Found item reported! Please submit the item to Student Care.');
            navigation.goBack();
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to report item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Report Found Item</Text>

            <View style={styles.alertBox}>
                <Text style={styles.alertText}>⚠️ Please submit the found item physically to the Student Care department after reporting.</Text>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Enter category" />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe the item..."
                    multiline
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Found Location</Text>
                <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g., Block A, Lab 3" />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Report'}</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 20,
    },
    alertBox: {
        backgroundColor: '#fff3cd',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ffeeba',
    },
    alertText: {
        color: '#856404',
        fontSize: 14,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#eee',
        padding: 15,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#003366',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ReportFoundScreen;
