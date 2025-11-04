import React, { useState, useEffect, useContext } from 'react';
// ✅ 1. เพิ่ม Platform เข้ามาใน import
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Image, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../screens/AuthContext';
import { API_URL } from '../../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

// ✅ 2. แทนที่ฟังก์ชัน showAlert เดิมด้วยเวอร์ชันที่สมบูรณ์นี้
const showAlert = (title, msg, buttons = []) => {
    if (Platform.OS === 'web') {
        // --- Logic for Web ---
        if (buttons.length > 0 && buttons.find(b => b.style === 'cancel')) {
            if (window.confirm(`${title}\n\n${msg}`)) {
                const confirmButton = buttons.find(b => b.style !== 'cancel');
                if (confirmButton && confirmButton.onPress) confirmButton.onPress();
            } else {
                const cancelButton = buttons.find(b => b.style === 'cancel');
                if (cancelButton && cancelButton.onPress) cancelButton.onPress();
            }
        } else if (buttons.length > 0 && buttons[0].onPress) {
            window.alert(`${title}\n\n${msg}`);
            buttons[0].onPress(); // ทำงานทันทีหลังปิด Alert
        } else {
            window.alert(`${title}\n\n${msg}`);
        }
    } else {
        // --- Native Behavior (iOS/Android) ---
        Alert.alert(title, msg, buttons);
    }
};

