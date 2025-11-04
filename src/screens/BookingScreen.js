// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert, Modal, TextInput, Platform, Linking } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import moment from 'moment';
// import 'moment/locale/th';
// import styles from '../Styles/BookingScreenStyles';
// import { AuthContext } from './AuthContext';
// import { API_URL } from '../../config';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// moment.locale('th');

// export default function BookingScreen() {
//     const navigation = useNavigation();
//     const { user, token, isUserLoggedIn, logout } = useContext(AuthContext);
//     const [bookings, setBookings] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isOverlayVisible, setOverlayVisible] = useState(false);

//     // States for Add/Edit Review Modal
//     const [isReviewModalVisible, setReviewModalVisible] = useState(false);
//     const [selectedBooking, setSelectedBooking] = useState(null);
//     const [rating, setRating] = useState(0);
//     const [comment, setComment] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // State for View Review Modal
//     const [isViewReviewModalVisible, setViewReviewModalVisible] = useState(false);
//     const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);


//     const fetchBookings = async () => {
//         if (!user || !token) {
//             setIsLoading(false);
//             return;
//         }
//         setIsLoading(true);
//         try {
//             const response = await fetch(`${API_URL}/api/bookings/${user.id}`, {
//                 headers: { 'Authorization': `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลการจองได้');
//             const data = await response.json();
//             setBookings(data);
//         } catch (error) {
//             Alert.alert('เกิดข้อผิดพลาด', error.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         const unsubscribe = navigation.addListener('focus', () => {
//             fetchBookings();
//         });
//         return unsubscribe;
//     }, [navigation, user, token]);

//     const getStatusStyle = (status) => {
//         switch (status) {
//             case 'Confirmed': return styles.statusConfirmed;
//             case 'Cancelled': return styles.statusCancelled;
//             case 'Completed': return styles.statusCompleted;
//             case 'Checked In': return styles.statusCheckedIn; // ✅ เพิ่มสถานะ
//             case 'Checked Out': return styles.statusCheckedOut; // ✅ เพิ่มสถานะ
//             default: return styles.statusPending;
//         }
//     };

//     const translateStatusToThai = (status) => {
//         switch (status) {
//             case 'Pending': return 'รอการยืนยัน';
//             case 'Confirmed': return 'ยืนยันแล้ว';
//             case 'Cancelled': return 'ยกเลิกแล้ว';
//             case 'Completed': return 'เสร็จสิ้น';
//             case 'Checked In': return 'เช็คอินแล้ว'; // ✅ เพิ่มสถานะ
//             case 'Checked Out': return 'เช็คเอาท์แล้ว'; // ✅ เพิ่มสถานะ
//             default: return status;
//         }
//     };
    
//     const openReviewModal = (booking) => {
//         setSelectedBooking(booking);
//         setRating(0);
//         setComment('');
//         setReviewModalVisible(true);
//     };

//     const openViewReviewModal = (booking) => {
//         setSelectedBooking(booking);
//         setViewReviewModalVisible(true);
//     };
//     const openConfirmationModal = (booking) => {
//         setSelectedBooking(booking);
//         setConfirmationModalVisible(true);
//     };
    

//     const handlePostReview = async () => {
//         if (rating === 0 || !comment.trim()) {
//             Alert.alert('ข้อมูลไม่ครบถ้วน', 'กรุณาให้คะแนนและเขียนความคิดเห็น');
//             return;
//         }
//         setIsSubmitting(true);
//         let response;
//         try {
//             const reviewData = {
//                 booking_id: selectedBooking.id,
//                 room_id: selectedBooking.room_id,
//                 rating: rating,
//                 comment: comment,
//             };
//             response = await fetch(`${API_URL}/api/reviews`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//                 body: JSON.stringify(reviewData),
//             });
//             if (!response.ok) {
//                 try {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
//                 } catch (jsonError) {
//                     throw new Error(`เซิร์ฟเวอร์มีปัญหา (Status: ${response.status})`);
//                 }
//             }
            
