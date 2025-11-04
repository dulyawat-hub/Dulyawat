// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Image,
//   Platform,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// // นำเข้าสไตล์จากไฟล์ที่แยกออกมา
// import styles from '../Styles/ForgotPasswordStyles';

// function ForgotPasswordScreen() {
//   const [email, setEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const navigation = useNavigation();

//   // ฟังก์ชันแสดง Alert ที่ทำงานได้ทั้งบน mobile และ web
//   const showAlertAllPlatforms = (title, msg, buttons = []) => {
//     Alert.alert(title, msg, buttons);
//     if (Platform.OS === 'web') {
//       // For web, use a simple window.alert
//       window.alert(`${title}\n\n${msg}`);
//     }
//   };

//   const handleResetPassword = async () => {
//     setLoading(true);
//     setMessage('');
//     setError('');

//     if (!email || !newPassword || !confirmPassword) {
//       setError('กรุณากรอกข้อมูลให้ครบถ้วน');
//       setLoading(false);
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError('รหัสผ่านไม่ตรงกัน');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('http://192.168.1.38:3000/reset-password-insecure', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, newPassword }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage(data.message);
//         showAlertAllPlatforms('สำเร็จ', data.message, [
//           { text: 'OK', onPress: () => navigation.navigate('Login') }
//         ]);
//         setEmail('');
//         setNewPassword('');
//         setConfirmPassword('');
//       } else {
//         setError(data.message);
//         showAlertAllPlatforms('เกิดข้อผิดพลาด', data.message);
//       }
//     } catch (err) {
//       console.error('❌ Server Error:', err);
//       setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
//       showAlertAllPlatforms('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.contentContainer}>
//         {/* ใช้ Image component และ source จาก URL ภายนอก */}
//         <Image
//           source={require('../../assets/m.png')}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//         <Text style={styles.title}>รีเซ็ตรหัสผ่าน</Text>

//         {message || error ? (
//           <View style={[
//             styles.messageBox,
//             { backgroundColor: message ? '#d4edda' : '#f8d7da' },
//           ]}>
//             <Text style={[
//               styles.messageText,
//               { color: message ? '#155724' : '#721c24' },
//             ]}>
//               {message || error}
//             </Text>
//           </View>
//         ) : null}

//         <TextInput
//           style={styles.input}
//           placeholder="อีเมล"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         {/* ช่องรหัสผ่านใหม่พร้อมปุ่มแสดง/ซ่อน */}
//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={styles.passwordInput}
//             placeholder="รหัสผ่านใหม่"
//             value={newPassword}
//             onChangeText={setNewPassword}
//             secureTextEntry={!showNewPassword}
//           />
//           <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
//             <Ionicons
//               name={showNewPassword ? 'eye-off' : 'eye'}
//               size={24}
//               color="gray"
//               style={{ marginHorizontal: 10 }}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* ช่องยืนยันรหัสผ่านใหม่พร้อมปุ่มแสดง/ซ่อน */}
//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={styles.passwordInput}
//             placeholder="ยืนยันรหัสผ่านใหม่"
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//             secureTextEntry={!showConfirmPassword}
//           />
//           <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
//             <Ionicons
//               name={showConfirmPassword ? 'eye-off' : 'eye'}
//               size={24}
//               color="gray"
//               style={{ marginHorizontal: 10 }}
//             />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={[styles.loginButton, loading && styles.buttonDisabled]}
//           onPress={handleResetPassword}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#000" />
//           ) : (
//             <Text style={styles.loginButtonText}>รีเซ็ตรหัสผ่าน</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// export default ForgotPasswordScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// นำเข้าสไตล์จากไฟล์ที่แยกออกมา
import styles from '../Styles/ForgotPasswordStyles';
// ✅ นำเข้าตัวแปร API_URL ที่เพิ่มเข้ามา
import { API_URL } from '../../config';

function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigation = useNavigation();

  // ฟังก์ชันแสดง Alert ที่ทำงานได้ทั้งบน mobile และ web
  const showAlertAllPlatforms = (title, msg, buttons = []) => {
    Alert.alert(title, msg, buttons);
    if (Platform.OS === 'web') {
      // For web, use a simple window.alert
      window.alert(`${title}\n\n${msg}`);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    if (!email || !newPassword || !confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }

    try {
      // ✅ เปลี่ยนการใช้ URL แบบ hardcode มาใช้ตัวแปร API_URL
      const response = await fetch(`${API_URL}/reset-password-insecure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        showAlertAllPlatforms('สำเร็จ', data.message, [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message);
        showAlertAllPlatforms('เกิดข้อผิดพลาด', data.message);
      }
    } catch (err) {
      console.error('❌ Server Error:', err);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
      showAlertAllPlatforms('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* ใช้ Image component และ source จาก URL ภายนอก */}
        <Image
          source={require('../../assets/m.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>รีเซ็ตรหัสผ่าน</Text>

        {message || error ? (
          <View style={[
            styles.messageBox,
            { backgroundColor: message ? '#d4edda' : '#f8d7da' },
          ]}>
            <Text style={[
              styles.messageText,
              { color: message ? '#155724' : '#721c24' },
            ]}>
              {message || error}
            </Text>
          </View>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="อีเมล"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* ช่องรหัสผ่านใหม่พร้อมปุ่มแสดง/ซ่อน */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="รหัสผ่านใหม่"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <Ionicons
              name={showNewPassword ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
              style={{ marginHorizontal: 10 }}
            />
          </TouchableOpacity>
        </View>

        {/* ช่องยืนยันรหัสผ่านใหม่พร้อมปุ่มแสดง/ซ่อน */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="ยืนยันรหัสผ่านใหม่"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
              style={{ marginHorizontal: 10 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.loginButtonText}>รีเซ็ตรหัสผ่าน</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ForgotPasswordScreen;