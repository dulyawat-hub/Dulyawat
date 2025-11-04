// import React, { useState, useEffect, useContext } from 'react';
// // ✅ 1. เพิ่ม TextInput, Modal, และ ScrollView เข้ามาใน import
// import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator, Linking, TextInput, Modal, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../screens/AuthContext';
// import { API_URL } from '../../config';
// import moment from 'moment';
// import 'moment/locale/th';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// moment.locale('th');

// const showAlert = (title, msg, buttons = []) => {
//     if (Platform.OS === 'web') {
//         if (buttons.length > 0 && buttons.find(b => b.style === 'cancel')) {
//             if (window.confirm(`${title}\n\n${msg}`)) {
//                 const confirmButton = buttons.find(b => b.style !== 'cancel');
//                 if (confirmButton && confirmButton.onPress) confirmButton.onPress();
//             } else {
//                 const cancelButton = buttons.find(b => b.style === 'cancel');
//                 if (cancelButton && cancelButton.onPress) cancelButton.onPress();
//             }
//         } else if (buttons.length > 0 && buttons[0].onPress) {
//             window.alert(`${title}\n\n${msg}`);
//             buttons[0].onPress();
//         } else {
//             window.alert(`${title}\n\n${msg}`);
//         }
//     } else {
//         Alert.alert(title, msg, buttons);
//     }
// };

// export default function AdminBookingListScreen() {
//     const navigation = useNavigation();
//     const { token } = useContext(AuthContext);
//     const [bookings, setBookings] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);

//     // ✅ 2. เพิ่ม State สำหรับการค้นหาและฟิลเตอร์
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filteredBookings, setFilteredBookings] = useState([]);
//     const [selectedMonth, setSelectedMonth] = useState(null);
//     const [selectedYear, setSelectedYear] = useState(null);
//     const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
//     const [isYearPickerVisible, setYearPickerVisible] = useState(false);

//     const fetchBookings = async () => {
//         setIsLoading(true);
//         try {
//             const res = await fetch(`${API_URL}/api/admin/bookings`, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             if (!res.ok) throw new Error('Failed to fetch bookings');
//             const data = await res.json();
//             setBookings(data);
//             setFilteredBookings(data); // ตั้งค่าข้อมูลเริ่มต้น
//         } catch (error) {
//             showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลการจองได้');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         const unsubscribe = navigation.addListener('focus', fetchBookings);
//         return unsubscribe;
//     }, [navigation, token]);

//     // ✅ 3. เพิ่ม useEffect สำหรับกรองข้อมูล
//     useEffect(() => {
//         const filtered = bookings.filter(item => {
//             const customerName = `${item.first_name} ${item.last_name}`.toLowerCase();
//             // ใช้ check_in_date ในการกรองเดือน/ปี
//             const checkInDate = moment(item.check_in_date);

//             const nameMatch = customerName.includes(searchQuery.toLowerCase());
//             const monthMatch = selectedMonth ? (checkInDate.month() + 1) === selectedMonth : true;
//             const yearMatch = selectedYear ? checkInDate.year() === selectedYear : true;

//             return nameMatch && monthMatch && yearMatch;
//         });
//         setFilteredBookings(filtered);
//     }, [searchQuery, bookings, selectedMonth, selectedYear]);


//     const handleUpdateStatus = (bookingId, status) => {
//         showAlert( 'ยืนยันการดำเนินการ', `คุณต้องการเปลี่ยนสถานะการจอง #${bookingId} เป็น "${status}" ใช่หรือไม่?`,
//             [
//                 { text: 'ยกเลิก', style: 'cancel' },
//                 {
//                     text: 'ยืนยัน',
//                     onPress: async () => {
//                         try {
//                             const res = await fetch(`${API_URL}/api/admin/bookings/${bookingId}`, {
//                                 method: 'PUT',
//                                 headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//                                 body: JSON.stringify({ status: status })
//                             });
//                             if (!res.ok) throw new Error('Failed to update status');
//                             showAlert('สำเร็จ', `อัปเดตสถานะการจอง #${bookingId} เรียบร้อยแล้ว`);
//                             fetchBookings();
//                         } catch (error) {
//                             showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตสถานะได้');
//                         }
//                     }
//                 }
//             ]
//         );
//     };

