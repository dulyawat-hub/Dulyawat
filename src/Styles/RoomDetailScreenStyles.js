import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerImage: { width: '100%', height: 250 },
  container: { padding: 16 },
  roomName: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  hotelName: { fontSize: 16, fontWeight: '500', marginBottom: 5},
  infoText: { fontSize: 14, color: '#555', marginBottom: 5 },
  linkText: { fontSize: 14, color: '#007BFF', textDecorationLine: 'underline', marginBottom: 5 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#81DFEF', textAlign: 'right', marginVertical: 10 },
  amenitiesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  amenityItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 8 },
  amenityText: { marginLeft: 8, fontSize: 14 },
  reviewCard: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 10 },
  reviewUser: { fontWeight: 'bold' },
  reviewText: { fontStyle: 'italic', marginVertical: 4 },
  reviewRating: { textAlign: 'right', color: '#888' },

    // --- สไตล์สำหรับปุ่มจอง ---
  bookingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookingButton: {
    backgroundColor: '#81DFEF',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#81DFEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  bookingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
