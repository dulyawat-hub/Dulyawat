import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  Modal,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import 'moment/locale/th';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import styles from '../Styles/HomeScreenStyles';
import { AuthContext } from './AuthContext';

// ตั้งค่าภาษาไทยสำหรับ moment
moment.locale('th');

export default function HomeScreen() {
  const navigation = useNavigation();
  // ดึงสถานะและฟังก์ชันจาก AuthContext
  const { isUserLoggedIn, logout, user } = useContext(AuthContext);

  // State สำหรับเก็บจำนวนแมว
  const [catCount, setCatCount] = useState(1);
  // State สำหรับเก็บวันที่เช็คอินและเช็คเอาท์
  const [checkInDate, setCheckInDate] = useState(null);
  // State สำหรับเก็บวันที่เช็คอินและเช็คเอาท์
  const [checkOutDate, setCheckOutDate] = useState(null);
  // State สำหรับควบคุมการแสดง Date Picker
  const [isPickerVisible, setPickerVisible] = useState(false);
  // State สำหรับระบุว่ากำลังเลือกวันที่ไหน ('checkin' หรือ 'checkout')
  const [selecting, setSelecting] = useState('checkin');
  // State สำหรับกำหนดวันที่เริ่มต้นที่สามารถเลือกได้ใน Date Picker
  const [pickerMinimumDate, setPickerMinimumDate] = useState(new Date());
  // State สำหรับควบคุมการแสดง Overlay
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  // ฟังก์ชันแสดง Alert ที่ทำงานได้ทั้งบน mobile และ web
  const showAlertAllPlatforms = (title, msg, buttons = []) => {
    // ใช้ Alert.alert ที่รองรับ buttons array อยู่แล้ว
    Alert.alert(title, msg, buttons);
    // เพิ่มการแจ้งเตือนสำหรับเว็บ
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${msg}`);
    }
  };

  // ฟังก์ชันแสดง Date Picker
  const showPicker = (type) => {
    setSelecting(type);
    if (type === 'checkin') {
      setPickerMinimumDate(new Date());
    } else {
      const minDate = checkInDate ? moment(checkInDate).add(1, 'days').toDate() : new Date();
      setPickerMinimumDate(minDate);
    }
    setPickerVisible(true);
  };

  // ฟังก์ชันเมื่อผู้ใช้ยืนยันการเลือกวันที่
  const handleConfirm = (date) => {
    setPickerVisible(false);
    let newCheckInDate = checkInDate;
    let newCheckOutDate = checkOutDate;
    let message = '';
    if (selecting === 'checkin') {
      newCheckInDate = date;
      message = `เลือกวันเช็คอินสำเร็จแล้ว: ${moment(date).format('LL')}`;
      if (checkOutDate && (moment(date).isAfter(checkOutDate) || moment(date).isSame(checkOutDate))) {
        newCheckOutDate = null;
      }
    } else {
      newCheckOutDate = date;
      message = `เลือกวันเช็คเอาท์สำเร็จแล้ว: ${moment(date).format('LL')}`;
    }
    setCheckInDate(newCheckInDate);
    setCheckOutDate(newCheckOutDate);
    showAlertAllPlatforms('เลือกวันที่สำเร็จ', message);
  };

  // ฟังก์ชันสำหรับออกจากระบบพร้อม Alert ยืนยัน
  const handleLogout = () => {
    showAlertAllPlatforms(
      'ยืนยันการออกจากระบบ',
      'คุณต้องการออกจากระบบหรือไม่?',
      [
        {
          text: 'ยกเลิก',
          onPress: () => console.log('ยกเลิกการออกจากระบบ'),
          style: 'cancel',
        },
        {
          text: 'ยืนยัน',
          onPress: () => {
            // โค้ดเดิมที่ใช้ในการออกจากระบบ
            logout();
            showAlertAllPlatforms('ออกจากระบบ', 'ออกจากระบบสำเร็จแล้ว');
            // เรียกใช้ toggleOverlay() เพื่อปิดหน้าต่างเมนูเมื่อออกจากระบบ
            toggleOverlay();
          },
        },
      ]
    );
  };

  const iconSize = styles.iconText.fontSize;
  const iconColor = styles.iconText.color;

  // ฟังก์ชันสำหรับสลับสถานะการแสดง Overlay
  const toggleOverlay = () => {
    setOverlayVisible(!isOverlayVisible);
  };

  // กำหนด URL รูปโปรไฟล์ด้วยเงื่อนไข
  const profilePicUrl = user?.profile_pic_url || 'https://placehold.co/100x100/81DFEF/FFFFFF?text=DP';

  // ฟังก์ชันสำหรับนำทางไปหน้าดูห้องพัก
  const handleViewRooms = () => {
    if (!checkInDate || !checkOutDate) {
      showAlertAllPlatforms('แจ้งเตือน', 'กรุณาเลือกวันเช็คอินและเช็คเอาท์ก่อน');
    } else {
      navigation.navigate('RoomList', {
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        catCount: catCount,
      });
    }
  };
    
  // ✅ เพิ่มฟังก์ชันนี้สำหรับนำทางไปหน้าแผนที่
  const handleMapView = () => {
    navigation.navigate('Map');
  };

  return (
    <View style={styles.safe}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* วันที่ */}
          <View style={styles.dateRow}>
            <TouchableOpacity style={styles.dateBox} onPress={() => showPicker('checkin')}>
              <Ionicons name="calendar-sharp" size={iconSize} color={iconColor} />
              <Text style={styles.dateLabel}>เช็คอิน:</Text>
              <Text style={styles.dateText}>
                {checkInDate ? moment(checkInDate).format('LL') : 'เลือกวันที่'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateBox} onPress={() => showPicker('checkout')}>
              <Ionicons name="calendar-sharp" size={iconSize} color={iconColor} />
              <Text style={styles.dateLabel}>เช็คเอาท์:</Text>
              <Text style={styles.dateText}>
                {checkOutDate ? moment(checkOutDate).format('LL') : 'เลือกวันที่'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* จำนวนแมว */}
          <View style={styles.catBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome5 name="cat" size={iconSize} color={iconColor} style={{ marginRight: 10 }} />
              <Text style={styles.catText}>จำนวนแมว: {catCount}</Text>
            </View>
            {/* ปุ่มบวกลบถูกนำออกไปแล้ว */}
          </View>

          {/* ปุ่มดูห้องพัก - เพิ่ม onPress handler */}
          <TouchableOpacity style={styles.mainButton} onPress={handleViewRooms}>
            <Text style={styles.mainButtonText}>ดูห้องพัก</Text>
          </TouchableOpacity>

          {/* แผนที่และนโยบาย */}
          <View style={styles.twoButtonRow}>
            {/* ✅ แก้ไข: เพิ่ม onPress handler เพื่อนำทางไปยังหน้าแผนที่ */}
            <TouchableOpacity style={styles.infoButton} onPress={handleMapView}>
              <FontAwesome5 name="map-marked-alt" size={iconSize} color={iconColor} />
              <Text style={styles.infoButtonText}>แผนที่โรงแรม</Text>
            </TouchableOpacity>
            {/* ✅ แก้ไข: เพิ่ม onPress handler เพื่อนำทางไปยังหน้า 'Policy' */}
            <TouchableOpacity style={styles.infoButton} onPress={() => navigation.navigate('Policy')}>
              <Ionicons name="book-sharp" size={iconSize} color={iconColor} />
              <Text style={styles.infoButtonText}>นโยบายโรงแรม</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* เมนูด้านล่าง */}
      <View style={styles.bottomMenu}>
        {/* แสดงเมนูเมื่อล็อกอินแล้ว */}
        {isUserLoggedIn ? (
          <>
            <View style={styles.menuItem}>
              <Ionicons name="home-sharp" size={iconSize} color={iconColor} />
              <Text style={styles.menuLabel}>หน้าหลัก</Text>
            </View>
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
          // แสดงเมนูเมื่อยังไม่ได้ล็อกอิน
          <>
            <View style={styles.menuItem}>
              <Ionicons name="home-sharp" size={iconSize} color={iconColor} />
              <Text style={styles.menuLabel}>หน้าหลัก</Text>
            </View>
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

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
        minimumDate={pickerMinimumDate}
        locale="th-TH"
      />

      {/* Overlay สำหรับเมนูเพิ่มเติม */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOverlayVisible}
        onRequestClose={toggleOverlay}
      >
        <View style={styles.overlayContainer}>
          <View style={styles.overlayContent}>
            {/* Header ของ Overlay */}
            <View style={styles.overlayHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="menu-sharp" size={30} color="#81DFEF" />
                <Text style={styles.overlayTitle}>เพิ่มเติม</Text>
              </View>
              <TouchableOpacity onPress={toggleOverlay} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>ปิด</Text>
              </TouchableOpacity>
            </View>

            {/* ส่วนของเมนูเมื่อผู้ใช้ล็อกอินแล้ว */}
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
                    {/* ✅ แก้ไข: ห่อหุ้มข้อความด้วย <Text> component */}
                    <Text style={styles.overlayMenuItemTextV2}>โปรไฟล์</Text>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={24} color="#81DFEF" />
                </TouchableOpacity>

                {/* <Text style={styles.sectionTitle}>ประวัติการใช้งาน</Text>
                <TouchableOpacity style={styles.overlayMenuItemV2} onPress={() => {
                  // Navigate to history screen
                  toggleOverlay();
                }}> */}
                  {/* ✅ แก้ไข: ห่อหุ้มข้อความด้วย <Text> component */}
                  {/* <Text style={styles.overlayMenuItemTextV2}>ประวัติการใช้งาน</Text>
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
                <Text style={styles.sectionTitle}>ที่อยู่โรงแรม</Text>


                <TouchableOpacity
                  style={styles.overlayMenuItemV2}
                  onPress={handleLogout}
                >
                  {/* ✅ แก้ไข: ห่อหุ้มข้อความด้วย <Text> component */}
                  <Text style={styles.overlayMenuItemTextV2}>ออกจากระบบ</Text>
                  <Ionicons name="log-out-outline" size={24} color="#81DFEF" />
                </TouchableOpacity>
              </>
            ) : (
              // ส่วนของเมนูเมื่อผู้ใช้ยังไม่ได้ล็อกอิน
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

                {/* ปุ่มเข้าสู่ระบบใน Overlay */}
                <TouchableOpacity
                  style={styles.overlayMenuItemV2}
                  onPress={() => {
                    navigation.navigate('Login');
                    toggleOverlay();
                  }}
                >
                  {/* ✅ แก้ไข: ห่อหุ้มข้อความด้วย <Text> component */}
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

