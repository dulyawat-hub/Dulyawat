import React, { useState, useContext } from 'react';
// ✅ 1. เพิ่ม Platform เข้ามาใน import
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../Styles/LoginScreenStyles';
import { AuthContext } from './AuthContext';
import { API_URL } from '../../config';

// ✅ 2. อัปเกรดฟังก์ชัน showAlert ให้ทำงานได้ทั้งบนมือถือและเว็บ
const showAlert = (title, message, buttons = []) => {
    if (Platform.OS === 'web') {
        if (buttons.length > 0 && buttons.find(b => b.style === 'cancel')) {
            if (window.confirm(`${title}\n\n${message}`)) {
                const confirmButton = buttons.find(b => b.style !== 'cancel');
                if (confirmButton && confirmButton.onPress) confirmButton.onPress();
            } else {
                const cancelButton = buttons.find(b => b.style === 'cancel');
                if (cancelButton && cancelButton.onPress) cancelButton.onPress();
            }
        } else if (buttons.length > 0 && buttons[0].onPress) {
            window.alert(`${title}\n\n${message}`);
            buttons[0].onPress();
        } else {
            window.alert(`${title}\n\n${message}`);
        }
    } else {
        Alert.alert(title, message, buttons);
    }
};

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const { login } = useContext(AuthContext);
    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user, data.token);

                if (data.user.is_admin === 1) {
                    // ถ้าเป็นแอดมิน
                    showAlert('เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับแอดมิน', [
                        { text: 'ตกลง', onPress: () => navigation.replace('AdminDashboard') }
                    ]);
                } else {
                    // ถ้าเป็นผู้ใช้ทั่วไป
                    showAlert('เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับ', [
                        { text: 'ตกลง', onPress: () => navigation.replace('Home') }
                    ]);
                }
            } else {
                showAlert('เข้าสู่ระบบล้มเหลว', data.message || 'เกิดข้อผิดพลาดบางอย่าง');
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Image
                    source={require('../../assets/m.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>เข้าสู่ระบบ</Text>

                <TextInput
                    style={styles.input}
                    placeholder="อีเมล"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="รหัสผ่าน"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" style={{ marginHorizontal: 10 }} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.forgotButton}
                    onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotText}>ลืมรหัสผ่าน?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.loginButton, isLoading && { opacity: 0.5 }]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.registerText}>
                    หรือหากยังไม่มีบัญชี{' '}
                    <Text
                        style={styles.registerLink}
                        onPress={() => navigation.navigate('Register')}
                    >
                        สมัครสมาชิกที่นี่
                    </Text>
                </Text>
            </View>
        </View>
    );
}