export default function AdminAddEditRoomScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { token } = useContext(AuthContext);

    const existingRoom = route.params?.roomData;
    const isEditing = !!existingRoom;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const [allAmenities, setAllAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [newAmenityName, setNewAmenityName] = useState('');

    useEffect(() => {
        navigation.setOptions({ title: isEditing ? 'แก้ไขห้องพัก' : 'เพิ่มห้องพักใหม่' });
        
        const fetchAllAmenities = async () => {
            try {
                const res = await fetch(`${API_URL}/api/amenities`, { headers: { 'Authorization': `Bearer ${token}` }});
                if (!res.ok) throw new Error('Failed to fetch amenities');
                const data = await res.json();
                setAllAmenities(data);
            } catch (error) {
                showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลสิ่งอำนวยความสะดวกได้');
                setIsLoading(false);
            }
        };
        fetchAllAmenities();
    }, [token]);

    useEffect(() => {
        if (isEditing) {
            setName(existingRoom.name);
            setDescription(existingRoom.description || '');
            setPrice(existingRoom.price.toString());
            setImageUrl(existingRoom.image_url || '');

            if (allAmenities.length > 0) {
                const fetchFullRoomDetails = async () => {
                    try {
                        const res = await fetch(`${API_URL}/api/rooms/${existingRoom.id}`);
                        if(!res.ok) throw new Error('Could not fetch room details');
                        const fullRoomData = await res.json();
                        
                        const amenityIds = new Set(
                            fullRoomData.amenities
                                .map(amenityName => {
                                    const amenityObj = allAmenities.find(item => item.name === amenityName);
                                    return amenityObj ? amenityObj.id : null;
                                })
                                .filter(id => id !== null)
                        );
                        setSelectedAmenities(amenityIds);
                    } catch (error) {
                        console.error("Error fetching room amenities:", error);
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchFullRoomDetails();
            }
        } else {
            setIsLoading(false);
        }
    }, [isEditing, existingRoom, allAmenities]);

    const toggleAmenity = (id) => {
        const newSelection = new Set(selectedAmenities);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedAmenities(newSelection);
    };
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setImageUrl(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleAddNewAmenity = async () => {
        if (!newAmenityName.trim()) {
            showAlert('ข้อมูลไม่ถูกต้อง', 'กรุณากรอกชื่อสิ่งอำนวยความสะดวก');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/api/admin/amenities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name: newAmenityName }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'เกิดข้อผิดพลาด');
            }
            setAllAmenities([...allAmenities, result.newAmenity]);
            setSelectedAmenities(new Set([...selectedAmenities, result.newAmenity.id]));
            setNewAmenityName('');
            showAlert('สำเร็จ', 'เพิ่มสิ่งอำนวยความสะดวกใหม่เรียบร้อยแล้ว');
        } catch (error) {
            showAlert('เกิดข้อผิดพลาด', error.message);
        }
    };

    const handleSave = async () => {
        if (!name || !price || !imageUrl) {
            showAlert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกชื่อ, ราคา, และอัปโหลดรูปภาพ');
            return;
        }
        setIsSaving(true);
        const url = isEditing ? `${API_URL}/api/admin/rooms/${existingRoom.id}` : `${API_URL}/api/admin/rooms`;
        const method = isEditing ? 'PUT' : 'POST';
        
        const body = {
            name,
            description,
            price: parseFloat(price),
            image_url: imageUrl,
            amenities_ids: Array.from(selectedAmenities),
        };

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                // ✅ 3. แก้ไขการเรียกใช้ showAlert ให้ส่งปุ่มไปด้วย
                showAlert('สำเร็จ', 'บันทึกข้อมูลห้องพักเรียบร้อยแล้ว', [
                    { text: 'ตกลง', onPress: () => navigation.goBack() }
                ]);
            } else {
                const errorData = await res.json();
                showAlert('เกิดข้อผิดพลาด', errorData.message || 'ไม่สามารถบันทึกข้อมูลได้');
            }
        } catch (error) {
            showAlert('เกิดข้อผิดพลาด', 'การเชื่อมต่อเซิร์ฟเวอร์ล้มเหลว');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>ชื่อห้องพัก</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>คำอธิบาย</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline />
            </View>
             <View style={styles.formGroup}>
                <Text style={styles.label}>ราคา</Text>
                <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
            </View>
            
            <View style={styles.formGroup}>
                <Text style={styles.label}>รูปภาพห้องพัก</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
                    ) : (
                        <View style={{alignItems: 'center'}}>
                            <Ionicons name="cloud-upload-outline" size={40} color="#555" />
                            <Text style={styles.imagePickerText}>คลิกเพื่ออัปโหลดรูปภาพ</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
                <Text style={styles.subtitle}>สิ่งอำนวยความสะดวก:</Text>
                {allAmenities.map(amenity => (
                    <TouchableOpacity key={amenity.id} style={styles.amenityRow} onPress={() => toggleAmenity(amenity.id)}>
                         <View style={[styles.checkbox, selectedAmenities.has(amenity.id) && styles.checkboxSelected]}>
                           {selectedAmenities.has(amenity.id) && <Ionicons name="checkmark" size={18} color="#fff" />}
                        </View>
                        <Text style={styles.amenityText}>{amenity.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.subtitle}>เพิ่มรายการใหม่:</Text>
                <View style={styles.newAmenityContainer}>
                    <TextInput 
                        style={styles.newAmenityInput} 
                        placeholder="เช่น อาหารแมวเกรดพรีเมียม"
                        value={newAmenityName}
                        onChangeText={setNewAmenityName}
                    />
                    <TouchableOpacity style={styles.newAmenityButton} onPress={handleAddNewAmenity}>
                        <Text style={styles.newAmenityButtonText}>เพิ่ม</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={[styles.saveButton, isSaving && { opacity: 0.7 }]} onPress={handleSave} disabled={isSaving}>
                {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>บันทึกข้อมูล</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
        padding: 20,
    },
    formGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    amenityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    amenityText: {
        fontSize: 16,
        marginLeft: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    saveButton: {
        backgroundColor: '#34C759',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    imagePicker: {
        width: '100%',
        height: 200,
        backgroundColor: '#E5E5EA',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        overflow: 'hidden',
    },
    imagePickerText: {
        marginTop: 10,
        color: '#555',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    newAmenityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    newAmenityInput: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        marginRight: 10,
    },
    newAmenityButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
    },
    newAmenityButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

