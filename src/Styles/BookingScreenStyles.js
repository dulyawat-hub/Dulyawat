import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    // --- Main Container ---
    container: { 
        flex: 1, 
        backgroundColor: '#F5F5F7', 
    },
    scrollContainer: {
        padding: 15,
        paddingBottom: 90, // Add padding to avoid being hidden by the bottom menu
    },
    headerTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center',
        paddingTop: 15,
    },
    infoText: { 
        textAlign: 'center', 
        marginTop: 50, 
        fontSize: 16,
        color: '#555',
    },

    // --- Booking Card ---
    card: { 
        backgroundColor: '#fff', 
        borderRadius: 15, 
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    roomImage: { 
        width: '100%', 
        height: 150, 
        borderTopLeftRadius: 15, 
        borderTopRightRadius: 15 
    },
    cardBody: { 
        padding: 15 
    },
    roomName: { 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    dateText: { 
        fontSize: 14, 
        color: '#555', 
        marginTop: 5 
    },

    // --- Status & Buttons ---
    statusBadge: { 
        borderRadius: 20, 
        paddingVertical: 5, 
        paddingHorizontal: 10, 
        alignSelf: 'flex-start', 
        marginTop: 10,
    },
    statusText: { 
        color: '#fff', 
        fontWeight: 'bold',
        fontSize: 12,
    },
    statusPending: { backgroundColor: '#FFA500' }, // Orange
    statusConfirmed: { backgroundColor: '#34C759' }, // Green
    statusCancelled: { backgroundColor: '#FF3B30' }, // Red
    statusCompleted: { backgroundColor: '#A28442' },
    statusCheckedIn: { backgroundColor: '#007AFF' }, 
    statusCheckedOut: { backgroundColor: '#8E8E93' },
    payButton: { 
        backgroundColor: '#007AFF', 
        padding: 12, 
        borderRadius: 10, 
        marginTop: 15, 
        alignItems: 'center',
    },
    payButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    loginButton: { 
        backgroundColor: '#007AFF', 
        padding: 15, 
        borderRadius: 10, 
        marginTop: 20,
        marginHorizontal: 20,
    },
    loginButtonText: { 
        color: '#fff', 
        textAlign: 'center', 
        fontSize: 16 
    },

    // --- Bottom Menu ---
    bottomMenu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 22,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
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
        color: '#81DFEF',
    },

    // --- Overlay Modal ---
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
        color: '#81DFEF'
    },
    closeButton: {
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    closeButtonText: {
        fontWeight: 'bold',
        color: '#81DFEF'
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 15,
        marginBottom: 10,
    },
    overlayMenuItemV2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
    },
    overlayMenuItemTextV2: {
        fontSize: 16,
        color: '#333',
    },
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
    socialText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    
    // --- Review Feature Styles ---
    reviewButton: { 
        backgroundColor: '#8E44AD', 
        padding: 12, 
        borderRadius: 10, 
        marginTop: 15, 
        alignItems: 'center',
    },
    reviewButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    viewReviewButton: { 
        backgroundColor: '#8E8E93',
        padding: 12, 
        borderRadius: 10, 
        marginTop: 15, 
        alignItems: 'center',
    },
    viewReviewButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    viewBookingButton: {
        backgroundColor: '#5856D6', // Indigo color
        padding: 12,
        borderRadius: 10,
        marginTop: 15,
        alignItems: 'center',
    },
    viewBookingButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalRoomName: {
        fontSize: 16,
        color: '#555',
        marginBottom: 15,
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    commentInput: {
        width: '100%',
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#27AE60',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelText: {
        color: '#888',
        marginTop: 15,
    },
    commentText: {
        fontStyle: 'italic',
        fontSize: 16,
        marginVertical: 20,
        textAlign: 'center',
        color: '#333'
    },
    closeReviewButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    closeReviewButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewConfirmationButton: {
    backgroundColor: '#5856D6', // สีม่วง Indigo
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    },
    viewConfirmationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
    },
    refreshButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 10,
        borderRadius: 25, // Make it circular
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    // --- Confirmation Modal Styles ---
    confirmationCard: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    confirmationTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    confirmationDetails: {
        alignSelf: 'stretch',
        marginBottom: 20,
    },
    detailRow: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    detailLabel: {
        fontWeight: 'bold',
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBE6',
        borderRadius: 10,
        padding: 10,
        width: '100%',
        marginBottom: 20,
    },
    warningText: {
        flex: 1,
        marginLeft: 10,
        color: '#92400E',
        fontSize: 14,
    },
    meowButton: {
        backgroundColor: '#81DFEF',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    meowButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
     cancelButton: { 
        backgroundColor: '#FF3B30', // Red color
        padding: 12, 
        borderRadius: 10, 
        marginTop: 15, 
        alignItems: 'center',
    },
    cancelButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    cancelButton: {
    backgroundColor: '#FF3B30', // Red color for cancellation
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
},
cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
},

// For Cancel Modal
inputLabel: {
    alignSelf: 'flex-start',
    marginLeft: '0%',
    marginBottom: 5,
    marginTop: 15,
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
},
textInput: {
    height: 50,
    width: '100%',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F7F7F7',
},
statusConfirmed: {
    backgroundColor: '#00ff59ff', // สีเขียวอ่อน
    borderColor: '#ffffffff',
},
statusCancelled: {
    backgroundColor: '#ff1900ff', // สีแดงอ่อน
    borderColor: '#FF3B30',
},

// ✅ เพิ่ม Style สำหรับสถานะ "คืนเงินแล้ว" เข้าไปตรงนี้
statusRefunded: {
    backgroundColor: '#026c02ff', // สีเทาอ่อน
    borderColor: '#8E8E93',     // สีเทาเข้ม
},

});

export default styles;

