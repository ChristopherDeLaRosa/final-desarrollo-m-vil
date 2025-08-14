// las imports correspondientes a App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// las imports de Screens para el stack navigator
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import ServicesScreen from './screens/ServicesScreen';
import NewsScreen from './screens/NewsScreen';
import VideosScreen from './screens/VideosScreen';
import ProtectedAreasScreen from './screens/ProtectedAreasScreen';
import ProtectedAreasMapScreen from './screens/ProtectedAreasMapScreen';
import MeasuresScreen from './screens/MeasuresScreen';
import TeamScreen from './screens/TeamScreen';
import VolunteerScreen from './screens/VolunteerScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import LoginScreen from './screens/LoginScreen';
import RegulationsScreen from './screens/RegulationsScreen';
import ReportDamageScreen from './screens/ReportDamageScreen';
import MyReportsScreen from './screens/MyReportsScreen';
import ReportsMapScreen from './screens/ReportsMapScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import ProtectedAreaDetailScreen from './screens/ProtectedAreaDetailScreen';
import NewsDetailScreen from './screens/NewsDetailScreen';
import ReportDetailScreen from './screens/ReportDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Context for authentication
export const AuthContext = React.createContext();

// Stack navigators for each tab
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
    </Stack.Navigator>
  );
}

function EnvironmentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProtectedAreas" component={ProtectedAreasScreen} />
      <Stack.Screen name="ProtectedAreaDetail" component={ProtectedAreaDetailScreen} />
      <Stack.Screen name="ProtectedAreasMapScreen" component={ProtectedAreasMapScreen} />
      <Stack.Screen name="Measures" component={MeasuresScreen} />
    </Stack.Navigator>
  );
}

function InfoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Services" component={ServicesScreen} />
      <Stack.Screen name="News" component={NewsScreen} />
      <Stack.Screen name="Videos" component={VideosScreen} />
      <Stack.Screen name="Team" component={TeamScreen} />
      <Stack.Screen name="Volunteer" component={VolunteerScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
    </Stack.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Regulations" component={RegulationsScreen} />
      <Stack.Screen name="ReportDamage" component={ReportDamageScreen} />
      <Stack.Screen name="MyReports" component={MyReportsScreen} />
      <Stack.Screen name="ReportsMap" component={ReportsMapScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}

// Main tab navigator
function MainTabs({ isLoggedIn }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Medio Ambiente') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Información') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Usuario') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStack} />
      <Tab.Screen name="Medio Ambiente" component={EnvironmentStack} />
      <Tab.Screen name="Información" component={InfoStack} />
      <Tab.Screen name="Usuario" component={UserStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <MainTabs isLoggedIn={isLoggedIn} />
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
}