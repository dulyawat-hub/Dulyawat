import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    Modal,
    ActivityIndicator,
    Platform,
    ActionSheetIOS,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/ProfileScreenStyles';
import { AuthContext } from './AuthContext';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '../../config';

export default function ProfileScreen() {
    const navigation = useNavigation();
    // ✅ 1. ดึง token มาจาก AuthContext โดยตรง
    const { user, token, isUserLoggedIn, logout, updateUserProfile } = useContext(AuthContext);

    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
        profilePic: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');

    useEffect(() => {
        if (user) {
            setProfile({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                newPassword: '',
                confirmPassword: '',
                profilePic: user.profile_pic_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            });
        }
    }, [user]);

    const showAlertAllPlatforms = (title, msg, buttons = []) => {
        if (Platform.OS === 'web') {
            window.alert(`${title}\n\n${msg}`);
        } else {
            Alert.alert(title, msg, buttons);
        }
    };

    const uploadProfilePic = async (imageData) => {
        setIsLoading(true);
        let response;
        try {
            if (!token) {
                showAlertAllPlatforms('Authorization Error', 'ผู้ใช้ยังไม่ได้ยืนยันตัวตน');
                setIsLoading(false);
                return;
            }

            response = await fetch(`${API_URL}/upload-profile-pic`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    imageData: imageData,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                showAlertAllPlatforms('อัปโหลดสำเร็จ', 'อัปโหลดรูปโปรไฟล์เรียบร้อยแล้ว');
                updateUserProfile({ profile_pic_url: data.profilePicUrl });
            } else {
                showAlertAllPlatforms('เกิดข้อผิดพลาด', data.message || 'ไม่สามารถอัปโหลดรูปภาพได้');
            }
        } catch (e) {
            console.error('Error uploading profile pic:', e);
            if (e instanceof SyntaxError && response) {
                const textResponse = await response.text();
                console.error("Server's non-JSON response:", textResponse);
                showAlertAllPlatforms('เกิดข้อผิดพลาดจากเซิร์ฟเวอร์', 'เซิร์ฟเวอร์ส่งข้อมูลกลับมาในรูปแบบที่ไม่ถูกต้อง');
            } else {
                showAlertAllPlatforms('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const pickImage = () => {
        const options = ['ยกเลิก', 'ถ่ายรูป', 'เลือกจากคลังรูปภาพ'];
        const runPicker = async (isCamera) => {
            try {
                const permission = isCamera 
                    ? await ImagePicker.requestCameraPermissionsAsync() 
                    : await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                    showAlertAllPlatforms('สิทธิ์ถูกปฏิเสธ', 'คุณต้องอนุญาตเพื่อเลือกรูปภาพ');
                    return;
                }
                const result = await (isCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync)({
                    base64: true,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.5,
                });
                if (!result.canceled && result.assets && result.assets.length > 0) {
                    const imageData = `data:image/jpeg;base64,${result.assets[0].base64}`;
                    await uploadProfilePic(imageData);
                }
            } catch (error) {
                console.error('Image Picker Error:', error);
                showAlertAllPlatforms('เกิดข้อผิดพลาด', 'ไม่สามารถเลือกรูปภาพได้');
            }
        };

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions({ options, cancelButtonIndex: 0 }, (buttonIndex) => {
                if (buttonIndex === 1) runPicker(true);
                else if (buttonIndex === 2) runPicker(false);
            });
        } else {
            Alert.alert('เลือกรูปโปรไฟล์', 'คุณต้องการใช้รูปจากแหล่งใด?', [
                { text: 'ยกเลิก', style: 'cancel' },
                { text: 'ถ่ายรูป', onPress: () => runPicker(true) },
                { text: 'เลือกจากคลังรูปภาพ', onPress: () => runPicker(false) },
            ]);
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        let response;
        try {
            if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
                showAlertAllPlatforms('เกิดข้อผิดพลาด', 'รหัสผ่านใหม่ไม่ตรงกัน');
                setIsLoading(false);
                return;
            }

            if (!token) {
                showAlertAllPlatforms('Authorization Error', 'ผู้ใช้ยังไม่ได้ยืนยันตัวตน');
                setIsLoading(false);
                return;
            }

            response = await fetch(`${API_URL}/update-profile`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    newPassword: profile.newPassword,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                updateUserProfile({ first_name: profile.first_name, last_name: profile.last_name });
                showAlertAllPlatforms('บันทึกสำเร็จ', 'บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว');
                setProfile(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
            } else {
                showAlertAllPlatforms('เกิดข้อผิดพลาด', data.message || 'ไม่สามารถบันทึกข้อมูลได้');
            }
        } catch (e) {
            console.error('Error saving profile:', e);
             if (e instanceof SyntaxError && response) {
                const textResponse = await response.text();
                console.error("Server's non-JSON response:", textResponse);
                showAlertAllPlatforms('เกิดข้อผิดพลาดจากเซิร์ฟเวอร์', 'เซิร์ฟเวอร์ส่งข้อมูลกลับมาในรูปแบบที่ไม่ถูกต้อง');
            } else {
                showAlertAllPlatforms('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const openDeleteModal = () => setDeleteModalVisible(true);
    const closeDeleteModal = () => setDeleteModalVisible(false);

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            showAlertAllPlatforms('เกิดข้อผิดพลาด', 'กรุณาป้อนรหัสผ่านเพื่อยืนยัน');
            return;
        }

        closeDeleteModal();
        setIsLoading(true);
        let response;
        try {
            if (!token) {
                showAlertAllPlatforms('Authorization Error', 'ผู้ใช้ยังไม่ได้ยืนยันตัวตน');
                setIsLoading(false);
                return;
            }

            response = await fetch(`${API_URL}/delete-account`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password: deletePassword }),
            });

            const data = await response.json();

            if (response.ok) {
                showAlertAllPlatforms('ลบบัญชีสำเร็จ', 'บัญชีของคุณถูกลบเรียบร้อยแล้ว');
                logout();
                navigation.navigate('Home');
            } else {
                showAlertAllPlatforms('เกิดข้อผิดพลาด', data.message || 'ไม่สามารถลบบัญชีได้');
            }
        } catch (e) {
            console.error('Error deleting account:', e);
            if (e instanceof SyntaxError && response) {
                const textResponse = await response.text();
                console.error("Server's non-JSON response:", textResponse);
                showAlertAllPlatforms('เกิดข้อผิดพลาดจากเซิร์ฟเวอร์', 'เซิร์ฟเวอร์ส่งข้อมูลกลับมาในรูปแบบที่ไม่ถูกต้อง');
            } else {
                showAlertAllPlatforms('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isUserLoggedIn) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.notLoggedInContainer}>
                    <Text style={styles.notLoggedInText}>คุณยังไม่ได้เข้าสู่ระบบ</Text>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#81DFEF" />
                    </View>
                )}

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={24} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>บัญชี</Text>
                    <TouchableOpacity onPress={handleSaveProfile}>
                        <Ionicons name="save-outline" size={24} color="#81DFEF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileHeader}>
                    <Image source={{ uri: profile.profilePic }} style={styles.profileImage} />
                    <TouchableOpacity style={styles.editProfileButton} onPress={pickImage}>
                        <Text style={styles.editProfileText}>แก้ไขโปรไฟล์</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>ชื่อ:</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.first_name}
                        onChangeText={(text) => setProfile({ ...profile, first_name: text })}
                    />
                    <Text style={styles.label}>นามสกุล:</Text>
                    <TextInput
                        style={styles.input}
                        value={profile.last_name}
                        onChangeText={(text) => setProfile({ ...profile, last_name: text })}
                    />
                    <Text style={styles.label}>อีเมล:</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: '#f0f0f0', color: '#888' }]}
                        value={profile.email}
                        editable={false}
                    />
                    <Text style={styles.label}>รหัสผ่านใหม่:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="รหัสผ่านใหม่"
                        secureTextEntry
                        value={profile.newPassword}
                        onChangeText={(text) => setProfile({ ...profile, newPassword: text })}
                    />
                    <Text style={styles.label}>ยืนยันรหัสผ่านใหม่:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="ยืนยันรหัสผ่านใหม่"
                        secureTextEntry
                        value={profile.confirmPassword}
                        onChangeText={(text) => setProfile({ ...profile, confirmPassword: text })}
                    />
                </View>

                <View style={styles.deleteAccountContainer}>
                    <Text style={styles.deleteAccountTitle}>ลบบัญชี</Text>
                    <Text style={styles.deleteAccountText}>
                        การดำเนินการนี้ไม่สามารถยกเลิกได้ และข้อมูลทั้งหมดของคุณจะถูกลบออกทันที
                    </Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={openDeleteModal}>
                        <Ionicons name="trash-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isDeleteModalVisible}
                onRequestClose={closeDeleteModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>ยืนยันการลบบัญชี</Text>
                        <Text style={styles.modalText}>
                            กรุณากรอกรหัสผ่านเพื่อยืนยัน
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="รหัสผ่านปัจจุบัน"
                            secureTextEntry
                            value={deletePassword}
                            onChangeText={setDeletePassword}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={() => {
                                    closeDeleteModal();
                                    setDeletePassword('');
                                }}
                            >
                                <Text style={styles.modalButtonText}>ยกเลิก</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonDelete]}
                                onPress={handleDeleteAccount}
                            >
                                <Text style={styles.modalButtonText}>ลบ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