//             Alert.alert('สำเร็จ', 'ขอบคุณสำหรับรีวิวของคุณ!');
//             setReviewModalVisible(false);
//             fetchBookings();

//         } catch (error) {
//             console.error('Error submitting review:', error);
//             if (error instanceof SyntaxError && response) {
//                 const textResponse = await response.text();
//                 console.error("Server's non-JSON response:", textResponse);
//                 Alert.alert('เกิดข้อผิดพลาดจากเซิร์ฟเวอร์', 'เซิร์ฟเวอร์ส่งข้อมูลกลับมาในรูปแบบที่ไม่ถูกต้อง');
//             } else {
//                 Alert.alert('เกิดข้อผิดพลาด', error.message);
//             }
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const toggleOverlay = () => setOverlayVisible(!isOverlayVisible);
//     const handleLogout = () => {
//         Alert.alert('ยืนยันการออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่?', [
//             { text: 'ยกเลิก', style: 'cancel' },
//             { text: 'ยืนยัน', onPress: () => { logout(); toggleOverlay(); }},
//         ]);
//     };

//     const profilePicUrl = user?.profile_pic_url || 'https://placehold.co/100x100/81DFEF/FFFFFF?text=DP';
    
//     const iconSize = styles.iconText ? styles.iconText.fontSize : 24;
//     const activeIconColor = styles.iconText ? styles.iconText.color : '#81DFEF';
//     const inactiveIconColor = '#888';

//     if (!isUserLoggedIn) {
//         return (
//             <SafeAreaView style={styles.container}>
//                 <Text style={styles.infoText}>กรุณาเข้าสู่ระบบเพื่อดูประวัติการจอง</Text>
//                 <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
//                     <Text style={styles.loginButtonText}>ไปหน้าเข้าสู่ระบบ</Text>
//                 </TouchableOpacity>
//             </SafeAreaView>
//         );
//     }

//     if (isLoading) {
//         return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;
//     }
    
//     return (
//         <View style={{ flex: 1, backgroundColor: '#F5F5F7' }}>
//             <SafeAreaView style={{ flex: 1 }}>
//                 <Text style={styles.headerTitle}>การจองของฉัน</Text>
//                 <ScrollView contentContainerStyle={styles.scrollContainer}>
//                     {bookings.length > 0 ? bookings.map(booking => (
//                         <View key={booking.id} style={styles.card}>
//                             <Image source={{ uri: booking.room_image }} style={styles.roomImage} />
//                             <View style={styles.cardBody}>
//                                 <Text style={styles.roomName}>{booking.room_name}</Text>
//                                 <Text style={styles.dateText}>
//                                     เช็คอิน: {moment(booking.check_in_date).format('LL')}
//                                 </Text>
//                                 <Text style={styles.dateText}>
//                                     เช็คเอาท์: {moment(booking.check_out_date).format('LL')}
//                                 </Text>
//                                 <View style={[styles.statusBadge, getStatusStyle(booking.booking_status)]}>
//                                     <Text style={styles.statusText}>{translateStatusToThai(booking.booking_status)}</Text>
//                                 </View>
                                
//                                 {booking.booking_status === 'Confirmed' && booking.payment_status === 'Unpaid' && (
//                                     <TouchableOpacity 
//                                     style={styles.payButton}
//                                     onPress={() => navigation.navigate('Payment', { 
//                                         bookingId: booking.id, 
//                                         paymentDeadline: booking.payment_deadline,
//                                         roomDetails: { 
//                                             price: booking.room_price, 
//                                             name: booking.room_name 
//                                         },
//                                         // ✅ เพิ่ม 2 บรรทัดนี้เข้าไป
//                                         checkInDate: booking.check_in_date,
//                                         checkOutDate: booking.check_out_date
//                                     })}
//                                     >
//                                     <Text style={styles.payButtonText}>ชำระเงิน</Text>
//                                     </TouchableOpacity>
//                                 )}
//                                 {booking.booking_status === 'Confirmed' && booking.payment_status === 'Paid' && (
//                                     <TouchableOpacity 
//                                         style={styles.viewConfirmationButton} 
//                                         onPress={() => openConfirmationModal(booking)}
//                                     >
//                                         <Text style={styles.viewConfirmationButtonText}>ดูใบจองห้องพัก</Text>
//                                     </TouchableOpacity>
//                                 )}
                                