//     const renderBookingCard = ({ item }) => {
//         const SlipButton = () => {
//             if (item.payment_status !== 'Paid' || !item.payment_slip_url) {
//                 return null;
//             }
//             const buttonContent = (
//                 <View style={styles.slipButton}>
//                     <Text style={styles.slipButtonText}>ดูหลักฐานการชำระเงิน</Text>
//                 </View>
//             );
//             if (Platform.OS === 'web') {
//                 return (
//                     <a href={item.payment_slip_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
//                         {buttonContent}
//                     </a>
//                 );
//             } else {
//                 return (
//                     <TouchableOpacity onPress={() => Linking.openURL(item.payment_slip_url)}>
//                         {buttonContent}
//                     </TouchableOpacity>
//                 );
//             }
//         };

//         // ✅ คำนวณราคารวม
//         const nights = moment(item.check_out_date).diff(moment(item.check_in_date), 'days');
//         const totalPrice = nights > 0 ? nights * item.room_price : item.room_price;

//         return (
//             <View style={styles.card}>
//                 <View style={styles.cardContent}>
//                     <Text style={styles.cardTitle}>{item.room_name}</Text>
//                     <Text style={styles.cardSubtitle}>ลูกค้า: {item.first_name} {item.last_name}</Text>
//                     <Text style={styles.cardText}>เช็คอิน: {moment(item.check_in_date).format('LL')}</Text>
//                     <Text style={styles.cardText}>เช็คเอาท์: {moment(item.check_out_date).format('LL')}</Text>
//                     {/* ✅ แสดงราคารวม */}
//                     <Text style={styles.priceText}>ราคาเต็มห้องพัก: ฿{totalPrice.toLocaleString('th-TH')}</Text>
//                     <Text style={styles.priceTextt}>ค่ามัดจําห้อง 50%: ฿{(totalPrice * 0.5).toLocaleString('th-TH')}</Text>
//                 </View>

//                 <View style={styles.cardFooter}>
//                     <View style={styles.statusInfo}>
//                         <Text style={styles.statusLabel}>สถานะ: <Text style={styles.statusValue}>{item.booking_status}</Text></Text>
//                         <Text style={styles.statusLabel}>การชำระเงิน: <Text style={styles.statusValue}>{item.payment_status}</Text></Text>
//                     </View>
//                     <View style={styles.actionContainer}>
//                         {item.booking_status === 'Pending' && (
//                             <>
//                                 <TouchableOpacity style={[styles.actionButton, styles.confirmButton]} onPress={() => handleUpdateStatus(item.id, 'Confirmed')}>
//                                     <Text style={styles.actionButtonText}>ยืนยัน</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => handleUpdateStatus(item.id, 'Cancelled')}>
//                                     <Text style={styles.actionButtonText}>ยกเลิก</Text>
//                                 </TouchableOpacity>
//                             </>
//                         )}
//                         {item.booking_status === 'Confirmed' && item.payment_status === 'Paid' && (
//                              <TouchableOpacity style={[styles.actionButton, styles.checkInButton]} onPress={() => handleUpdateStatus(item.id, 'Checked In')}>
//                                 <Text style={styles.actionButtonText}>เช็คอิน</Text>
//                             </TouchableOpacity>
//                         )}
//                          {item.booking_status === 'Checked In' && (
//                              <TouchableOpacity style={[styles.actionButton, styles.checkOutButton]} onPress={() => handleUpdateStatus(item.id, 'Checked Out')}>
//                                 <Text style={styles.actionButtonText}>เช็คเอาท์</Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                 </View>
                
