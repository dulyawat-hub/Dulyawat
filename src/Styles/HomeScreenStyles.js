import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // เปลี่ยน safe ให้เป็นคอนเทนเนอร์หลักของหน้าจอ
  safe: {
    flex: 1,
    backgroundColor: '#ffffffff', // สีพื้นหลังอ่อนๆ
  },
  container: {
    padding: 20,
    alignItems: 'center',
    // เพิ่ม padding ด้านล่าง เพื่อไม่ให้เนื้อหาถูกเมนูด้านล่างบัง
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
    color: '#81DFEF', // สีม่วงเข้ม
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
    backgroundColor: '#81DFEF', // สีชมพูสดใส
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
});

export default styles;
