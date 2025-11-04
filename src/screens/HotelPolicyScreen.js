import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../Styles/PolicyScreenStyles';
import { API_URL } from '../../config'; // ✅ นำเข้า API_URL จากไฟล์ config

export default function PolicyScreen() {
  const navigation = useNavigation();
  // สถานะสำหรับเก็บข้อมูลนโยบายที่ดึงมา
  const [policies, setPolicies] = useState([]);
  // สถานะสำหรับแสดงสถานะการโหลด
  const [isLoading, setIsLoading] = useState(true);

  // ฟังก์ชันสำหรับดึงข้อมูลจาก API จริง
  const fetchPolicies = async () => {
    try {
      // ✅ แก้ไขตรงนี้: เปลี่ยน endpoint จาก /api/policies เป็น /api/hotelpolicy
      const res = await fetch(`${API_URL}/api/hotelpolicy`);
      if (!res.ok) {
        throw new Error('ไม่สามารถดึงข้อมูลนโยบายจาก API ได้');
      }
      const data = await res.json();
      setPolicies(data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงนโยบาย:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* ส่วนหัวของหน้า */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back-outline" size={30} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>นโยบายห้องพัก</Text>
          <View style={styles.placeholder} />
        </View>

        {/* แสดงสถานะการโหลด */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#005662" style={{ marginTop: 20 }} />
        ) : (
          // แสดงรายการนโยบาย
          policies.map((policy, index) => (
            <View key={index} style={styles.policyCard}>
              <Text style={styles.policyTitle}>{policy.title}</Text>
              <Text style={styles.policyContent}>{policy.content}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
