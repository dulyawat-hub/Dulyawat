import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Modal, Linking,
    Alert, ActivityIndicator, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from '../Styles/CatsScreenStyles';
import { AuthContext } from './AuthContext';
import { API_URL } from '../../config';

// Helper function to show alerts
const showAlertAllPlatforms = (title, msg, buttons = []) => {
    if (Platform.OS === 'web') {
        window.alert(`${title}\n\n${msg}`);
    } else {
        Alert.alert(title, msg, buttons);
    }
};

export default function CatsScreen() {
    const navigation = useNavigation();
    const { isUserLoggedIn, logout, user, token } = useContext(AuthContext);

    const iconSize = styles.iconText ? styles.iconText.fontSize : 24;
    const iconColor = styles.iconText ? styles.iconText.color : '#888';

    const [cats, setCats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOverlayVisible, setOverlayVisible] = useState(false);

    const fetchCats = async () => {
        setIsLoading(true);
        try {
            if (user && user.id && token) {
                const response = await fetch(`${API_URL}/cats/${user.id}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch cats');
                const data = await response.json();
                setCats(data);
            }
        } catch (error) {
            console.error('Error fetching cats:', error);
            showAlertAllPlatforms('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลแมวได้');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Refetch cats every time the screen comes into focus
        const unsubscribe = navigation.addListener('focus', () => {
            if (isUserLoggedIn) {
                fetchCats();
            } else {
                setCats([]);
                setIsLoading(false);
            }
        });
        return unsubscribe;
    }, [navigation, isUserLoggedIn]);


    const handleDeleteCat = (catId) => {
        Alert.alert(
            'ยืนยันการลบ',
            'คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลแมวตัวนี้?',
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'ลบ',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${API_URL}/cats/${catId}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` },
                            });
                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'ไม่สามารถลบข้อมูลได้');
                            }
                            showAlertAllPlatforms('สำเร็จ', 'ลบข้อมูลแมวเรียบร้อยแล้ว');
                            fetchCats(); // Refresh the list
                        } catch (error) {
                            console.error('Error deleting cat:', error);
                            showAlertAllPlatforms('เกิดข้อผิดพลาด', `ไม่สามารถลบข้อมูลได้: ${error.message}`);
                        }
                    },
                },
            ]
        );
    };

    const toggleOverlay = () => setOverlayVisible(!isOverlayVisible);
    const handleLogout = () => {
        Alert.alert('ยืนยันการออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่?', [
            { text: 'ยกเลิก', style: 'cancel' },
            { text: 'ยืนยัน', onPress: () => { logout(); toggleOverlay(); } },
        ]);
    };
    const profilePicUrl = user?.profile_pic_url || 'https://placehold.co/100x100/81DFEF/FFFFFF?text=DP';

    return (
        <View style={styles.safe}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}> รายชื่อแมวของฉัน </Text>


                    {isLoading ? (
                        <ActivityIndicator size="large" color="#81DFEF" />
                    ) : (
                        cats.map((cat) => (
                            <TouchableOpacity 
                                key={cat.id} 
                                style={styles.catCard} 
                                onLongPress={() => handleDeleteCat(cat.id)}
                                // Navigate to the new AddEditCatScreen with cat data
                                onPress={() => navigation.navigate('AddEditCat', { catData: cat })}
                            >
                                <Image source={{ uri: cat.doc_img_url }} style={styles.catImage} />
                                <View style={styles.catInfo}>
                                    <Text style={styles.catName}>{cat.name}</Text>
                                    <Text style={styles.catBreed}>พันธุ์: {cat.breed || 'ไม่ระบุ'}</Text>
                                    {cat.doc_img_url ? (
                                        <View style={styles.docStatusComplete}>
                                            <Ionicons name="shield-checkmark" size={14} color="#34C759" />
                                            <Text style={styles.docStatusTextComplete}>มีเอกสารครบถ้วน (1)</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.docStatusMissing}>
                                            <Ionicons name="alert-circle" size={14} color="#FF3B30" />
                                            <Text style={styles.docStatusTextMissing}>เอกสารที่ขาดหายไป</Text>
                                        </View>
                                    )}
                                </View>
                                <Ionicons name="create-outline" size={24} color="#C7C7CC" />
                            </TouchableOpacity>
                        ))
                    )}

                    <TouchableOpacity
                        style={[styles.mainButton, isLoading && { opacity: 0.5 }]}
                        // Navigate to the new AddEditCatScreen for adding a new cat
                        onPress={() => navigation.navigate('AddEditCat', { catData: null })}
                        disabled={isLoading}
                    >
                        <Text style={styles.mainButtonText}>
                            {isLoading ? 'กำลังโหลด...' : '＋ เพิ่มแมว'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>

            {/* --- Bottom Menu --- */}
            <View style={styles.bottomMenu}>
                {isUserLoggedIn ? (
                    <>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
                            <Ionicons name="home-sharp" size={iconSize} color={iconColor} />
                            <Text style={styles.menuLabel}>หน้าหลัก</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Booking')}>
                            <Ionicons name="document-text-sharp" size={iconSize} color={iconColor} />
                            <Text style={styles.menuLabel}>การจอง</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Cats')}>
                            <FontAwesome5 name="cat" size={iconSize} color={iconColor} />
                            <Text style={styles.menuLabel}>แมว</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={toggleOverlay}>
                            <Ionicons name="menu-sharp" size={iconSize} color={iconColor} />
                            <Text style={styles.menuLabel}>เพิ่มเติม</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
                            <Ionicons name="home-sharp" size={iconSize} color={iconColor} />
                            <Text style={styles.menuLabel}>หน้าหลัก</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Login')}>
                            <Ionicons name="person-sharp" size={iconSize} color={iconColor} />
                            <Text style={styles.menuLabel}>เข้าสู่ระบบ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={toggleOverlay}>
                            <Ionicons name="menu-sharp" size={iconSize} color={iconColor} />
                            <Text style={styles.menuLabel}>เพิ่มเติม</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* --- Overlay Modal --- */}
            <Modal animationType="slide" transparent={true} visible={isOverlayVisible} onRequestClose={toggleOverlay}>
                <View style={styles.overlayContainer}>
                    <View style={styles.overlayContent}>
                        <View style={styles.overlayHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="menu-sharp" size={30} color="#81DFEF" />
                                <Text style={styles.overlayTitle}>เพิ่มเติม</Text>
                            </View>
                            <TouchableOpacity onPress={toggleOverlay} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                        {isUserLoggedIn ? (
                            <>
                    <Text style={styles.sectionTitle}>บัญชี</Text>
                    <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => {
                    navigation.navigate('Profile');
                    toggleOverlay();
                    }}>
                    <View style={styles.overlayProfileItem}>
                        <Image
                        source={{ uri: profilePicUrl }}
                        style={styles.profileIcon}
                        />
                        <Text style={styles.overlayMenuItemTextV2}>โปรไฟล์</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} color="#81DFEF" />
                    </TouchableOpacity>

                    {/* <Text style={styles.sectionTitle}>ประวัติการใช้งาน</Text>
                    <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => {
                    toggleOverlay();
                    }}>
                    <Text style={styles.overlayMenuItemTextV2}>ประวัติการใช้งาน</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#81DFEF" />
                    </TouchableOpacity> */}

                    <Text style={styles.sectionTitle}>นโยบายห้องพัก</Text>
                    <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => {
                    // ✅ แก้ไข: เพิ่ม onPress handler เพื่อนำทางไปยังหน้า 'Policy'
                    navigation.navigate('HotelPolicy');
                    toggleOverlay();
                    }}>
                    {/* ✅ แก้ไข: ห่อหุ้มข้อความด้วย <Text> component */}
                    <Text style={styles.overlayMenuItemTextV2}>สำหรับห้องพัก</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#81DFEF" />
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>ติดต่อเรา</Text>
                    <TouchableOpacity
                    style={styles.overlayMenuItemV2}
                    onPress={() => Linking.openURL('mailto:dulyawat.p@ku.th')}
                    >
                    <View style={styles.overlayProfileItem}>
                        <Ionicons name="mail-outline" size={24} color="#555" />
                        <Text style={styles.socialText}>dulyawat.p@ku.th</Text>
                    </View>
                    <Ionicons name="open-outline" size={24} color="#81DFEF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={styles.overlayMenuItemV2}
                    onPress={() => Linking.openURL('tel:061 935 7878')}
                    >
                    <View style={styles.overlayProfileItem}>
                        <Ionicons name="call-outline" size={24} color="#555" />
                        <Text style={styles.socialText}>061 935 7878</Text>
                    </View>
                    <Ionicons name="open-outline" size={24} color="#81DFEF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={styles.overlayMenuItemV2}
                    onPress={handleLogout}
                    >
                    <Text style={styles.overlayMenuItemTextV2}>ออกจากระบบ</Text>
                    <Ionicons name="log-out-outline" size={24} color="#81DFEF" />
                    </TouchableOpacity>
                </>
                        ) : (
                            <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => { navigation.navigate('Login'); toggleOverlay(); }}>
                                <Text style={styles.overlayMenuItemTextV2}>เข้าสู่ระบบ</Text>
                                <Ionicons name="log-in-outline" size={24} color="#81DFEF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
