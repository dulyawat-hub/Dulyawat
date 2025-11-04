import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from './AuthContext';
import { API_URL } from '../../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/th';

moment.locale('th');

const CountdownTimer = () => {
    // 1. สร้าง state สำหรับเก็บเวลาหมดเขต โดยจะถูกสร้างขึ้นแค่ครั้งเดียวตอนที่ Component ถูกโหลด
    const [deadline] = useState(() => {
        const twentyFourHoursFromNow = new Date();
        twentyFourHoursFromNow.setHours(twentyFourHoursFromNow.getHours() + 24);
        return twentyFourHoursFromNow;
    });

    const calculateTimeLeft = () => {
        const difference = +deadline - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        // 2. ให้นาฬิกาเดินทุกๆ 1 วินาที
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // 3. หยุดการทำงานของนาฬิกาเมื่อออกจากหน้านี้
        return () => clearInterval(timer);
    }, []); // ใช้ [] เพื่อให้ useEffect ทำงานแค่ครั้งเดียว

    const hasTimeLeft = Object.keys(timeLeft).length > 0;
    
    return (
        <View style={styles.timerContainer}>
            {hasTimeLeft ? (
                <Text style={styles.timerText}>
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                </Text>
            ) : (
                <Text style={styles.timerExpired}>หมดเวลาชำระเงิน</Text>
            )}
        </View>
    );
};

export default function PaymentScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { user, token } = useContext(AuthContext);
    
    const { bookingId, paymentDeadline, roomDetails, checkInDate, checkOutDate, totalPrice, depositAmount } = route.params;

    const [slipImage, setSlipImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setSlipImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };
    
    const handleConfirmPayment = async () => {
        if (!slipImage) {
            Alert.alert('ข้อผิดพลาด', 'กรุณาอัปโหลดสลิปการชำระเงิน');
            return;
        }

        setIsUploading(true);
        try {
            const response = await fetch(`${API_URL}/api/bookings/${bookingId}/upload-slip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ slip_image_data: slipImage })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'เกิดข้อผิดพลาด');

            Alert.alert('สำเร็จ', 'ยืนยันการชำระเงินเรียบร้อยแล้ว', [
                { text: 'ตกลง', onPress: () => navigation.navigate('Booking') }
            ]);

        } catch (error) {
            Alert.alert('เกิดข้อผิดพลาด', error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>ยืนยันการจองและชำระเงิน</Text>
                
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryText}>คุณ: {user?.first_name} {user?.last_name}</Text>
                    <Text style={styles.summaryText}>ได้จองห้องพัก: {roomDetails?.name} (1 ห้อง)</Text>
                    <Text style={styles.summaryText}>เช็คอิน: {moment(checkInDate).format('LL')}</Text>
                    <Text style={styles.summaryText}>เช็คเอาท์: {moment(checkOutDate).format('LL')}</Text>
                    <Text style={styles.summaryText}>ราคารวม: ฿{totalPrice}</Text>
                    <Text style={styles.amountText}>ยอดมัดจำที่ต้องชำระ (50%): ฿{depositAmount}</Text>
                </View>

                <Text style={styles.countdownTitle}>กรุณาชำระเงินภายใน:</Text>
                <CountdownTimer deadline={paymentDeadline} />

                <Text style={styles.qrTitle}>สแกน QR Code เพื่อชำระเงิน</Text>
                <Image 
                    style={styles.qrCode} 
                    source={{ uri: `https://promptpay.io/0619357878/${depositAmount}.png` }}
                />
                
                <Text style={styles.uploadTitle}>อัปโหลดสลิปการชำระเงิน</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    <Ionicons name="cloud-upload-outline" size={24} color="#007AFF" />
                    <Text style={styles.uploadButtonText}>{slipImage ? 'เปลี่ยนสลิป' : 'เลือกสลิป'}</Text>
                </TouchableOpacity>

                {slipImage && <Image source={{ uri: slipImage }} style={styles.slipPreview} />}

                <TouchableOpacity 
                    style={[styles.confirmButton, isUploading && { opacity: 0.5 }]} 
                    onPress={handleConfirmPayment}
                    disabled={isUploading}
                >
                    {isUploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmButtonText}>ยืนยันการชำระเงิน</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F7' },
    scrollContent: { padding: 20, alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    summaryCard: { backgroundColor: '#fff', padding: 15, borderRadius: 10, width: '100%', marginBottom: 20, borderWidth: 1, borderColor: '#eee' },
    summaryText: { fontSize: 16, marginBottom: 5 },
    amountText: { fontSize: 18, fontWeight: 'bold', marginTop: 10, color: '#007AFF' },
    countdownTitle: { fontSize: 16, color: '#555' },
    timerContainer: { backgroundColor: '#FFFBE6', padding: 10, borderRadius: 5, marginVertical: 10, borderWidth: 1, borderColor: '#FEEFC3'},
    timerText: { fontSize: 24, fontWeight: 'bold', color: '#D97706', letterSpacing: 2 },
    timerExpired: { fontSize: 18, color: '#FF3B30', fontWeight: 'bold' },
    qrTitle: { fontSize: 16, marginTop: 20, fontWeight: '600' },
    qrCode: { width: 200, height: 200, marginVertical: 15 },
    uploadTitle: { fontSize: 16, marginTop: 15, fontWeight: '600' },
    uploadButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E5EA', padding: 12, borderRadius: 10, marginTop: 10 },
    uploadButtonText: { color: '#007AFF', marginLeft: 10, fontWeight: 'bold' },
    slipPreview: { width: 150, height: 200, resizeMode: 'contain', marginTop: 15, borderRadius: 5, borderWidth: 1, borderColor: '#ddd' },
    confirmButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 15, width: '100%', alignItems: 'center', marginTop: 30 },
    confirmButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});