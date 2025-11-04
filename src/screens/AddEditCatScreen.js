import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, Platform, ActionSheetIOS } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/AddEditCatScreenStyles'; // Import styles for this screen
import { AuthContext } from './AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '../../config';

const showAlert = (title, msg) => Alert.alert(title, msg);

export default function AddEditCatScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { token } = useContext(AuthContext);

    const existingCat = route.params?.catData;
    const isEditing = !!existingCat;

    const [catName, setCatName] = useState('');
    const [catBreed, setCatBreed] = useState('');
    // ✅ ลบ state ของรูปโปรไฟล์แมวออก
    // const [catImage, setCatImage] = useState(null); 
    const [docImage, setDocImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: isEditing ? 'แก้ไขข้อมูลแมว' : 'เพิ่มแมวตัวใหม่',
        });

        if (isEditing) {
            setCatName(existingCat.name);
            setCatBreed(existingCat.breed || '');
            // ✅ ลบการตั้งค่ารูปโปรไฟล์แมวออก
            // setCatImage(existingCat.img_url);
            setDocImage(existingCat.doc_img_url);
        }
    }, [navigation, isEditing, existingCat]);

    const pickImage = (setImage) => {
        const options = ['ยกเลิก', 'ถ่ายรูป', 'เลือกจากคลังรูปภาพ'];
        const runPicker = async (isCamera) => {
            try {
                const permission = isCamera 
                    ? await ImagePicker.requestCameraPermissionsAsync() 
                    : await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                    showAlert('สิทธิ์ถูกปฏิเสธ', 'คุณต้องอนุญาตเพื่อเลือกรูปภาพ');
                    return;
                }
                const result = await (isCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync)({
                    base64: true,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.5,
                });
                if (!result.canceled) {
                    const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
                    setImage(base64Image);
                }
            } catch (error) {
                console.error('Image Picker Error:', error);
                showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถเลือกรูปภาพได้');
            }
        };

        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions({ options, cancelButtonIndex: 0 }, (buttonIndex) => {
                if (buttonIndex === 1) runPicker(true);
                else if (buttonIndex === 2) runPicker(false);
            });
        } else {
            Alert.alert('เลือกรูปภาพ', 'คุณต้องการใช้รูปจากแหล่งใด?', [
                { text: 'ยกเลิก', style: 'cancel' },
                { text: 'ถ่ายรูป', onPress: () => runPicker(true) },
                { text: 'เลือกจากคลังรูปภาพ', onPress: () => runPicker(false) },
            ]);
        }
    };

    const handleSave = async () => {
        // ✅ แก้ไข: ลบการตรวจสอบรูปโปรไฟล์แมวออก
        if (!catName) {
            showAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกชื่อของแมว');
            return;
        }

        setIsUploading(true);
        
        const url = isEditing ? `${API_URL}/cats/${existingCat.id}` : `${API_URL}/cats`;
        const method = isEditing ? 'PUT' : 'POST';

        const body = {
            name: catName,
            breed: catBreed,
            // ✅ ลบ img_url ออกจากการส่งข้อมูล
            doc_img_url: docImage && docImage.startsWith('data:image') ? docImage : undefined,
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'เกิดข้อผิดพลาด');
            }

            showAlert('สำเร็จ', `บันทึกข้อมูลแมวเรียบร้อยแล้ว`);
            navigation.goBack();

        } catch (error) {
            console.error('Error saving cat:', error);
            showAlert('เกิดข้อผิดพลาด', error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'ยืนยันการลบ',
            `คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลของ "${existingCat.name}"?`,
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'ลบ',
                    style: 'destructive',
                    onPress: async () => {
                        setIsUploading(true);
                        try {
                            const response = await fetch(`${API_URL}/cats/${existingCat.id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` },
                            });
                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'ไม่สามารถลบข้อมูลได้');
                            }
                            showAlert('สำเร็จ', 'ลบข้อมูลแมวเรียบร้อยแล้ว');
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error deleting cat:', error);
                            showAlert('เกิดข้อผิดพลาด', error.message);
                        } finally {
                            setIsUploading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Cat Details Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>รายละเอียดแมว</Text>
                <Text style={styles.sectionSubtitle}>กรุณาเพิ่มรายละเอียดของแมวของคุณ</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>ชื่อแมว: *</Text>
                    <TextInput
                        style={styles.input}
                        value={catName}
                        onChangeText={setCatName}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>พันธุ์แมว:</Text>
                    <TextInput
                        style={styles.input}
                        value={catBreed}
                        onChangeText={setCatBreed}
                    />
                </View>
            </View>

            {/* ✅ ลบส่วนแสดงรูปโปรไฟล์แมวออกทั้งหมด */}

            {/* Cat Document Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>เอกสารแมว</Text>
                <Text style={styles.sectionSubtitle}>กรุณาเพิ่มเอกสารที่เกี่ยวข้องกับแมวของคุณ</Text>
                {!docImage ? (
                     <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setDocImage)}>
                        <Ionicons name="add-circle-outline" size={24} color="#555" />
                        <Text style={styles.imagePickerText}>คลิกเพื่อเพิ่มรูปภาพ</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.imagePreviewContainer}>
                        <Image source={{ uri: docImage }} style={styles.imagePreview} />
                         <TouchableOpacity style={styles.deleteButton} onPress={() => setDocImage(null)}>
                            <Ionicons name="trash-outline" size={20} color="#fff" />
                            <Text style={styles.deleteButtonText}>ลบ</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isUploading}>
                {isUploading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveButtonText}>บันทึกข้อมูล</Text>
                )}
            </TouchableOpacity>

            {isEditing && (
                <TouchableOpacity 
                    style={styles.deleteCatButton} 
                    onPress={handleDelete} 
                    disabled={isUploading}
                >
                    <Text style={styles.deleteCatButtonText}>ลบข้อมูลแมว</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}
