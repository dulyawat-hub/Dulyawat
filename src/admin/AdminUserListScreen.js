import React, { useState, useEffect, useContext } from 'react';
// ✅ 1. เพิ่ม Ionicons เข้ามาใน import
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../screens/AuthContext';
import { API_URL } from '../../config';
import moment from 'moment';
import 'moment/locale/th';
import Ionicons from 'react-native-vector-icons/Ionicons';

moment.locale('th');

const showAlert = (title, msg, buttons = []) => {
    if (Platform.OS === 'web') {
        if (buttons.length > 0 && buttons.find(b => b.style === 'cancel')) {
            if (window.confirm(`${title}\n\n${msg}`)) {
                const confirmButton = buttons.find(b => b.style !== 'cancel');
                if (confirmButton && confirmButton.onPress) confirmButton.onPress();
            } else {
                const cancelButton = buttons.find(b => b.style === 'cancel');
                if (cancelButton && cancelButton.onPress) cancelButton.onPress();
            }
        } else {
            window.alert(`${title}\n\n${msg}`);
        }
    } else {
        Alert.alert(title, msg, buttons);
    }
};

export default function AdminUserListScreen() {
    const navigation = useNavigation();
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchUsers);
        return unsubscribe;
    }, [navigation, token]);

    useEffect(() => {
        const filtered = users.filter(user =>
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);


    const handleDeleteUser = (userId, userName) => {
        showAlert(
            'ยืนยันการลบ',
            `คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีของ "${userName}"? การกระทำนี้ไม่สามารถย้อนกลับได้`,
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'ลบ',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (!res.ok) throw new Error('Failed to delete user');
                            showAlert('สำเร็จ', `ลบบัญชีของ ${userName} เรียบร้อยแล้ว`);
                            fetchUsers();
                        } catch (error) {
                            showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถลบบัญชีได้');
                        }
                    }
                }
            ]
        );
    };

    const renderUserCard = ({ item }) => (
        <View style={styles.card}>
            <Image 
                source={{ uri: item.profile_pic_url || 'https://placehold.co/60x60/EFEFEF/333?text=User' }} 
                style={styles.profileImage} 
            />
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.first_name} {item.last_name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userDate}>สมัครเมื่อ: {moment(item.created_at).format('LL')}</Text>
            </View>
            <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleDeleteUser(item.id, `${item.first_name} ${item.last_name}`)}
            >
                <Text style={styles.deleteButtonText}>ลบ</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredUsers}
                renderItem={renderUserCard}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <>
                        <Text style={styles.title}>ข้อมูลของสมาชิก</Text>
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="ค้นหาชื่อลูกค้า..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        {isLoading ? <ActivityIndicator size="large" /> : <Text style={styles.emptyText}>ไม่พบข้อมูลสมาชิก</Text>}
                    </View>
                }
                refreshing={isLoading}
                onRefresh={fetchUsers}
            />
            {/* ✅ 2. เพิ่มปุ่มรีเฟรช */}
            <TouchableOpacity style={styles.refreshButton} onPress={fetchUsers}>
                <Ionicons name="refresh" size={24} color="#333" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F7' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
    searchContainer: {
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    searchInput: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    card: { 
        backgroundColor: 'white', 
        borderRadius: 10, 
        padding: 15, 
        marginHorizontal: 15, 
        marginBottom: 15, 
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.2, 
        shadowRadius: 2 
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: '#555',
    },
    userDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 16, color: '#888' },
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

