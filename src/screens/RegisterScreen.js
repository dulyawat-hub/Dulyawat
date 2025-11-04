// import React, { useState } from 'react';
// import {View,Text,TextInput,StyleSheet,TouchableOpacity,Image,Alert,Platform,ActivityIndicator,} from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import styles from '../Styles/RegisterScreenStyles';

// export default function RegisterScreen() {
//   // States สำหรับข้อมูลในฟอร์ม
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState('');
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigation = useNavigation();

//   // ฟังก์ชันแสดง Alert บนทุกแพลตฟอร์ม
//   const showAlertAllPlatforms = (title, message, buttons = []) => {
//     Alert.alert(title, message, buttons);
//     if (Platform.OS === 'web') {
//       const buttonText = buttons.map(b => b.text).join(', ');
//       window.alert(`${title}\n\n${message}${buttonText ? `\n\n[${buttonText}]` : ''}`);
//     }
//   };

//   // ฟังก์ชันสำหรับตรวจสอบว่ามีเฉพาะตัวอักษรหรือไม่
//   const validateName = (value) => {
//     const regex = /^[a-zA-Zก-ฮะ-์\s]*$/;
//     return regex.test(value) || value === '';
//   };

//   const handleFirstNameChange = (value) => {
//     if (validateName(value)) {
//       setFirstName(value);
//     }
//   };

//   const handleLastNameChange = (value) => {
//     if (validateName(value)) {
//       setLastName(value);
//     }
//   };

//   // ฟังก์ชันสำหรับจัดการการส่งฟอร์ม
//   const handleRegister = async () => {
//     setMessage('');

//     if (!firstName || !lastName || !email || !password) {
//       setMessage('กรุณากรอกข้อมูลให้ครบ');
//       setIsSuccess(false);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // ✅ แก้ไข: ส่ง firstName และ lastName แยกกันไปที่เซิร์ฟเวอร์
//       const res = await fetch('http://192.168.1.38:3000/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ firstName, lastName, email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage(data.message);
//         setIsSuccess(true);
//         // เมื่อสมัครสำเร็จ จะรอ 1.5 วินาที แล้วเด้งกลับไปหน้า Login
//         setTimeout(() => {
//           navigation.navigate('Login');
//         }, 1500);
//       } else {
//         setMessage(data.message || 'ไม่สามารถสมัครสมาชิกได้');
//         setIsSuccess(false);
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//       setMessage('เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
//       setIsSuccess(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.contentContainer}>
//         <Image
//           source={require('../../assets/m.png')}
//           style={styles.logo}
//           resizeMode="contain"
//         />
//         <Text style={styles.title}>สมัครสมาชิก</Text>

//         {message && (
//           <View style={[
//             styles.messageBox,
//             { backgroundColor: isSuccess ? '#d4edda' : '#f8d7da' },
//           ]}>
//             <Text style={[
//               styles.messageText,
//               { color: isSuccess ? '#155724' : '#721c24' },
//             ]}>
//               {message}
//             </Text>
//           </View>
//         )}

//         <View style={styles.nameInputsContainer}>
//           <TextInput
//             style={[styles.input, styles.nameInput]}
//             placeholder="ชื่อ"
//             value={firstName}
//             onChangeText={handleFirstNameChange}
//           />
//           <TextInput
//             style={[styles.input, styles.nameInput]}
//             placeholder="นามสกุล"
//             value={lastName}
//             onChangeText={handleLastNameChange}
//           />
//         </View>

//         <TextInput
//           style={styles.input}
//           placeholder="อีเมล"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />

//         <View style={styles.passwordContainer}>
//           <TextInput
//             style={styles.passwordInput}
//             placeholder="รหัสผ่าน"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={!showPassword}
//           />
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
//             <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={isLoading}>
//           {isLoading ? (
//             <ActivityIndicator color="#000" />
//           ) : (
//             <Text style={styles.loginButtonText}>สมัครสมาชิก</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

import React, { useState } from 'react';
import {View,Text,TextInput,StyleSheet,TouchableOpacity,Image,Alert,Platform,ActivityIndicator,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../Styles/RegisterScreenStyles';

// ✅ นำเข้าตัวแปร API_URL จากไฟล์ config.js
// Import the API_URL variable from the config.js file.
import { API_URL } from '../../config';

export default function RegisterScreen() {
  // States สำหรับข้อมูลในฟอร์ม
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // ฟังก์ชันแสดง Alert บนทุกแพลตฟอร์ม
  const showAlertAllPlatforms = (title, message, buttons = []) => {
    Alert.alert(title, message, buttons);
    if (Platform.OS === 'web') {
      const buttonText = buttons.map(b => b.text).join(', ');
      window.alert(`${title}\n\n${message}${buttonText ? `\n\n[${buttonText}]` : ''}`);
    }
  };

  // ฟังก์ชันสำหรับตรวจสอบว่ามีเฉพาะตัวอักษรหรือไม่
  const validateName = (value) => {
    const regex = /^[a-zA-Zก-ฮะ-์\s]*$/;
    return regex.test(value) || value === '';
  };

  const handleFirstNameChange = (value) => {
    if (validateName(value)) {
      setFirstName(value);
    }
  };

  const handleLastNameChange = (value) => {
    if (validateName(value)) {
      setLastName(value);
    }
  };

  // ฟังก์ชันสำหรับจัดการการส่งฟอร์ม
  const handleRegister = async () => {
    setMessage('');

    if (!firstName || !lastName || !email || !password) {
      setMessage('กรุณากรอกข้อมูลให้ครบ');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);

    try {
      // ✅ ใช้ตัวแปร API_URL ที่นำเข้าแทนการใส่ URL แบบ hardcode
      // Use the imported API_URL variable instead of a hardcoded URL.
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        // เมื่อสมัครสำเร็จ จะรอ 1.5 วินาที แล้วเด้งกลับไปหน้า Login
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      } else {
        setMessage(data.message || 'ไม่สามารถสมัครสมาชิกได้');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage('เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์');
      setIsSuccess(false);
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
        <Text style={styles.title}>สมัครสมาชิก</Text>

        {message && (
          <View style={[
            styles.messageBox,
            { backgroundColor: isSuccess ? '#d4edda' : '#f8d7da' },
          ]}>
            <Text style={[
              styles.messageText,
              { color: isSuccess ? '#155724' : '#721c24' },
            ]}>
              {message}
            </Text>
          </View>
        )}

        <View style={styles.nameInputsContainer}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="ชื่อ"
            value={firstName}
            onChangeText={handleFirstNameChange}
          />
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="นามสกุล"
            value={lastName}
            onChangeText={handleLastNameChange}
          />
        </View>

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
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.loginButtonText}>สมัครสมาชิก</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
