import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

const AdminHomeScreen = ({ navigation }) => {
    const { logout, userInfo } = useContext(AuthContext);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Admin Dashboard</Text>
                <Text style={styles.subText}>{userInfo?.name} | Student Care</Text>
            </View>

            <View style={styles.statsContainer}>
                {/* Placeholder stats */}
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>45</Text>
                    <Text style={styles.statLabel}>Returned</Text>
                </View>
            </View>

            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={[styles.card, { backgroundColor: COLORS.lavender }]}
                    onPress={() => navigation.navigate('AdminFoundItems')} // To be implemented
                >
                    <Text style={styles.cardTitle}>Manage Found Items</Text>
                    <Text style={styles.cardDesc}>Verify physical receipt of student submissions.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: COLORS.pastel }]}
                >
                    <Text style={styles.cardTitle}>View Lost Reports</Text>
                    <Text style={styles.cardDesc}>See what students have reported lost.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: COLORS.background, borderColor: COLORS.success, borderWidth: 1 }]}
                    onPress={() => navigation.navigate('AdminClaims')}
                >
                    <Text style={styles.cardTitle}>Manage Claims</Text>
                    <Text style={styles.cardDesc}>Approve or reject ownership claims.</Text>
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
        backgroundColor: COLORS.white,
        flexGrow: 1,
    },
    header: {
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    subText: {
        fontSize: 16,
        color: COLORS.textLight,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statBox: {
        width: '48%',
        backgroundColor: COLORS.background,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    statLabel: {
        color: COLORS.textLight,
    },
    actionContainer: {
        marginBottom: 30,
    },
    card: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: COLORS.text,
    },
    cardDesc: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    logoutButton: {
        padding: 15,
        backgroundColor: COLORS.border,
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
});

export default AdminHomeScreen;
