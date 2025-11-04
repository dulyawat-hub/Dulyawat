import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // เปลี่ยน safe ให้เป็นคอนเทนเนอร์หลักของหน้าจอ
  safe: {
    flex: 1,
    backgroundColor: '#F5F5F7', // สีพื้นหลังอ่อนๆ
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  container: {
    padding: 20,
    backgroundColor: '#F5F5F7',
    // เพิ่ม padding ด้านล่าง เพื่อไม่ให้เนื้อหาถูกเมนูด้านล่างบัง
    paddingBottom: 70,
  },
  // Header styles (สไตล์จากหน้าแสดงรายการห้องพัก)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  // Booking Summary styles (สไตล์จากหน้าแสดงรายการห้องพัก)
  bookingSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E0F7FA',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#007B8A',
    fontWeight: '500',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  // Room Card styles (สไตล์จากหน้าแสดงรายการห้องพัก)
  roomCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  roomImage: {
    width: '40%',
    height: '100%',
    minHeight: 150,
  },
  roomDetails: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  roomDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  roomInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#333',
  },
  roomPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007B8A',
  },
  // สไตล์สำหรับหน้าค้นหา (Search Screen)
  searchContainer: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 70,
  },
  // แถบเลือกวันที่
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  dateBox: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  dateLabel: {
    color: '#81DFEF',
    fontSize: 14,
    fontWeight: '600',
  },
  dateText: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  // แถบเลือกจำนวนแมว
  catBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  catText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#81DFEF',
    fontWeight: 'bold',
  },
  // ปุ่มหลัก
  mainButton: {
    marginTop: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    backgroundColor: '#81DFEF',
    borderRadius: 15,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#81DFEF',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  // ปุ่มสองอันด้านล่าง
  twoButtonRow: {
    flexDirection: 'row',
    marginTop: 25,
    justifyContent: 'space-between',
    width: '100%',
  },
  infoButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  infoButtonText: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
  },
  // เมนูด้านล่าง
  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 22,
    backgroundColor: '#fff',
    position: 'absolute', // ยึดเมนูให้อยู่ในตำแหน่งที่แน่นอน
    bottom: 0, // ให้อยู่ติดขอบล่างสุด
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  menuItem: {
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 12,
    marginTop: 5,
    color: '#333',
  },
  iconText: {
    fontSize: 30,
    color: '#81DFEF', // สีม่วงเข้ม
  },
  // สไตล์สำหรับ Overlay
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayContent: {
    width: '85%',
    backgroundColor: '#F5F5F7',
    borderRadius: 15,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overlayTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#81DFEF',
  },
  closeButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  closeButtonText: {
    color: '#81DFEF',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 15,
    marginBottom: 5,
  },
  overlayMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  overlayMenuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  socialText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  profileIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  // Style สำหรับ Overlay ใหม่
  overlayMenuItemV2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // จัดให้ไอคอนอยู่คนละฝั่ง
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  overlayMenuItemTextV2: {
    fontSize: 16,
    color: '#333',
  },
  // เพิ่มสไตล์ที่จำเป็นสำหรับ Overlay ของผู้ใช้
  overlayProfileItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#fff', 
    borderWidth: 1,
    borderColor: '#81DFEF', 
    borderRadius: 10, // ทำให้มุมโค้งมน
    padding: 15,
    marginTop: 10,
    alignItems: 'center', // จัดให้อยู่ตรงกลาง
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#81DFEF', // สีข้อความเดียวกับไอคอน
    fontWeight: 'bold',
  },
  // Home Screen Specific (สไตล์จากหน้าแรก)
  homeContent: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007B8A',
    marginBottom: 10,
  },
  homeDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: '#81DFEF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
