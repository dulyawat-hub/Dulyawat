import React, { useContext } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AuthContext } from '../screens/AuthContext'; 
import { useNavigation } from '@react-navigation/native';

export default function AdminDashboardScreen() {
    const { logout, user } = useContext(AuthContext);
    const navigation = useNavigation();

    const profilePicUrl = user?.profile_pic_url || 'https://placehold.co/40x40/EFEFEF/333?text=A';

    // ✅ 1. สร้างฟังก์ชันสำหรับจัดการการออกจากระบบโดยเฉพาะ
    const handleLogout = () => {
        logout(); // ล้างข้อมูลผู้ใช้
        navigation.replace('Home'); // นำทางกลับไปหน้าแรก และไม่ให้ย้อนกลับมาได้
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.pageContainer}>
                {/* --- Header Section --- */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/m.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.navContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminRoomList')}>
                            <Text style={styles.navLink}>จัดการรายละเอียดห้องพัก</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminBookingList')}>
                            <Text style={styles.navLink}>คำร้องขอการจองห้องพัก</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminStayHistory')}>
                            <Text style={styles.navLink}>บันทึกการเข้าพักของสมาชิก</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('AdminUserList')}>
                            <Text style={styles.navLink}>ข้อมูลของสมาชิก</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Image 
                                source={{ uri: profilePicUrl }}
                                style={styles.profileImage}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- Main Content Area --- */}
                <View style={styles.mainContent}>
                    <Text style={styles.mainTitle}>ยินดีต้อนรับสู่ระบบจัดการหลังบ้าน</Text>
                    <Text style={styles.mainSubtitle}>เลือกเมนูด้านบนเพื่อเริ่มการทำงาน</Text>
                    
                    {/* ✅ 2. แก้ไข onPress ให้เรียกใช้ฟังก์ชันใหม่ */}
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    pageContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    logoContainer: {
        justifyContent: 'flex-start',
    },
    logo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    navLink: {
        marginHorizontal: 15,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    profileContainer: {
        justifyContent: 'flex-end',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#F5F5F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    mainSubtitle: {
        fontSize: 16,
        color: '#888',
        marginTop: 10,
        marginBottom: 30,
    },
    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