//                                 {booking.booking_status === 'Checked Out' && booking.is_reviewed === 0 && (
//                                     <TouchableOpacity style={styles.reviewButton} onPress={() => openReviewModal(booking)}>
//                                         <Text style={styles.reviewButtonText}>ให้คะแนนและรีวิว</Text>
//                                     </TouchableOpacity>
//                                 )}

//                                 {booking.booking_status === 'Checked Out' && booking.is_reviewed === 1 && (
//                                     <TouchableOpacity style={styles.viewReviewButton} onPress={() => openViewReviewModal(booking)}>
//                                         <Text style={styles.viewReviewButtonText}>ดูรีวิวของคุณ</Text>
//                                     </TouchableOpacity>
//                                 )}
//                             </View>
//                         </View>
//                     )) : (
//                         <Text style={styles.infoText}>คุณยังไม่มีรายการจอง</Text>
//                     )}
//                 </ScrollView>
//             </SafeAreaView>
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={isConfirmationModalVisible}
//                 onRequestClose={() => setConfirmationModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.confirmationCard}>
//                         <Ionicons name="checkmark-circle" size={60} color="#34C759" style={{ marginBottom: 15 }} />
//                         <Text style={styles.confirmationTitle}>ใบจองของคุณ</Text>
                        
//                         <View style={styles.confirmationDetails}>
//                             <Text style={styles.detailRow}><Text style={styles.detailLabel}>ชื่อผู้จอง:</Text> {user?.first_name} {user?.last_name}</Text>
//                             <Text style={styles.detailRow}><Text style={styles.detailLabel}>ห้องพัก:</Text> {selectedBooking?.room_name}</Text>
//                             <Text style={styles.detailRow}><Text style={styles.detailLabel}>เช็คอิน:</Text> {moment(selectedBooking?.check_in_date).format('LL')}</Text>
//                             <Text style={styles.detailRow}><Text style={styles.detailLabel}>เช็คเอาท์:</Text> {moment(selectedBooking?.check_out_date).format('LL')}</Text>
//                         </View>

//                         <View style={styles.warningBox}>
//                             <Ionicons name="warning" size={20} color="#D97706" />
//                             <Text style={styles.warningText}>กรุณาแคปหน้าจอหน้านี้ไว้เพื่อเป็นหลักฐานในวันเช็คอิน</Text>
//                         </View>

//                         <TouchableOpacity style={styles.meowButton} onPress={() => setConfirmationModalVisible(false)}>
//                             <Text style={styles.meowButtonText}>Meow!</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
            

