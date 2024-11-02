import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Map from './screens/Map/Map';
import Search from './screens/Search/Search';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { View, Text, StyleSheet } from 'react-native';
import { RegionProvider } from './MyContext';


import Routes from './Routes';

const Tab = createBottomTabNavigator();

interface CustomTabBarLabelProps {
  color: string;
  size: number;
  label: string;
}

const CustomTabBarLabel: React.FC<CustomTabBarLabelProps> = ({ color, size, label }) => (
  <Text style={{ color, fontSize: size }}>{label}</Text>
);

const Main: React.FC = () => {
  return (
    <RegionProvider>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'rgba(142, 138, 255, 1)', 
          tabBarInactiveTintColor: 'black', 
          tabBarStyle: { height: 60, padding: 10 }
        }}
      >
        <Tab.Screen 
          name={Routes.home} 
          component={Map} 
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View style={{ alignItems: 'center' }}>
                <FontAwesomeIcon icon={faHome} size={25} color={color} />
              </View>
            ),
            tabBarLabel: ({ color }) => (
              <CustomTabBarLabel color={color} size={20} label="Map" />
            ),
          }} 
        />
        
        <Tab.Screen 
          name={Routes.search} 
          component={Search} 
          options={{
            headerShown: false,
            tabBarIcon: ({ color}) => (
              <View style={{ alignItems: 'center' }}>
                <FontAwesomeIcon icon={faSearch} size={25} color={color} />
              </View>
            ),
            tabBarLabel: ({ color}) => (
              <CustomTabBarLabel color={color} size={20} label="Search" />
            ),
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
    </RegionProvider>
  );
}

export default Main;
