import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from '../Styles/RoomListScreenStyles';
import { AuthContext } from './AuthContext';
import { API_URL } from '../../config';

export default function RoomListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { checkInDate, checkOutDate, catCount } = route.params;
  const { isUserLoggedIn, logout, user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

    useEffect(() => {
    const fetchRooms = async () => {
        // ตั้งค่าสถานะเป็นกำลังโหลดทุกครั้งที่เริ่มดึงข้อมูล
        setLoading(true);
        try {
            // สร้าง URL พร้อมกับส่ง checkInDate และ checkOutDate ไปเป็น query parameters
            const url = `${API_URL}/api/rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
            
            console.log('Fetching available rooms from:', url); // สำหรับ Debug

            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch rooms from server');
            }

            const data = await response.json();
            setRooms(data);

        } catch (e) {
            console.error("Error fetching available rooms:", e);
            setError(e.message);
            Alert.alert("Error", e.message || "ไม่สามารถดึงข้อมูลห้องพักได้ กรุณาลองใหม่อีกครั้ง");
        } finally {
            setLoading(false);
        }
    };

    if (checkInDate && checkOutDate) {
        fetchRooms();
    }
}, [checkInDate, checkOutDate]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#81DFEF" />
        <Text style={{ marginTop: 10 }}>กำลังโหลดห้องพัก...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red' }}>เกิดข้อผิดพลาด: {error}</Text>
      </SafeAreaView>
    );
  }

  const formattedCheckInDate = moment(checkInDate);
  const formattedCheckOutDate = moment(checkOutDate);

  const showAlertAllPlatforms = (title, msg, buttons = []) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${msg}`);
    } else {
      Alert.alert(title, msg, buttons);
    }
  };

  const handleLogout = () => {
    showAlertAllPlatforms(
      'ยืนยันการออกจากระบบ',
      'คุณต้องการออกจากระบบหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ยืนยัน',
          onPress: () => {
            logout();
            showAlertAllPlatforms('ออกจากระบบ', 'ออกจากระบบสำเร็จแล้ว');
            toggleOverlay();
          },
        },
      ]
    );
  };

  const toggleOverlay = () => {
    setOverlayVisible(!isOverlayVisible);
  };

  const profilePicUrl = user?.profile_pic_url || 'https://placehold.co/100x100/81DFEF/FFFFFF?text=DP';
  const iconSize = styles.iconText ? styles.iconText.fontSize : 24;
  const iconColor = styles.iconText ? styles.iconText.color : '#888';

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* ส่วนสรุปการจอง (ย้ายมาไว้ข้างนอก ScrollView) */}
        <View style={styles.bookingSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>เช็คอิน:</Text>
            <Text style={styles.summaryText}>
              {formattedCheckInDate.format('DD MMM YYYY')}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>เช็คเอาท์:</Text>
            <Text style={styles.summaryText}>
              {formattedCheckOutDate.format('DD MMM YYYY')}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>แมว:</Text>
            <Text style={styles.summaryText}>{catCount}</Text>
          </View>
        </View>

        {/* ScrollView สำหรับรายการห้องพักเท่านั้น */}
        <ScrollView contentContainerStyle={styles.container}>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <TouchableOpacity
                key={room.id}
                style={styles.roomCard}
                onPress={() => navigation.navigate('RoomDetail', { 
                roomId: room.id,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                catCount: catCount })}
              >
                <Image source={{ uri: room.image_url }} style={styles.roomImage} />
                <View style={styles.roomDetails}>
                  <Text style={styles.roomName}>{room.name}</Text>
                  {/* <Text style={styles.roomDescription}>{room.description}</Text> */}
                  <View style={styles.roomInfoRow}>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>{room.rating}/5</Text>
                    </View>
                    <Text style={styles.roomPrice}>฿ {room.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>ไม่พบข้อมูลห้องพัก</Text>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* เมนูด้านล่าง */}
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

      {/* Overlay สำหรับเมนูเพิ่มเติม */}
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
              <>
                <Text style={styles.sectionTitle}>เกี่ยวกับโรงแรม</Text>
                {/* ✅ แก้ไข: เพิ่ม onPress handler เพื่อนำทางไปยังหน้า 'HotelPolicy' */}
                <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => {
                  navigation.navigate('Policy');
                  toggleOverlay();
                }}>
                  {/* ✅ แก้ไข: ห่อหุ้มข้อความด้วย <Text> component */}
                  <Text style={styles.overlayMenuItemTextV2}>สำหรับโรงแรม</Text>
                  <Ionicons name="chevron-forward-outline" size={24} color="#81DFEF" />
                </TouchableOpacity>

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
                  onPress={() => {
                    navigation.navigate('Login');
                    toggleOverlay();
                  }}
                >
                  <Text style={styles.overlayMenuItemTextV2}>เข้าสู่ระบบ</Text>
                  <Ionicons name="log-in-outline" size={24} color="#81DFEF" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}