import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    section: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#6D6D72',
        marginBottom: 20,
    },
    inputGroup: {
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        fontSize: 16,
        paddingTop: 5,
    },
    imagePicker: {
        borderWidth: 2,
        borderColor: '#C7C7CC',
        borderStyle: 'dashed',
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8F8F8',
    },
    imagePickerText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    imagePreviewContainer: {
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#33FF99',
        margin: 20,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // เพิ่ม 2 สไตล์นี้เข้าไปในไฟล์ AddEditCatScreenStyles.js ของคุณ
deleteCatButton: {
    backgroundColor: '#E53935', // Red color for deletion
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
},
deleteCatButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
},
});

export default styles;