//             {/* --- Bottom Menu --- */}
//             <View style={styles.bottomMenu}>
//                 <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
//                     <Ionicons name="home-sharp" size={iconSize} color="#81DFEF" />
//                     <Text style={styles.menuLabel}>หน้าหลัก</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.menuItem}>
//                     <Ionicons name="document-text-sharp" size={iconSize} color="#81DFEF" />
//                     <Text style={[styles.menuLabel, { color: activeIconColor }]}>การจอง</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Cats')}>
//                     <FontAwesome5 name="cat" size={iconSize} color="#81DFEF" />
//                     <Text style={styles.menuLabel}>แมว</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.menuItem} onPress={toggleOverlay}>
//                     <Ionicons name="menu-sharp" size={iconSize} color="#81DFEF" />
//                     <Text style={styles.menuLabel}>เพิ่มเติม</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* --- Overlay Modal --- */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={isOverlayVisible}
//                 onRequestClose={toggleOverlay}
//             >
//                 <View style={styles.overlayContainer}>
//                     <View style={styles.overlayContent}>
//                         <View style={styles.overlayHeader}>
//                             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                 <Ionicons name="menu-sharp" size={30} color="#81DFEF" />
//                                 <Text style={styles.overlayTitle}>เพิ่มเติม</Text>
//                             </View>
//                             <TouchableOpacity onPress={toggleOverlay} style={styles.closeButton}>
//                                 <Text style={styles.closeButtonText}>ปิด</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <Text style={styles.sectionTitle}>บัญชี</Text>
//                         <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => { navigation.navigate('Profile'); toggleOverlay(); }}>
//                             <View style={styles.overlayProfileItem}>
//                                 <Image source={{ uri: profilePicUrl }} style={styles.profileIcon} />
//                                 <Text style={styles.overlayMenuItemTextV2}>โปรไฟล์</Text>
//                             </View>
//                             <Ionicons name="chevron-forward-outline" size={24} color="#81DFEF" />
//                         </TouchableOpacity>
//                         <Text style={styles.sectionTitle}>นโยบายห้องพัก</Text>
//                         <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => { navigation.navigate('HotelPolicy'); toggleOverlay(); }}>
//                             <Text style={styles.overlayMenuItemTextV2}>สำหรับห้องพัก</Text>
//                             <Ionicons name="chevron-forward-outline" size={24} color="#81DFEF" />
//                         </TouchableOpacity>
//                         <Text style={styles.sectionTitle}>ติดต่อเรา</Text>
//                         <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => Linking.openURL('mailto:dulyawat.p@ku.th')}>
//                             <View style={styles.overlayProfileItem}>
//                                 <Ionicons name="mail-outline" size={24} color="#555" />
//                                 <Text style={styles.socialText}>dulyawat.p@ku.th</Text>
//                             </View>
//                             <Ionicons name="open-outline" size={24} color="#81DFEF" />
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => Linking.openURL('tel:061 935 7878')}>
//                             <View style={styles.overlayProfileItem}>
//                                 <Ionicons name="call-outline" size={24} color="#555" />
//                                 <Text style={styles.socialText}>061 935 7878</Text>
//                             </View>
//                             <Ionicons name="open-outline" size={24} color="#81DFEF" />
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={styles.overlayMenuItemV2}
//                             onPress={handleLogout}
//                         >
//                             <Text style={styles.overlayMenuItemTextV2}>ออกจากระบบ</Text>
//                             <Ionicons name="log-out-outline" size={24} color="#81DFEF" />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>

//             {/* --- Add/Edit Review Modal --- */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={isReviewModalVisible}
//                 onRequestClose={() => setReviewModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalView}>
//                         <Text style={styles.modalTitle}>ให้คะแนนและรีวิว</Text>
//                         <Text style={styles.modalRoomName}>{selectedBooking?.room_name}</Text>
                        
//                         <View style={styles.starContainer}>
//                             {[1, 2, 3, 4, 5].map((star) => (
//                                 <TouchableOpacity key={star} onPress={() => setRating(star)}>
//                                     <Ionicons 
//                                         name={star <= rating ? 'star' : 'star-outline'} 
//                                         size={40} 
//                                         color="#FFD700" 
//                                     />
//                                 </TouchableOpacity>
//                             ))}
//                         </View>

//                         <TextInput
//                             style={styles.commentInput}
//                             placeholder="เขียนความคิดเห็นของคุณ..."
//                             multiline
//                             value={comment}
//                             onChangeText={setComment}
//                         />

//                         <TouchableOpacity 
//                             style={[styles.submitButton, isSubmitting && { opacity: 0.5 }]} 
//                             onPress={handlePostReview} 
//                             disabled={isSubmitting}
//                         >
//                             {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>ส่งรีวิว</Text>}
//                         </TouchableOpacity>

//                         <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
//                             <Text style={styles.cancelText}>ยกเลิก</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>

//             {/* --- View Review Modal --- */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={isViewReviewModalVisible}
//                 onRequestClose={() => setViewReviewModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalView}>
//                         <Text style={styles.modalTitle}>รีวิวของคุณ</Text>
//                         <Text style={styles.modalRoomName}>{selectedBooking?.room_name}</Text>
                        
