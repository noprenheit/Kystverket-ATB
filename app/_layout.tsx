import { t } from '@/src/i18n';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React from 'react';

// Observer to detect languageStore changes
function Layout() {
    
    return (
        <Tabs screenOptions={{
            headerStyle: { backgroundColor: '#005F8C' },
            headerTintColor: '#FFF',
            tabBarActiveTintColor: '#005F8C',
            tabBarInactiveTintColor: '#888',
        }}>
            <Tabs.Screen 
                name="map" 
                options={{ 
                    title: t('navigation.map'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map" color={color} size={size} />
                    )
                }}
            />
            <Tabs.Screen 
                name="favorites" 
                options={{ 
                    title: t('navigation.favorites'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="star" color={color} size={size} />
                    )
                }}
            />
            <Tabs.Screen 
                name="settings" 
                options={{ 
                    title: t('navigation.settings'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings" color={color} size={size} />
                    )
                }}
            />
            
            {/* Hidden screens for modals */}
            <Tabs.Screen 
                name="index" 
                options={{ 
                    href: null,
                }}
            />
        </Tabs>
    );
}

export default observer(Layout);