//                 <SlipButton />
//             </View>
//         );
//     };

//     const availableYears = [...new Set(bookings.map(item => moment(item.check_in_date).year()))].sort((a, b) => b - a);
//     const months = [
//         { label: 'มกราคม', value: 1 }, { label: 'กุมภาพันธ์', value: 2 }, { label: 'มีนาคม', value: 3 },
//         { label: 'เมษายน', value: 4 }, { label: 'พฤษภาคม', value: 5 }, { label: 'มิถุนายน', value: 6 },
//         { label: 'กรกฎาคม', value: 7 }, { label: 'สิงหาคม', value: 8 }, { label: 'กันยายน', value: 9 },
//         { label: 'ตุลาคม', value: 10 }, { label: 'พฤศจิกายน', value: 11 }, { label: 'ธันวาคม', value: 12 },
//     ];


//     return (
//         <SafeAreaView style={styles.container}>
//             <FlatList
//                 data={filteredBookings} 
//                 renderItem={renderBookingCard}
//                 keyExtractor={(item) => item.id.toString()}
//                 ListHeaderComponent={
//                     <>
//                         <Text style={styles.title}>คำร้องขอการจองห้องพัก</Text>
//                         <View style={styles.searchContainer}>
//                             <TextInput
//                                 style={styles.searchInput}
//                                 placeholder="ค้นหาชื่อลูกค้า..."
//                                 value={searchQuery}
//                                 onChangeText={setSearchQuery}
//                             />
//                             <View style={styles.filterRow}>
//                                 <TouchableOpacity style={styles.pickerButton} onPress={() => setMonthPickerVisible(true)}>
//                                     <Text style={styles.pickerButtonText}>{selectedMonth ? months.find(m => m.value === selectedMonth).label : 'ทุกเดือน'}</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity style={styles.pickerButton} onPress={() => setYearPickerVisible(true)}>
//                                     <Text style={styles.pickerButtonText}>{selectedYear ? (selectedYear + 543) : 'ทุกปี'}</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </>
//                 }
//                 ListEmptyComponent={
//                     <View style={styles.emptyContainer}>
//                         {isLoading ? <ActivityIndicator size="large" /> : <Text style={styles.emptyText}>ไม่พบข้อมูล</Text>}
//                     </View>
//                 }
//                 refreshing={isLoading}
//                 onRefresh={fetchBookings}
//             />
//             <TouchableOpacity style={styles.refreshButton} onPress={fetchBookings}>
//                 <Ionicons name="refresh" size={24} color="#333" />
//             </TouchableOpacity>

//             <Modal transparent={true} visible={isMonthPickerVisible} onRequestClose={() => setMonthPickerVisible(false)}>
//                 <TouchableOpacity style={styles.modalOverlay} onPress={() => setMonthPickerVisible(false)}>
//                     <View style={styles.modalContent}>
//                         <ScrollView>
//                             <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedMonth(null); setMonthPickerVisible(false); }}>
//                                 <Text style={styles.modalItemText}>ทุกเดือน</Text>
//                             </TouchableOpacity>
//                             {months.map((month) => (
//                                 <TouchableOpacity key={month.value} style={styles.modalItem} onPress={() => { setSelectedMonth(month.value); setMonthPickerVisible(false); }}>
//                                     <Text style={styles.modalItemText}>{month.label}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </ScrollView>
//                     </View>
//                 </TouchableOpacity>
//             </Modal>

//             <Modal transparent={true} visible={isYearPickerVisible} onRequestClose={() => setYearPickerVisible(false)}>
//                 <TouchableOpacity style={styles.modalOverlay} onPress={() => setYearPickerVisible(false)}>
//                     <View style={styles.modalContent}>
//                         <ScrollView>
//                             <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedYear(null); setYearPickerVisible(false); }}>
//                                 <Text style={styles.modalItemText}>ทุกปี</Text>
//                             </TouchableOpacity>
//                             {availableYears.map((year) => (
//                                 <TouchableOpacity key={year} style={styles.modalItem} onPress={() => { setSelectedYear(year); setYearPickerVisible(false); }}>
//                                     <Text style={styles.modalItemText}>{year + 543}</Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </ScrollView>
//                     </View>
//                 </TouchableOpacity>
//             </Modal>

