import React, { useState, useEffect, useContext } from 'react';
import { View, Text, SafeAreaView, FlatList, StyleSheet, Alert, ActivityIndicator, TextInput, Modal, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../screens/AuthContext';
import { API_URL } from '../../config';
import moment from 'moment';
import 'moment/locale/th';
import Ionicons from 'react-native-vector-icons/Ionicons';

moment.locale('th');

export default function AdminStayHistoryScreen() {
    const navigation = useNavigation();
    const { token } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
    const [isYearPickerVisible, setYearPickerVisible] = useState(false);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/admin/stay-history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch stay history');
            const data = await res.json();
            setHistory(data);
            setFilteredHistory(data);
        } catch (error) {
            Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลบันทึกการเข้าพักได้');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchHistory);
        return unsubscribe;
    }, [navigation, token]);

    useEffect(() => {
        const filtered = history.filter(item => {
            const customerName = `${item.first_name} ${item.last_name}`.toLowerCase();
            const checkInDate = moment(item.check_in_date);
            const nameMatch = customerName.includes(searchQuery.toLowerCase());
            const monthMatch = selectedMonth ? (checkInDate.month() + 1) === selectedMonth : true;
            const yearMatch = selectedYear ? checkInDate.year() === selectedYear : true;
            return nameMatch && monthMatch && yearMatch;
        });
        setFilteredHistory(filtered);
    }, [searchQuery, history, selectedMonth, selectedYear]);

    const renderHistoryCard = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.room_name}</Text>
            <Text style={styles.cardSubtitle}>ลูกค้า: {item.first_name} {item.last_name}</Text>
            <View style={styles.dateContainer}>
                <View>
                    <Text style={styles.dateLabel}>เช็คอิน</Text>
                    <Text style={styles.dateText}>{moment(item.check_in_date).format('LL')}</Text>
                </View>
                <View>
                    <Text style={styles.dateLabel}>เช็คเอาท์</Text>
                    <Text style={styles.dateText}>{moment(item.check_out_date).format('LL')}</Text>
                </View>
            </View>
        </View>
    );

    const availableYears = [...new Set(history.map(item => moment(item.check_in_date).year()))].sort((a, b) => b - a);
    const months = [
        { label: 'มกราคม', value: 1 }, { label: 'กุมภาพันธ์', value: 2 }, { label: 'มีนาคม', value: 3 },
        { label: 'เมษายน', value: 4 }, { label: 'พฤษภาคม', value: 5 }, { label: 'มิถุนายน', value: 6 },
        { label: 'กรกฎาคม', value: 7 }, { label: 'สิงหาคม', value: 8 }, { label: 'กันยายน', value: 9 },
        { label: 'ตุลาคม', value: 10 }, { label: 'พฤศจิกายน', value: 11 }, { label: 'ธันวาคม', value: 12 },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredHistory}
                renderItem={renderHistoryCard}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <>
                        <Text style={styles.title}>บันทึกการเข้าพักของสมาชิก</Text>
                        <View style={styles.searchContainer}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="ค้นหาชื่อลูกค้า..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            <View style={styles.filterRow}>
                                <TouchableOpacity style={styles.pickerButton} onPress={() => setMonthPickerVisible(true)}>
                                    <Text style={styles.pickerButtonText}>{selectedMonth ? months.find(m => m.value === selectedMonth).label : 'ทุกเดือน'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.pickerButton} onPress={() => setYearPickerVisible(true)}>
                                    <Text style={styles.pickerButtonText}>{selectedYear ? (selectedYear + 543) : 'ทุกปี'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        {isLoading ? <ActivityIndicator size="large" /> : <Text style={styles.emptyText}>ไม่พบข้อมูล</Text>}
                    </View>
                }
                refreshing={isLoading}
                onRefresh={fetchHistory}
            />
            
            {/* ✅ ย้ายปุ่มรีเฟรชมาไว้ท้ายสุดเพื่อให้ลอยอยู่เหนือ FlatList */}
            <TouchableOpacity style={styles.refreshButton} onPress={fetchHistory}>
                <Ionicons name="refresh" size={24} color="#333" />
            </TouchableOpacity>
            
            {/* Modal สำหรับเลือกเดือน */}
            <Modal
                transparent={true}
                visible={isMonthPickerVisible}
                onRequestClose={() => setMonthPickerVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setMonthPickerVisible(false)}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedMonth(null); setMonthPickerVisible(false); }}>
                                <Text style={styles.modalItemText}>ทุกเดือน</Text>
                            </TouchableOpacity>
                            {months.map((month) => (
                                <TouchableOpacity key={month.value} style={styles.modalItem} onPress={() => { setSelectedMonth(month.value); setMonthPickerVisible(false); }}>
                                    <Text style={styles.modalItemText}>{month.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Modal สำหรับเลือกปี */}
            <Modal
                transparent={true}
                visible={isYearPickerVisible}
                onRequestClose={() => setYearPickerVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setYearPickerVisible(false)}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedYear(null); setYearPickerVisible(false); }}>
                                <Text style={styles.modalItemText}>ทุกปี</Text>
                            </TouchableOpacity>
                            {availableYears.map((year) => (
                                <TouchableOpacity key={year} style={styles.modalItem} onPress={() => { setSelectedYear(year); setYearPickerVisible(false); }}>
                                    <Text style={styles.modalItemText}>{year + 543}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F7' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
    searchContainer: { paddingHorizontal: 15, marginBottom: 10 },
    searchInput: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    pickerButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    pickerButtonText: {
        fontSize: 14,
    },
    card: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginHorizontal: 15, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    cardSubtitle: { fontSize: 16, color: '#555', marginBottom: 10 },
    dateContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
    dateLabel: { fontSize: 12, color: '#888' },
    dateText: { fontSize: 14, fontWeight: '500' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 16, color: '#888' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { 
        backgroundColor: 'white', 
        borderRadius: 10, 
        paddingVertical: 10,
        width: 'auto',
        minWidth: 250,
        maxWidth: '80%',
        maxHeight: '60%',
        overflow: 'hidden',
    },
    modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalItemText: { textAlign: 'center', fontSize: 16 },
    // ✅ แก้ไข: สไตล์สำหรับปุ่มรีเฟรช
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
});

