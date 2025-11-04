import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../screens/AuthContext';
import { API_URL } from '../../config';
import Ionicons from 'react-native-vector-icons/Ionicons';

const showAlert = (title, msg, buttons = []) => {
    if (Platform.OS === 'web') {
        if (buttons.length === 2 && buttons.find(b => b.style === 'cancel')) {
            if (window.confirm(`${title}\n\n${msg}`)) {
                const confirmButton = buttons.find(b => b.style !== 'cancel');
                if (confirmButton && confirmButton.onPress) {
                    confirmButton.onPress();
                }
            } else {
                const cancelButton = buttons.find(b => b.style === 'cancel');
                if (cancelButton && cancelButton.onPress) {
                    cancelButton.onPress();
                }
            }
        } 
        else if (buttons.length > 0 && buttons[0].onPress) {
            window.alert(`${title}\n\n${msg}`);
            buttons[0].onPress();
        } 
        else {
            window.alert(`${title}\n\n${msg}`);
        }
    } else {
        Alert.alert(title, msg, buttons);
    }
};


export default function AdminRoomListScreen() {
    const navigation = useNavigation();
    const { token } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/rooms`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch rooms');
            const data = await res.json();
            setRooms(data);
        } catch (error) {
            showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลห้องพักได้');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchRooms);
        return unsubscribe;
    }, [navigation]);

    const handleDelete = (roomId) => {
        showAlert('ยืนยันการลบ', 'คุณแน่ใจหรือไม่ว่าต้องการลบห้องนี้?', [
            { text: 'ยกเลิก', style: 'cancel' },
            { text: 'ลบ', style: 'destructive', onPress: async () => {
                try {
                    const res = await fetch(`${API_URL}/api/admin/rooms/${roomId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!res.ok) throw new Error('Failed to delete room');
                    showAlert('สำเร็จ', 'ลบห้องพักเรียบร้อยแล้ว');
                    fetchRooms();
                } catch (error) {
                    showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถลบห้องพักได้');
                }
            }}
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={rooms}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={() => (
                    <>
                        <Text style={styles.title}>จัดการห้องพัก</Text>
                        <View style={styles.listHeaderRow}>
                            <Text style={[styles.headerText, { flex: 1 }]}>ลำดับ</Text>
                            <Text style={[styles.headerText, { flex: 4 }]}>ชื่อห้อง</Text>
                            <Text style={[styles.headerText, { flex: 2, textAlign: 'center' }]}>สถานะ</Text>
                            <Text style={[styles.headerText, { flex: 2, textAlign: 'center' }]}>จัดการ</Text>
                        </View>
                    </>
                )}
                renderItem={({ item, index }) => (
                    <View style={styles.roomCard}>
                        <Text style={[styles.roomText, { flex: 1 }]}>{index + 1}</Text>
                        <Text style={[styles.roomText, { flex: 4 }]}>{item.name}</Text>
                        
                        <View style={[styles.statusContainer, { flex: 2 }]}>
                            <View style={[styles.statusBadge, item.status === 'ว่าง' ? styles.statusAvailable : styles.statusBooked]}>
                                <Text style={styles.statusText}>{item.status}</Text>
                            </View>
                        </View>

                        <View style={[styles.buttonContainer, { flex: 2, justifyContent: 'center' }]}>
                            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('AdminAddEditRoom', { roomData: item })}>
                                <Text style={styles.buttonText}>แก้ไข</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                                <Text style={styles.buttonText}>ลบ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                refreshing={isLoading}
                onRefresh={fetchRooms}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AdminAddEditRoom', { roomData: null })}>
                <Text style={styles.addButtonText}>＋ เพิ่มห้องพักใหม่</Text>
            </TouchableOpacity>

            {/* ✅ 2. เพิ่มปุ่มรีเฟรช */}
            <TouchableOpacity style={styles.refreshButton} onPress={fetchRooms}>
                <Ionicons name="refresh" size={24} color="#333" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    listHeaderRow: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginHorizontal: 15,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    roomCard: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
    },
    roomText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    statusContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusAvailable: {
        backgroundColor: '#34C759', // Green
    },
    statusBooked: {
        backgroundColor: '#FF3B30', // Red
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: '#FF9500',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#34C759',
        padding: 15,
        margin: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // ✅ 3. เพิ่มสไตล์สำหรับปุ่มรีเฟรช
    refreshButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 10,
        borderRadius: 25, // Make it circular
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});