//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#F5F5F7' },
//     title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
//     searchContainer: {
//         paddingHorizontal: 15,
//         marginBottom: 15,
//     },
//     searchInput: {
//         backgroundColor: '#fff',
//         paddingHorizontal: 15,
//         paddingVertical: 10,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         fontSize: 16,
//     },
//     filterRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 10,
//     },
//     pickerButton: {
//         flex: 1,
//         backgroundColor: '#fff',
//         paddingVertical: 10,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         alignItems: 'center',
//         marginHorizontal: 5,
//     },
//     pickerButtonText: {
//         fontSize: 14,
//     },
//     card: { 
//         backgroundColor: 'white', 
//         borderRadius: 10, 
//         padding: 15, 
//         marginHorizontal: 15, 
//         marginBottom: 15, 
//         elevation: 3, 
//         shadowColor: '#000', 
//         shadowOffset: { width: 0, height: 1 }, 
//         shadowOpacity: 0.2, 
//         shadowRadius: 2 
//     },
//     cardContent: { marginBottom: 10 },
//     cardTitle: { fontSize: 18, fontWeight: 'bold' },
//     cardSubtitle: { fontSize: 16, color: '#555', marginTop: 5 },
//     cardText: { fontSize: 14, color: '#333', marginTop: 10 },
//     priceText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#007AFF',
//         marginTop: 10,
//     },
//     priceTextt: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#ff0000ff',
//         marginTop: 10,
//     },
//     cardFooter: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingTop: 10,
//         borderTopWidth: 1,
//         borderTopColor: '#eee',
//     },
//     statusInfo: { flex: 1 },
//     statusLabel: { fontSize: 14, color: '#666' },
//     statusValue: { fontWeight: 'bold', color: '#000' },
//     slipButton: {
//         backgroundColor: '#E5E5EA',
//         padding: 10,
//         borderRadius: 5,
//         marginTop: 15,
//         alignItems: 'center',
//     },
//     slipButtonText: { color: '#007AFF', fontWeight: 'bold' },
//     actionContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
//     actionButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5, marginLeft: 10 },
//     actionButtonText: { color: 'white', fontWeight: 'bold' },
//     confirmButton: { backgroundColor: '#34C759' },
//     cancelButton: { backgroundColor: '#FF3B30' },
//     checkInButton: { backgroundColor: '#007AFF' },
//     checkOutButton: { backgroundColor: '#8E8E93' },
//     emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
//     emptyText: { fontSize: 16, color: '#888' },
//     refreshButton: {
//         position: 'absolute',
//         bottom: 30,
//         right: 20,
//         zIndex: 10,
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         padding: 10,
//         borderRadius: 25,
//         elevation: 5,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 3,
//     },
//     modalOverlay: { 
//         flex: 1, 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         backgroundColor: 'rgba(0,0,0,0.5)' 
//     },
//     modalContent: { 
//         backgroundColor: 'white', 
//         borderRadius: 10, 
//         paddingVertical: 10,
//         width: 'auto',
//         minWidth: 250,
//         maxWidth: '80%',
//         maxHeight: '60%',
//         overflow: 'hidden',
//     },
//     modalItem: { 
//         padding: 15, 
//         borderBottomWidth: 1, 
//         borderBottomColor: '#eee' 
//     },
//     modalItemText: { 
//         textAlign: 'center', 
//         fontSize: 16 
//     },
// });

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator, Linking, TextInput, Modal, ScrollView } from 'react-native';
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
        } else if (buttons.length > 0 && buttons[0].onPress) {
            window.alert(`${title}\n\n${msg}`);
            buttons[0].onPress();
        } else {
            window.alert(`${title}\n\n${msg}`);
        }
    } else {
        Alert.alert(title, msg, buttons);
    }
};