//                         <View style={styles.starContainer}>
//                             {[1, 2, 3, 4, 5].map((star) => (
//                                 <Ionicons 
//                                     key={star}
//                                     name={star <= selectedBooking?.user_rating ? 'star' : 'star-outline'} 
//                                     size={30} 
//                                     color="#FFD700" 
//                                 />
//                             ))}
//                         </View>

//                         <Text style={styles.commentText}>"{selectedBooking?.user_comment}"</Text>

//                         <TouchableOpacity 
//                             style={styles.closeReviewButton} 
//                             onPress={() => setViewReviewModalVisible(false)}
//                         >
//                            <Text style={styles.closeReviewButtonText}>ปิด</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// }

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert, Modal, TextInput, Platform, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/th';
import styles from '../Styles/BookingScreenStyles';
import { AuthContext } from './AuthContext';
import { API_URL } from '../../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

moment.locale('th');

export default function BookingScreen() {
    const navigation = useNavigation();
    const { user, token, isUserLoggedIn, logout } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // States for Modals
    const [isReviewModalVisible, setReviewModalVisible] = useState(false);
    const [isViewReviewModalVisible, setViewReviewModalVisible] = useState(false);
    const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [isCancelModalVisible, setCancelModalVisible] = useState(false);

    // States for Review Form
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // States for Cancellation Form
    const [cancellationReason, setCancellationReason] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

    const fetchBookings = async () => {
        if (!user || !token) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/bookings/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลการจองได้');
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            Alert.alert('เกิดข้อผิดพลาด', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchBookings);
        return unsubscribe;
    }, [navigation, user, token]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Confirmed': return styles.statusConfirmed;
            case 'Cancelled': return styles.statusCancelled;
            case 'Completed': return styles.statusCompleted;
            case 'Checked In': return styles.statusCheckedIn;
            case 'Checked Out': return styles.statusCheckedOut;
            case 'Refunded': return styles.statusRefunded; // เพิ่มสถานะเผื่อไว้
            default: return styles.statusPending;
        }
    };

    const translateStatusToThai = (status) => {
        switch (status) {
            case 'Pending': return 'รอการยืนยัน';
            case 'Confirmed': return 'ยืนยันแล้ว';
            case 'Cancelled': return 'ยกเลิกแล้ว';
            case 'Refunded': return 'คืนเงินแล้ว';
            case 'Completed': return 'เสร็จสิ้น';
            case 'Checked In': return 'เช็คอินแล้ว';
            case 'Checked Out': return 'เช็คเอาท์แล้ว';
            default: return status;
        }
    };
    
    // --- Modal Handlers ---
    const openReviewModal = (booking) => {
        setSelectedBooking(booking);
        setRating(0);
        setComment('');
        setReviewModalVisible(true);
    };

    const openViewReviewModal = (booking) => {
        setSelectedBooking(booking);
        setViewReviewModalVisible(true);
    };

    const openConfirmationModal = (booking) => {
        setSelectedBooking(booking);
        setConfirmationModalVisible(true);
    };
    
    const openCancelFormModal = (booking) => {
        setSelectedBooking(booking);
        setCancellationReason('');
        setBankName('');
        setAccountNumber('');
        setAccountName('');
        setCancelModalVisible(true);
    };
    
    // --- Action Handlers ---
    const handleCancelBooking = (booking) => {
        Alert.alert(
            'ยืนยันการยกเลิกการจอง',
            'หากยกเลิก ทางโรงแรมขอสงวนสิทธิ์ในการหักค่าธรรมเนียม 30% ของราคาค่าห้องพักที่คุณได้ชำระไว้ คุณยืนยันที่จะดำเนินการต่อหรือไม่?',
            [
                { text: 'ไม่', style: 'cancel' },
                { text: 'ยืนยัน', style: 'destructive', onPress: () => openCancelFormModal(booking) }
            ]
        );
    };

    const submitCancellation = async () => {
        if (!cancellationReason.trim() || !bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
            Alert.alert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลให้ครบทุกช่อง');
            return;
        }
        setIsCancelling(true);
        try {
            const response = await fetch(`${API_URL}/api/bookings/${selectedBooking.id}/cancel`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    cancellation_reason: cancellationReason,
                    refund_bank_name: bankName,
                    refund_account_number: accountNumber,
                    refund_account_name: accountName,
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'เกิดข้อผิดพลาดในการยกเลิก');
            
            Alert.alert('สำเร็จ', 'ส่งคำขอยกเลิกการจองเรียบร้อยแล้ว');
            setCancelModalVisible(false);
            fetchBookings();
        } catch (error) {
            Alert.alert('เกิดข้อผิดพลาด', error.message);
        } finally {
            setIsCancelling(false);
        }
    };

    const handlePostReview = async () => {
        if (rating === 0 || !comment.trim()) {
            Alert.alert('ข้อมูลไม่ครบถ้วน', 'กรุณาให้คะแนนและเขียนความคิดเห็น');
            return;
        }
        setIsSubmitting(true);
        try {
            const reviewData = {
                booking_id: selectedBooking.id,
                room_id: selectedBooking.room_id,
                rating: rating,
                comment: comment,
            };
            const response = await fetch(`${API_URL}/api/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(reviewData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
            }
            Alert.alert('สำเร็จ', 'ขอบคุณสำหรับรีวิวของคุณ!');
            setReviewModalVisible(false);
            fetchBookings();
        } catch (error) {
            Alert.alert('เกิดข้อผิดพลาด', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleOverlay = () => setOverlayVisible(!isOverlayVisible);
    const handleLogout = () => {
        Alert.alert('ยืนยันการออกจากระบบ', 'คุณต้องการออกจากระบบหรือไม่?', [
            { text: 'ยกเลิก', style: 'cancel' },
            { text: 'ยืนยัน', onPress: () => { logout(); toggleOverlay(); }},
        ]);
    };

    const profilePicUrl = user?.profile_pic_url || 'https://placehold.co/100x100/81DFEF/FFFFFF?text=DP';
    const iconSize = 24;
    const activeIconColor = '#81DFEF';
    const inactiveIconColor = '#888';

    if (!isUserLoggedIn) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.infoText}>กรุณาเข้าสู่ระบบเพื่อดูประวัติการจอง</Text>
                <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginButtonText}>ไปหน้าเข้าสู่ระบบ</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    if (isLoading) {
        return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" />;
    }
    
    return (
        <View style={{ flex: 1, backgroundColor: '#F5F5F7' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>การจองของฉัน</Text>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {bookings.length > 0 ? bookings.map(booking => (
                        <View key={booking.id} style={styles.card}>
                            <Image source={{ uri: booking.room_image }} style={styles.roomImage} />
                            <View style={styles.cardBody}>
                                <Text style={styles.roomName}>{booking.room_name}</Text>
                                <Text style={styles.dateText}>เช็คอิน: {moment(booking.check_in_date).format('LL')}</Text>
                                <Text style={styles.dateText}>เช็คเอาท์: {moment(booking.check_out_date).format('LL')}</Text>
                                <View style={[styles.statusBadge, getStatusStyle(booking.booking_status)]}>
                                    <Text style={styles.statusText}>{translateStatusToThai(booking.booking_status)}</Text>
                                </View>
                                
                                {booking.booking_status === 'Confirmed' && booking.payment_status === 'Unpaid' && (
                                    <TouchableOpacity 
                                        style={styles.payButton}
                                        onPress={() => navigation.navigate('Payment', { 
                                            bookingId: booking.id, 
                                            paymentDeadline: booking.payment_deadline,
                                            roomDetails: { price: booking.room_price, name: booking.room_name },
                                            checkInDate: booking.check_in_date,
                                            checkOutDate: booking.check_out_date
                                        })}
                                    >
                                        <Text style={styles.payButtonText}>ชำระเงิน</Text>
                                    </TouchableOpacity>
                                )}
                                
                                {(booking.booking_status === 'Pending' || (booking.booking_status === 'Confirmed' && booking.payment_status === 'Paid')) && (
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelBooking(booking)}>
                                        <Text style={styles.cancelButtonText}>ยกเลิกการจอง</Text>
                                    </TouchableOpacity>
                                )}
                                
                                {booking.booking_status === 'Confirmed' && booking.payment_status === 'Paid' && (
                                    <TouchableOpacity style={styles.viewBookingButton} onPress={() => openConfirmationModal(booking)}>
                                        <Text style={styles.viewBookingButtonText}>ดูใบจองห้องพัก</Text>
                                    </TouchableOpacity>
                                )}
                                
                                {booking.booking_status === 'Checked Out' && booking.is_reviewed === 0 && (
                                    <TouchableOpacity style={styles.reviewButton} onPress={() => openReviewModal(booking)}>
                                        <Text style={styles.reviewButtonText}>ให้คะแนนและรีวิว</Text>
                                    </TouchableOpacity>
                                )}
                                {booking.booking_status === 'Checked Out' && booking.is_reviewed === 1 && (
                                    <TouchableOpacity style={styles.viewReviewButton} onPress={() => openViewReviewModal(booking)}>
                                        <Text style={styles.viewReviewButtonText}>ดูรีวิวของคุณ</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )) : (
                        <View style={styles.emptyContainer}>
                             <Text style={styles.infoText}>คุณยังไม่มีรายการจอง</Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isConfirmationModalVisible}
                onRequestClose={() => setConfirmationModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.confirmationCard}>
                        <Ionicons name="checkmark-circle" size={60} color="#34C759" style={{ marginBottom: 15 }} />
                        <Text style={styles.confirmationTitle}>ใบจองของคุณ</Text>
                        
                        <View style={styles.confirmationDetails}>
                            <Text style={styles.detailRow}><Text style={styles.detailLabel}>ชื่อผู้จอง:</Text> {user?.first_name} {user?.last_name}</Text>
                            <Text style={styles.detailRow}><Text style={styles.detailLabel}>ห้องพัก:</Text> {selectedBooking?.room_name}</Text>
                            <Text style={styles.detailRow}><Text style={styles.detailLabel}>เช็คอิน:</Text> {moment(selectedBooking?.check_in_date).format('LL')}</Text>
                            <Text style={styles.detailRow}><Text style={styles.detailLabel}>เช็คเอาท์:</Text> {moment(selectedBooking?.check_out_date).format('LL')}</Text>
                        </View>

                        <View style={styles.warningBox}>
                            <Ionicons name="warning" size={20} color="#D97706" />
                            <Text style={styles.warningText}>กรุณาแคปหน้าจอหน้านี้ไว้เพื่อเป็นหลักฐานในวันเช็คอิน</Text>
                        </View>

                        <TouchableOpacity style={styles.meowButton} onPress={() => setConfirmationModalVisible(false)}>
                            <Text style={styles.meowButtonText}>Meow!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isReviewModalVisible}
                onRequestClose={() => setReviewModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>ให้คะแนนและรีวิว</Text>
                        <Text style={styles.modalRoomName}>{selectedBooking?.room_name}</Text>
                        
                        <View style={styles.starContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <Ionicons 
                                        name={star <= rating ? 'star' : 'star-outline'} 
                                        size={40} 
                                        color="#FFD700" 
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={styles.commentInput}
                            placeholder="เขียนความคิดเห็นของคุณ..."
                            multiline
                            value={comment}
                            onChangeText={setComment}
                        />

                        <TouchableOpacity 
                            style={[styles.submitButton, isSubmitting && { opacity: 0.5 }]} 
                            onPress={handlePostReview} 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>ส่งรีวิว</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                            <Text style={styles.cancelText}>ยกเลิก</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isViewReviewModalVisible}
                onRequestClose={() => setViewReviewModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>รีวิวของคุณ</Text>
                        <Text style={styles.modalRoomName}>{selectedBooking?.room_name}</Text>
                        
                        <View style={styles.starContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons 
                                    key={star}
                                    name={star <= selectedBooking?.user_rating ? 'star' : 'star-outline'} 
                                    size={30} 
                                    color="#FFD700" 
                                />
                            ))}
                        </View>

                        <Text style={styles.commentText}>"{selectedBooking?.user_comment}"</Text>

                        <TouchableOpacity 
                            style={styles.closeReviewButton} 
                            onPress={() => setViewReviewModalVisible(false)}
                        >
                           <Text style={styles.closeReviewButtonText}>ปิด</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isCancelModalVisible}
                onRequestClose={() => setCancelModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>ข้อมูลการยกเลิก</Text>
                        <Text style={styles.inputLabel}>เหตุผลที่ยกเลิก</Text>
                        <TextInput style={styles.textInput} placeholder="โปรดระบุเหตุผล..." value={cancellationReason} onChangeText={setCancellationReason} />
                        <Text style={styles.inputLabel}>ข้อมูลสำหรับรับเงินคืน</Text>
                        <TextInput style={styles.textInput} placeholder="ธนาคาร" value={bankName} onChangeText={setBankName}/>
                        <TextInput style={styles.textInput} placeholder="เลขบัญชีธนาคาร" keyboardType="numeric" value={accountNumber} onChangeText={setAccountNumber}/>
                        <TextInput style={styles.textInput} placeholder="ชื่อบัญชี" value={accountName} onChangeText={setAccountName}/>
                        <TouchableOpacity style={[styles.submitButton, {backgroundColor: '#ff0000ff'}, isCancelling && {opacity: 0.5}]} onPress={submitCancellation} disabled={isCancelling}>
                            {isCancelling ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>ยืนยันการยกเลิก</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCancelModalVisible(false)}>
                            <Text style={styles.cancelText}>ปิด</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
            {/* ... Other Modals ... */}

            
            {/* --- Bottom Menu --- */}
            <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home')}>
                    <Ionicons name="home-sharp" size={iconSize} color="#81DFEF" />
                    <Text style={styles.menuLabel}>หน้าหลัก</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="document-text-sharp" size={iconSize} color="#81DFEF" />
                    <Text style={[styles.menuLabel]}>การจอง</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Cats')}>
                    <FontAwesome5 name="cat" size={iconSize} color="#81DFEF" />
                    <Text style={styles.menuLabel}>แมว</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={toggleOverlay}>
                    <Ionicons name="menu-sharp" size={iconSize} color="#81DFEF" />
                    <Text style={styles.menuLabel}>เพิ่มเติม</Text>
                </TouchableOpacity>
            </View>

            {/* --- Overlay Modal --- */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isOverlayVisible}
                onRequestClose={toggleOverlay}
            >
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
                        <Text style={styles.sectionTitle}>บัญชี</Text>
                        <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => { navigation.navigate('Profile'); toggleOverlay(); }}>
                            <View style={styles.overlayProfileItem}>
                                <Image source={{ uri: profilePicUrl }} style={styles.profileIcon} />
                                <Text style={styles.overlayMenuItemTextV2}>โปรไฟล์</Text>
                            </View>
                            <Ionicons name="chevron-forward-outline" size={24} color="#81DFEF" />
                        </TouchableOpacity>
                        <Text style={styles.sectionTitle}>นโยบายห้องพัก</Text>
                        <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => { navigation.navigate('HotelPolicy'); toggleOverlay(); }}>
                            <Text style={styles.overlayMenuItemTextV2}>สำหรับห้องพัก</Text>
                            <Ionicons name="chevron-forward-outline" size={24} color="#81DFEF" />
                        </TouchableOpacity>
                        <Text style={styles.sectionTitle}>ติดต่อเรา</Text>
                        <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => Linking.openURL('mailto:dulyawat.p@ku.th')}>
                            <View style={styles.overlayProfileItem}>
                                <Ionicons name="mail-outline" size={24} color="#555" />
                                <Text style={styles.socialText}>dulyawat.p@ku.th</Text>
                            </View>
                            <Ionicons name="open-outline" size={24} color="#81DFEF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => Linking.openURL('tel:061 935 7878')}>
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
                    </View>
                </View>
            </Modal>
        </View>
    );
}