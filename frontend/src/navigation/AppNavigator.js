import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import SplashScreen from '../screens/SplashScreen'; // Import custom splash

// Placeholder screens for stacks (will implement next)
import UserHomeScreen from '../screens/user/UserHomeScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import ReportLostScreen from '../screens/user/ReportLostScreen';
import ReportFoundScreen from '../screens/user/ReportFoundScreen';
import FoundItemsScreen from '../screens/user/FoundItemsScreen';
import MyRequestsScreen from '../screens/user/MyRequestsScreen';
import AdminFoundItemsScreen from '../screens/admin/AdminFoundItemsScreen';
import AdminClaimsScreen from '../screens/admin/AdminClaimsScreen';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const UserStack = createStackNavigator();
const AdminStack = createStackNavigator();

const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
);

const UserNavigator = () => (
    <UserStack.Navigator screenOptions={{ headerShown: false }}>
        <UserStack.Screen name="UserHome" component={UserHomeScreen} />
        <UserStack.Screen name="ReportLost" component={ReportLostScreen} />
        <UserStack.Screen name="ReportFound" component={ReportFoundScreen} />
        <UserStack.Screen name="FoundItems" component={FoundItemsScreen} />
        <UserStack.Screen name="MyRequests" component={MyRequestsScreen} />
        {/* Add more user screens */}
    </UserStack.Navigator>
);

const AdminNavigator = () => (
    <AdminStack.Navigator>
        <AdminStack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Student Care Admin' }} />
        <AdminStack.Screen name="AdminFoundItems" component={AdminFoundItemsScreen} options={{ title: 'Manage Found Items' }} />
        <AdminStack.Screen name="AdminClaims" component={AdminClaimsScreen} options={{ title: 'Manage Claims' }} />
        {/* Add more admin screens */}
    </AdminStack.Navigator>
);

const AppNavigator = () => {
    const { isLoading, splashLoading, userToken, userInfo } = useContext(AuthContext);

    if (splashLoading) {
        return <SplashScreen />;
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#003366" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {userToken !== null ? (
                userInfo?.roles?.includes('ROLE_ADMIN') || userInfo?.roles?.includes('ADMIN') ? (
                    <AdminNavigator />
                ) : (
                    <UserNavigator />
                )
            ) : (
                <AuthNavigator />
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;
