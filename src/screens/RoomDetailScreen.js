import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, ActivityIndicator, TouchableOpacity, Linking, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../config';
import styles from '../Styles/RoomDetailScreenStyles';
import { AuthContext } from './AuthContext';
import moment from 'moment';

const RoomDetailScreen = ({ route, navigation }) => {
    const { roomId, checkInDate, checkOutDate, catCount } = route.params;
    
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const { isUserLoggedIn, user, token } = useContext(AuthContext);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/api/rooms/${roomId}`);
                if (!response.ok) throw new Error('Failed to fetch room details');
                const data = await response.json();
                setRoom(data);
            } catch (error) {
                console.error("Failed to fetch room details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoomDetails();
    }, [roomId]);

    const handleBooking = async () => {
        setIsBooking(true);
        try {
            if (!token) {
                Alert.alert('ข้อผิดพลาด', 'ไม่พบข้อมูลยืนยันตัวตน กรุณาล็อกอินใหม่อีกครั้ง');
                setIsBooking(false);
                return;
            }

            // ✅✅✅ START: แก้ไขวิธีการคำนวณจำนวนคืน ✅✅✅
            const start = moment(checkInDate).startOf('day');
            const end = moment(checkOutDate).startOf('day');
            const nights = end.diff(start, 'days');
            // ✅✅✅ END: แก้ไขวิธีการคำนวณจำนวนคืน ✅✅✅
            
            if (nights <= 0) {
                Alert.alert('ข้อผิดพลาด', 'วันที่เช็คเอาท์ต้องอยู่หลังจากวันเช็คอิน');
                setIsBooking(false);
                return;
            }
            
            const totalPrice = nights * room.price;
            const depositAmount = totalPrice * 0.5;

            const bookingData = {
                room_id: roomId,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                cat_count: catCount,
                total_price: totalPrice,
                deposit_amount: depositAmount,
            };

            const response = await fetch(`${API_URL}/api/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'เกิดข้อผิดพลาดในการจอง');

            navigation.navigate('Payment', {
                bookingId: result.bookingId,
                paymentDeadline: result.paymentDeadline,
                roomDetails: room,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                totalPrice: totalPrice,
                depositAmount: depositAmount
            });

        } catch (error) {
            console.error("Booking failed:", error);
            Alert.alert('การจองล้มเหลว', error.message);
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) { return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />; }
    if (!room) { return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>ไม่พบข้อมูลห้องพัก</Text></View>; }
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                 <Image source={{ uri: room.image_url }} style={styles.headerImage} />
                 <View>
                     <Text style={styles.roomName}>{room.name}</Text>
                     <Text style={styles.infoText}>คำอธิบาย: {room.description}</Text>
                     <Text style={styles.sectionTitle}>ข้อมูลโรงแรม</Text>
                     <Text style={styles.infoText}>ชื่อโรงแรม: {room.hotel.name}</Text>
                     <Text style={styles.infoText}>ที่อยู่: {room.hotel.address}</Text>
                     <Text style={styles.sectionTitle}>ติดต่อเรา</Text>
                     <Text style={styles.infoText}>E-mail: {room.hotel.email}</Text>
                     <Text style={styles.infoText}>เบอร์โทร: {room.hotel.phone}</Text>
                     <Text style={styles.price}>฿ {room.price} / คืน</Text>
                     <Text style={styles.sectionTitle}>สิ่งอำนวยความสะดวก</Text>
                     <View style={styles.amenitiesContainer}>
                         {room.amenities.map((item, index) => (
                             <View key={index} style={styles.amenityItem}>
                                 <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
                                 <Text style={styles.amenityText}>{item}</Text>
                             </View>
                         ))}
                     </View>
                     <Text style={styles.sectionTitle}>รีวิวจากผู้ใช้งาน ({room.reviews.length})</Text>
                     {room.reviews.map((review) => (
                          <View key={review.id} style={styles.reviewCard}>
                              <Text style={styles.reviewUser}>{review.username}</Text>
                              <Text style={styles.reviewText}>"{review.comment}"</Text>
                              <Text style={styles.reviewRating}>คะแนน: {review.rating}/5</Text>
                          </View>
                     ))}
                 </View>
             </ScrollView>
            
            {isUserLoggedIn && (
                <View style={styles.bookingButtonContainer}>
                    <TouchableOpacity 
                        style={[styles.bookingButton, isBooking && {backgroundColor: '#ccc'}]} 
                        onPress={handleBooking}
                        disabled={isBooking}
                    >
                        {isBooking ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookingButtonText}>ยืนยันการจอง</Text>}
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

export default RoomDetailScreen;

