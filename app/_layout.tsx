// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: '#005F8C' },
            headerTintColor: '#FFF'
        }}>
            <Stack.Screen name="index" options={{ title: 'Kystvær' }}/>
            <Stack.Screen name="detail/[id]" options={{ presentation: 'modal', title: 'Detaljer' }}/>
            <Stack.Screen name="settings" options={{ title: 'Innstillinger' }}/>
        </Stack>
    );
}
