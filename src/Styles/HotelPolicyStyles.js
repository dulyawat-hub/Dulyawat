import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff', // สีพื้นหลังแบบสบายตา
  },
  scrollViewContent: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  policyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    maxWidth: 500, // จำกัดความกว้างบนจอขนาดใหญ่
    elevation: 5, // เพิ่มเงาสำหรับ Android
    shadowColor: '#000', // เงาสำหรับ iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005662', // สีเน้นสำหรับหัวข้อ
    marginBottom: 10,
  },
  policyContent: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});

export default styles;