export default function AdminBookingListScreen() {
    const navigation = useNavigation();
    const { token } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
    const [isYearPickerVisible, setYearPickerVisible] = useState(false);
    const [isCancelDetailModalVisible, setCancelDetailModalVisible] = useState(false);
    const [selectedCancelledBooking, setSelectedCancelledBooking] = useState(null);
    const [isConfirmingRefund, setIsConfirmingRefund] = useState(false);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch bookings');
            const data = await res.json();
            setBookings(data);
            setFilteredBookings(data);
        } catch (error) {
            showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลการจองได้');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchBookings);
        return unsubscribe;
    }, [navigation, token]);

    useEffect(() => {
        const filtered = bookings.filter(item => {
            const customerName = `${item.first_name} ${item.last_name}`.toLowerCase();
            const checkInDate = moment(item.check_in_date);
            const nameMatch = customerName.includes(searchQuery.toLowerCase());
            const monthMatch = selectedMonth ? (checkInDate.month() + 1) === selectedMonth : true;
            const yearMatch = selectedYear ? checkInDate.year() === selectedYear : true;
            return nameMatch && monthMatch && yearMatch;
        });
        setFilteredBookings(filtered);
    }, [searchQuery, bookings, selectedMonth, selectedYear]);

    const openCancelDetailModal = (booking) => {
        // ✅ เพิ่มบรรทัดนี้เข้าไปเพื่อพิมพ์ข้อมูลดิบของ booking ที่ได้รับมา
        console.log("--- DEBUG: ข้อมูลใน selectedCancelledBooking ---", JSON.stringify(booking, null, 2));

        setSelectedCancelledBooking(booking);
        setCancelDetailModalVisible(true);
    
    };
    
    const handleConfirmRefund = (bookingId) => {
        showAlert('ยืนยันการคืนเงิน', `คุณต้องการยืนยันว่าได้ดำเนินการคืนเงินสำหรับ Booking #${bookingId} แล้วใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้`, [
            { text: 'ยกเลิก', style: 'cancel' },
            {
                text: 'ยืนยัน',
                onPress: async () => {
                    setIsConfirmingRefund(true);
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 15000);

                    try {
                        const res = await fetch(`${API_URL}/api/admin/bookings/${bookingId}/refund`, {
                            method: 'PATCH',
                            headers: { 
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            signal: controller.signal
                        });
                        
                        clearTimeout(timeoutId);

                        const result = await res.json(); 

                        if (!res.ok) {
                            throw new Error(result.message || 'ไม่สามารถยืนยันการคืนเงินได้');
                        }
                        
                        showAlert('สำเร็จ', 'ยืนยันการคืนเงินเรียบร้อยแล้ว');
                        setCancelDetailModalVisible(false);
                        fetchBookings();

                    } catch (error) {
                        clearTimeout(timeoutId);
                        if (error.name === 'AbortError') {
                            showAlert('เกิดข้อผิดพลาด', 'เซิร์ฟเวอร์ไม่ตอบสนอง โปรดลองใหม่อีกครั้ง');
                        } else {
                            showAlert('เกิดข้อผิดพลาด', error.message);
                        }
                    } finally {
                        setIsConfirmingRefund(false);
                    }
                }
            }
        ]);
    };

    const handleUpdateStatus = (bookingId, status) => {
        showAlert( 'ยืนยันการดำเนินการ', `คุณต้องการเปลี่ยนสถานะการจอง #${bookingId} เป็น "${status}" ใช่หรือไม่?`,
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'ยืนยัน',
                    onPress: async () => {
                        try {
                            const res = await fetch(`${API_URL}/api/admin/bookings/${bookingId}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                body: JSON.stringify({ status: status })
                            });
                            if (!res.ok) throw new Error('Failed to update status');
                            showAlert('สำเร็จ', `อัปเดตสถานะการจอง #${bookingId} เรียบร้อยแล้ว`);
                            fetchBookings();
                        } catch (error) {
                            showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถอัปเดตสถานะได้');
                        }
                    }
                }
            ]
        );
    };

    const renderBookingCard = ({ item }) => {
        const SlipButton = () => {
            if (item.payment_status !== 'Paid' || !item.payment_slip_url) return null;
            const buttonContent = (
                <View style={styles.slipButton}><Text style={styles.slipButtonText}>ดูหลักฐานการชำระเงิน</Text></View>
            );
            return Platform.OS === 'web' ? (
                <a href={item.payment_slip_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{buttonContent}</a>
            ) : (
                <TouchableOpacity onPress={() => Linking.openURL(item.payment_slip_url)}>{buttonContent}</TouchableOpacity>
            );
        };

        const nights = moment(item.check_out_date).diff(moment(item.check_in_date), 'days');
        const totalPrice = nights > 0 ? nights * item.room_price : item.room_price;

        return (
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.room_name}</Text>
                    <Text style={styles.cardSubtitle}>ลูกค้า: {item.first_name} {item.last_name}</Text>
                    <Text style={styles.cardText}>เช็คอิน: {moment(item.check_in_date).format('LL')}</Text>
                    <Text style={styles.cardText}>เช็คเอาท์: {moment(item.check_out_date).format('LL')}</Text>
                    <Text style={styles.priceText}>ราคาเต็มห้องพัก: ฿{totalPrice.toLocaleString('th-TH')}</Text>
                    <Text style={styles.priceTextt}>ค่ามัดจําห้อง 50%: ฿{(totalPrice * 0.5).toLocaleString('th-TH')}</Text>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.statusInfo}>
                        <Text style={styles.statusLabel}>สถานะ: <Text style={styles.statusValue}>{item.booking_status}</Text></Text>
                        <Text style={styles.statusLabel}>การชำระเงิน: <Text style={styles.statusValue}>{item.payment_status}</Text></Text>
                    </View>
                    <View style={styles.actionContainer}>
                        {item.booking_status === 'Pending' && (
                            <>
                                <TouchableOpacity style={[styles.actionButton, styles.confirmButton]} onPress={() => handleUpdateStatus(item.id, 'Confirmed')}><Text style={styles.actionButtonText}>ยืนยัน</Text></TouchableOpacity>
                                <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => handleUpdateStatus(item.id, 'Cancelled')}><Text style={styles.actionButtonText}>ยกเลิก</Text></TouchableOpacity>
                            </>
                        )}
                        {item.booking_status === 'Confirmed' && item.payment_status === 'Paid' && (
                             <TouchableOpacity style={[styles.actionButton, styles.checkInButton]} onPress={() => handleUpdateStatus(item.id, 'Checked In')}><Text style={styles.actionButtonText}>เช็คอิน</Text></TouchableOpacity>
                        )}
                         {item.booking_status === 'Checked In' && (
                             <TouchableOpacity style={[styles.actionButton, styles.checkOutButton]} onPress={() => handleUpdateStatus(item.id, 'Checked Out')}><Text style={styles.actionButtonText}>เช็คเอาท์</Text></TouchableOpacity>
                        )}
                        {item.booking_status === 'Cancelled' && (
                             <TouchableOpacity style={[styles.actionButton, styles.detailsButton]} onPress={() => openCancelDetailModal(item)}><Text style={styles.actionButtonText}>ดูรายละเอียด</Text></TouchableOpacity>
                        )}
                    </View>
                </View>
                <SlipButton />
            </View>
        );
    };

    const availableYears = [...new Set(bookings.map(item => moment(item.check_in_date).year()))].sort((a, b) => b - a);
    const months = [ { label: 'มกราคม', value: 1 }, { label: 'กุมภาพันธ์', value: 2 }, { label: 'มีนาคม', value: 3 }, { label: 'เมษายน', value: 4 }, { label: 'พฤษภาคม', value: 5 }, { label: 'มิถุนายน', value: 6 }, { label: 'กรกฎาคม', value: 7 }, { label: 'สิงหาคม', value: 8 }, { label: 'กันยายน', value: 9 }, { label: 'ตุลาคม', value: 10 }, { label: 'พฤศจิกายน', value: 11 }, { label: 'ธันวาคม', value: 12 } ];

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredBookings} 
                renderItem={renderBookingCard}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <>
                        <Text style={styles.title}>คำร้องขอการจองห้องพัก</Text>
                        <View style={styles.searchContainer}>
                            <TextInput style={styles.searchInput} placeholder="ค้นหาชื่อลูกค้า..." value={searchQuery} onChangeText={setSearchQuery}/>
                            <View style={styles.filterRow}>
                                <TouchableOpacity style={styles.pickerButton} onPress={() => setMonthPickerVisible(true)}><Text style={styles.pickerButtonText}>{selectedMonth ? months.find(m => m.value === selectedMonth).label : 'ทุกเดือน'}</Text></TouchableOpacity>
                                <TouchableOpacity style={styles.pickerButton} onPress={() => setYearPickerVisible(true)}><Text style={styles.pickerButtonText}>{selectedYear ? (selectedYear + 543) : 'ทุกปี'}</Text></TouchableOpacity>
                            </View>
                        </View>
                    </>
                }
                ListEmptyComponent={ <View style={styles.emptyContainer}>{isLoading ? <ActivityIndicator size="large" /> : <Text style={styles.emptyText}>ไม่พบข้อมูล</Text>}</View> }
                refreshing={isLoading}
                onRefresh={fetchBookings}
            />
            <TouchableOpacity style={styles.refreshButton} onPress={fetchBookings}><Ionicons name="refresh" size={24} color="#333" /></TouchableOpacity>

            <Modal transparent={true} visible={isMonthPickerVisible} onRequestClose={() => setMonthPickerVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setMonthPickerVisible(false)}>
                    <View style={styles.modalContent}><ScrollView>
                        <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedMonth(null); setMonthPickerVisible(false); }}><Text style={styles.modalItemText}>ทุกเดือน</Text></TouchableOpacity>
                        {months.map((month) => (<TouchableOpacity key={month.value} style={styles.modalItem} onPress={() => { setSelectedMonth(month.value); setMonthPickerVisible(false); }}><Text style={styles.modalItemText}>{month.label}</Text></TouchableOpacity>))}
                    </ScrollView></View>
                </TouchableOpacity>
            </Modal>

            <Modal transparent={true} visible={isYearPickerVisible} onRequestClose={() => setYearPickerVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setYearPickerVisible(false)}>
                    <View style={styles.modalContent}><ScrollView>
                        <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedYear(null); setYearPickerVisible(false); }}><Text style={styles.modalItemText}>ทุกปี</Text></TouchableOpacity>
                        {availableYears.map((year) => (<TouchableOpacity key={year} style={styles.modalItem} onPress={() => { setSelectedYear(year); setYearPickerVisible(false); }}><Text style={styles.modalItemText}>{year + 543}</Text></TouchableOpacity>))}
                    </ScrollView></View>
                </TouchableOpacity>
            </Modal>
            
            <Modal
                transparent={true}
                visible={isCancelDetailModalVisible}
                onRequestClose={() => setCancelDetailModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1}
                    onPress={() => setCancelDetailModalVisible(false)}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.detailModalContent} onPress={() => {}}>
                        <Text style={styles.detailModalTitle}>รายละเอียดการยกเลิก</Text>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>ลูกค้า:</Text><Text style={styles.detailValue}>{selectedCancelledBooking?.first_name} {selectedCancelledBooking?.last_name}</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>เหตุผลที่ลูกค้ายกเลิก:</Text><Text style={styles.detailValue}>{selectedCancelledBooking?.cancellation_reason || 'ไม่ได้ระบุ'}</Text></View>
                        <Text style={styles.detailSectionTitle}>ข้อมูลสำหรับโอนเงินคืน</Text>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>ธนาคาร:</Text><Text style={styles.detailValue}>{selectedCancelledBooking?.refund_bank_name || 'ไม่มีข้อมูล'}</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>เลขที่บัญชี:</Text><Text style={styles.detailValue}>{selectedCancelledBooking?.refund_account_number || 'ไม่มีข้อมูล'}</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>ชื่อบัญชี:</Text><Text style={styles.detailValue}>{selectedCancelledBooking?.refund_account_name || 'ไม่มีข้อมูล'}</Text></View>
                        <TouchableOpacity 
                            style={[styles.closeModalButton, styles.confirmRefundButton, isConfirmingRefund && { opacity: 0.5 }]}
                            onPress={() => handleConfirmRefund(selectedCancelledBooking?.id)}
                            disabled={isConfirmingRefund}
                        >
                            {isConfirmingRefund ? <ActivityIndicator color="#fff" /> : <Text style={styles.closeModalButtonText}>ยืนยันการคืนเงิน</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.closeModalButton, { backgroundColor: '#8E8E93', marginTop: 10 }]}
                            onPress={() => setCancelDetailModalVisible(false)}
                        >
                            <Text style={styles.closeModalButtonText}>ปิด</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F7' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
    searchContainer: { paddingHorizontal: 15, marginBottom: 15, },
    searchInput: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', fontSize: 16, },
    filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, },
    pickerButton: { flex: 1, backgroundColor: '#fff', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', marginHorizontal: 5, },
    pickerButtonText: { fontSize: 14, },
    card: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginHorizontal: 15, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
    cardContent: { marginBottom: 10 },
    cardTitle: { fontSize: 18, fontWeight: 'bold' },
    cardSubtitle: { fontSize: 16, color: '#555', marginTop: 5 },
    cardText: { fontSize: 14, color: '#333', marginTop: 10 },
    priceText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF', marginTop: 10, },
    priceTextt: { fontSize: 16, fontWeight: 'bold', color: '#ff0000ff', marginTop: 10, },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee', },
    statusInfo: { flex: 1 },
    statusLabel: { fontSize: 14, color: '#666' },
    statusValue: { fontWeight: 'bold', color: '#000' },
    slipButton: { backgroundColor: '#E5E5EA', padding: 10, borderRadius: 5, marginTop: 15, alignItems: 'center', },
    slipButtonText: { color: '#007AFF', fontWeight: 'bold' },
    actionContainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
    actionButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5, marginLeft: 10 },
    actionButtonText: { color: 'white', fontWeight: 'bold' },
    confirmButton: { backgroundColor: '#34C759' },
    cancelButton: { backgroundColor: '#FF3B30' },
    checkInButton: { backgroundColor: '#007AFF' },
    checkOutButton: { backgroundColor: '#8E8E93' },
    detailsButton: { backgroundColor: '#5856D6' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 16, color: '#888' },
    refreshButton: { position: 'absolute', bottom: 30, right: 20, zIndex: 10, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 10, borderRadius: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', borderRadius: 10, paddingVertical: 10, width: 'auto', minWidth: 250, maxWidth: '80%', maxHeight: '60%', overflow: 'hidden', },
    modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalItemText: { textAlign: 'center', fontSize: 16 },
    detailModalContent: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: '90%', maxWidth: 400, },
    detailModalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', },
    detailSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15, },
    detailRow: { marginBottom: 12, },
    detailLabel: { fontSize: 14, color: '#666', fontWeight: 'bold', marginBottom: 4 },
    detailValue: { fontSize: 16, color: '#000', },
    closeModalButton: { backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 12, marginTop: 20, },
    closeModalButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16, },
    confirmRefundButton: { backgroundColor: '#34C759', },
});