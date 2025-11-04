// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import LoginScreen from './src/screens/LoginScreen';
// import RegisterScreen from './src/screens/RegisterScreen';
// import HomeScreen from './src/screens/HomeScreen';
// import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
// // ✅ แก้ไขพาธการนำเข้าให้ถูกต้อง
// import { AuthProvider } from './src/screens/AuthContext';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     // ✅ นำ AuthProvider มาครอบ NavigationContainer
//     <AuthProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Home">
//           {/* 🏠 หน้าแรก */}
//           <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
//           {/* 🔐 หน้าล็อกอิน */}
//           <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'เข้าสู่ระบบ' }} />
//           {/* 📝 หน้าสมัครสมาชิก */}
//           <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'สมัครสมาชิก' }} />
//           {/* 🔐 หน้าลืมรหัส */}
//           <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'ลืมรหัสผ่าน' }} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </AuthProvider>
//   );
// }
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RoomListScreen from './src/screens/RoomListScreen';
import { AuthProvider } from './src/screens/AuthContext';
import PolicyScreen from './src/screens/PolicyScreen';
import MapScreen from './src/screens/MapScreen';
import HotelPolicyScreen from './src/screens/HotelPolicyScreen';
import CatsScreen from './src/screens/CatsScreen';
import RoomDetailScreen from './src/screens/RoomDetailScreen'
import AddEditCatScreen from './src/screens/AddEditCatScreen';
import BookingScreen from './src/screens/BookingScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import AdminDashboardScreen from './src/admin/AdminDashboardScreen';
import AdminRoomListScreen from './src/admin/AdminRoomListScreen';
import AdminAddEditRoomScreen from './src/admin/AdminAddEditRoomScreen';
import AdminBookingListScreen from './src/admin/AdminBookingListScreen';
import AdminStayHistoryScreen from './src/admin/AdminStayHistoryScreen';
import AdminUserListScreen from './src/admin/AdminUserListScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'เข้าสู่ระบบ' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'สมัครสมาชิก' }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'ลืมรหัสผ่าน' }} />
          <Stack.Screen name="RoomList" component={RoomListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Policy"component={PolicyScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="HotelPolicy" component={HotelPolicyScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cats" component={CatsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RoomDetail" component={RoomDetailScreen} />
          <Stack.Screen name="AddEditCat" component={AddEditCatScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Payment" component={PaymentScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="AdminRoomList" component={AdminRoomListScreen} options={{ title: 'จัดการห้องพัก' }} />
          <Stack.Screen name="AdminAddEditRoom" component={AdminAddEditRoomScreen} />
          <Stack.Screen name="AdminBookingList" component={AdminBookingListScreen} options={{ title: 'จัดการการจอง' }} />
          <Stack.Screen name="AdminStayHistory" component={AdminStayHistoryScreen} options={{ title: 'บันทึกการเข้าพัก' }} />
          <Stack.Screen name="AdminUserList" component={AdminUserListScreen} options={{ title: 'จัดการผู้ใช้' }} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
